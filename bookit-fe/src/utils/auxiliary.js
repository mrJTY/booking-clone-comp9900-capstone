import axios from 'axios';
// import { toast } from 'react-toastify';

// class used for the Toastify error component styling
// const toastErrorStyle = {
//   backgroundColor: '#cc0000',
//   opacity: 0.8,
//   textAlign: 'center',
//   fontSize: '18px'
// };

export async function fetchMyListings (baseUrl, token, setMylistings)
{
  const response = await axios({
    method: 'GET',
    url: `${baseUrl}/listings/mylistings`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `JWT ${token}`,
    },
  })

  console.log(response.data)

  await setMylistings(response.data.mylistings);
}


export async function fetchSearchListings
  (
    baseUrl, token, searchQuery, searchCategoriesFlat,
    useSearchTimeFrame, searchStartDatetime, searchEndDatetime,
    setSearchResults,
  )
{
  let queryUrl = `${baseUrl}/listings?search_query=${searchQuery}`;
  useSearchTimeFrame === true && (
    queryUrl += `&start_time=${searchStartDatetime}&end_time=${searchEndDatetime}`
  );
  searchCategoriesFlat.length > 0 && (
    queryUrl += `&categories=${searchCategoriesFlat}`
  );

  console.log(queryUrl);

  const response = await axios({
    method: 'GET',
    url: queryUrl,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `JWT ${token}`,
    },
  })
  await setSearchResults(response.data.listings);
}

export async function fetchSearchUsers (baseUrl, token, searchQuery, setSearchUserResults)
{
  let queryUrl = `${baseUrl}/users?username=${searchQuery}`;

  console.log(queryUrl);

  const response = await axios({
    method: 'GET',
    url: queryUrl,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `JWT ${token}`,
    },
  })

  console.log(response.data)

  await setSearchUserResults(response.data.users);
}


export async function fetchMyBookings (baseUrl, token, setMybookings)
{
  const response = await axios({
    method: 'GET',
    url: `${baseUrl}/bookings/mybookings`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `JWT ${token}`,
    },
  })
  
  console.log('mybookings response is:')
  console.log(response)

  await setMybookings(response.data.mybookings);
}

// validate an image upload
export const fileToDataUrl = (file) => {
  if (file === null) {
    return 0;
  } else {
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const valid = validFileTypes.find(type => type === file.type);
    // Invalid input
    if (!valid) {
      return -1;
    } else {
      const reader = new FileReader();
      const dataUrlPromise = new Promise((resolve, reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
      });
      reader.readAsDataURL(file);
      return dataUrlPromise;
    }
  }
}
