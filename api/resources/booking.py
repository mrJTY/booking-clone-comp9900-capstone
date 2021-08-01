import logging
import uuid

from datetime import datetime, timezone
from api import db
from api.models.availability import AvailabilityModel
from api.models.listing import ListingModel
from api.models.booking import BookingModel
from api.models.rating import RatingModel
from api.utils.req_handling import *
from flask_login import current_user
from flask_restplus import Resource, fields
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy.sql import select
from api import engine
import api

booking = api.api.namespace("bookings", description="booking operations")

create_booking_details = api.api.model(
    "booking",
    {
        "booking_id": fields.String(required=True, description="The ID of the booking"),
        "listing_id": fields.Integer(
            required=True, description="The listing_id that the booking is for"
        ),
        "availability_id": fields.Integer(
            required=True,
            description="The availability_id linked to the availabilities table",
        ),
    },
)

get_booking_details = api.api.model(
    "booking",
    {
        "booking_id": fields.String(required=True, description="The ID of the booking"),
        "user_id": fields.Integer(
            required=True, description="The user_id who owns the booking"
        ),
        "listing_id": fields.Integer(
            required=True, description="The listing_id that the booking is for"
        ),
        "availability_id": fields.Integer(
            required=True,
            description="The availability_id linked to the availabilities table",
        ),
    },
)


# Current time vs start time
def start_vs_current(start, current):
    interval = (float(start) - float(current) * 1000.0) / (60.0 * 60.0 * 1000.0)
    return int(interval)


# start time vs end time
def start_vs_end(end, start):
    interval = round((float(end) - float(start)) / (60.0 * 60.0 * 1000.0))
    return int(interval)


# See example: https://github.com/noirbizarre/flask-restplus/blob/master/examples/todo.py
@booking.route("/<booking_id>")
@booking.param("booking_id", "The booking identifier")
@booking.response(404, "booking not found")
class Booking(Resource):
    @booking.doc(description=f"booking_id must be provided")
    @booking.marshal_with(get_booking_details)
    def get(self, booking_id):
        logging.info(f"Getting booking {booking_id}")
        return BookingModel.query.get_or_404(booking_id).to_dict()

    @booking.doc(description=f"booking_id must be provided")
    @booking.marshal_with(get_booking_details)
    def delete(self, booking_id):
        logging.info(f"Deleting booking {booking_id}")
        try:
            b = BookingModel.query.get_or_404(booking_id).to_dict()
            current_unixtime = datetime.now().strftime("%s")
            booking_time = AvailabilityModel.query.get_or_404(
                b["availability_id"]
            ).to_dict()
            if (start_vs_current(booking_time["start_time"], current_unixtime)) < 72:
                raise CannotUpdateLessThan3DaysOfBooking
            # TODO(Harris): BookedMoreThan10HoursPerMonth isn't being thrown
            b1 = BookingModel.query.filter(BookingModel.booking_id == booking_id)
            b = BookingModel.query.get_or_404(booking_id)
            a = AvailabilityModel.query.get_or_404(b.to_dict()["availability_id"])
            # Mark as available
            a.is_available = True
            flag_modified(a, "availability_id")
            db.session.merge(a)
            db.session.flush()
            b1.delete()
            db.session.commit()
            return b1, 204

        except BookedMoreThan10HoursPerMonth as e:
            # Well this error isn't being thrown so that's why it's not getting returned
            return {"error": e.message}, 403

        except CannotUpdateLessThan3DaysOfBooking as e:
            return {"error": e.message}, 403

        except Exception as e:
            logging.error(e)
            # Just a generic error
            api.api.abort(500, "Cannot delete booking")

    @booking.doc(description=f"booking_id must be provided")
    # Removing the marshalling because the error can return something else
    # @booking.marshal_with(create_booking_details)
    def put(self, booking_id):
        logging.info(f"Updating booking {booking_id}")
        # get booking id
        content = get_request_json()
        try:
            new_time = AvailabilityModel.query.get_or_404(
                content["availability_id"]
            ).to_dict()

            new_time_month = datetime.fromtimestamp(
                new_time["start_time"] / 1000
            ).strftime("%m")
            b = BookingModel.query.get_or_404(booking_id).to_dict()
            old_time = AvailabilityModel.query.get_or_404(
                b["availability_id"]
            ).to_dict()
            current_unixtime = datetime.now().strftime("%s")
            # No updated booking is allowed if the difference between now and start date is less than 3 days
            if (start_vs_current(old_time["start_time"], current_unixtime)) < 72:
                raise CannotUpdateLessThan3DaysOfBooking
            # New booking cannot allow a user more than 10 hours in a month - note that this is based on the consumer
            list_bookings = BookingModel.query.filter_by(
                user_id=current_user.user_id
            ).all()
            list_bookings = [l.to_dict() for l in list_bookings]
            hours_booked = 0

            ##Search through the existing bookings
            for i in range(len(list_bookings)):
                timeslot = AvailabilityModel.query.get_or_404(
                    list_bookings[i]["availability_id"]
                ).to_dict()
                if (
                    datetime.fromtimestamp(timeslot["start_time"] / 1000).strftime("%m")
                    == new_time_month
                ):
                    get_interval = start_vs_end(
                        timeslot["end_time"], timeslot["start_time"]
                    )
                    hours_booked += get_interval
            get_new_booking_interval = start_vs_end(
                new_time["end_time"], new_time["start_time"]
            )
            if (hours_booked + get_new_booking_interval) > 10:
                raise BookedMoreThan10HoursPerMonth
            b1 = BookingModel.query.get_or_404(booking_id)
            old_avail = AvailabilityModel.query.get_or_404(b["availability_id"])
            b1.user_id = current_user.user_id
            # update the booking data
            b1.listing_id = content["listing_id"]
            b1.availability_id = content["availability_id"]
            # Not only this, but we need to update the avaliability_id details as well
            flag_modified(b1, "availability_id")
            db.session.merge(b1)
            # Note - update the old avaliability such that it will go back to true
            old_avail.is_available = True
            flag_modified(old_avail, "is_available")
            db.session.merge(old_avail)
            db.session.flush()
            db.session.commit()
            return b1.to_dict()

        except BookedMoreThan10HoursPerMonth as e:
            return {"error": e.message}, 403

        except CannotUpdateLessThan3DaysOfBooking as e:
            return {"error": e.message}, 403

        except Exception as e:
            logging.error(e)
            api.api.abort(500, f"{e}")


@booking.route("")
class BookingList(Resource):
    @booking.doc(description=f"Creates a new booking")
    @booking.expect(create_booking_details)
    # Removing this marshalling because error returns something else
    # @booking.marshal_with(get_booking_details)
    def post(self):
        content = get_request_json()
        try:
            # Receive contents from request
            logging.info(content)
            user_id = current_user.user_id
            booking_id = str(uuid.uuid4())
            listing_id = content["listing_id"]
            availability_id = content["availability_id"]

            # Check that the availability is still open
            a = AvailabilityModel.query.get_or_404(availability_id)
            if a is None:
                raise AvailabilityIdNotFound(availability_id)
            if not a.is_available:
                raise AvailabilityIdNotAvailable(availability_id)
            if current_user.user_id != user_id:
                raise ValueError(
                    "Token invalid, you can't request for a user that is not you!"
                )
            # New booking cannot allow a user more than 10 hours in a month
            new_time = AvailabilityModel.query.get_or_404(
                content["availability_id"]
            ).to_dict()
            new_time_month = datetime.fromtimestamp(
                new_time["start_time"] / 1000
            ).strftime("%m")
            list_bookings = BookingModel.query.filter_by(
                user_id=current_user.user_id
            ).all()
            list_bookings = [l.to_dict() for l in list_bookings]
            hours_booked = 0
            ##Search through the existing bookings
            for i in range(len(list_bookings)):
                timeslot = AvailabilityModel.query.get_or_404(
                    list_bookings[i]["availability_id"]
                ).to_dict()
                if (
                    datetime.fromtimestamp(timeslot["start_time"] / 1000).strftime("%m")
                    == new_time_month
                ):
                    get_interval = start_vs_end(
                        timeslot["end_time"], timeslot["start_time"]
                    )
                    hours_booked += get_interval
            get_new_booking_interval = start_vs_end(
                new_time["end_time"], new_time["start_time"]
            )
            if (hours_booked + get_new_booking_interval) > 10:
                raise BookedMoreThan10HoursPerMonth()
            # The following steps must be atomic
            # 1. Make a booking
            b = BookingModel(
                booking_id=booking_id,
                user_id=user_id,
                listing_id=listing_id,
                availability_id=availability_id,
            )
            db.session.add(b)

            # 2. Mark the availability_id not available
            a.is_available = False
            db.session.add(a)

            # Commit changes to db
            db.session.commit()

            # Return the bookingbooking_time
            booking_id = b.booking_id
            return BookingModel.query.get_or_404(booking_id).to_dict()

        except BookedMoreThan10HoursPerMonth as e:
            return {"error": e.message}, 403

        except CannotUpdateLessThan3DaysOfBooking as e:
            return {"error": e.message}, 403

        except Exception as e:
            logging.error(e)
            api.api.abort(500, f"{e}")


@booking.route("/mybookings")
class MyBookings(Resource):
    @booking.doc(description=f"Fetch my bookings")
    def get(self):
        query_text = f"""
        select 
            b.*,
            l.*,
            a.*,
            r.rating_id,
            r.rating,
            r.comment
        from bookings as b
        join listings as l 
            on l.listing_id = b.listing_id
        join availabilities as a
            on a.availability_id = b.availability_id
        left join ratings as r
            on r.booking_id = b.booking_id
        where
            b.user_id = {current_user.user_id}
        limit {api.config.Config.RESULT_LIMIT}
        """
        with engine.connect() as conn:
            results = conn.execute(query_text)
            my_bookings = [dict(r) for r in results]
            out = {
                "past": [],
                "upcoming": [],
            }
            for b in my_bookings:
                if b["end_time"] < int(datetime.now().strftime("%s")) * 1000:
                    out["past"].append(b)
                else:
                    out["upcoming"].append(b)
            return {"mybookings": out}


# Exceptions
class AvailabilityIdNotFound(Exception):
    """
    Raised when availability_id is not found
    """

    def __init__(self, availability_id):
        self.message = f"availability_id {availability_id} not found"
        super().__init__(self.message)


class AvailabilityIdNotAvailable(Exception):
    """
    Raised when availability_id is not available
    """

    def __init__(self, availability_id):
        self.message = f"availability_id {availability_id} not available"
        super().__init__(self.message)


class BookedMoreThan10HoursPerMonth(Exception):
    """
    Raised when availability_id is not available
    """

    def __init__(
        self,
    ):
        self.message = "Cannot book more than 10 hours per calendar month"
        super().__init__(self.message)


class CannotUpdateLessThan3DaysOfBooking(Exception):
    """
    Raised when availability_id is not available
    """

    def __init__(
        self,
    ):
        self.message = (
            "Cannot update booking less than 3 days of start time of the booking"
        )
        super().__init__(self.message)
