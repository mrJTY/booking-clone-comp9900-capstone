# Saksham's Diary (z5164624)

# Week 1
- Harris and I decided we were interested in BookIt project
- We found 2 other group members to form a group with(Vidan & Justin)
- Started brainstorming ideas and discussed the software we would use
- Joined Slack channel for discussion 
- Started preparing 

# Week 2
- Joined Jira and Github
- We had to decide between two possible options - either use a cloud service like AWS, or run locally using Flask/Django
- Started brainstorming ideas for the recommendation engine and NLP feedback functionality for the project proposal 
- Joined group discussions with my team to discuss roadblocks and possible solutions. 

# Week 3
- Wrote up my section for the project proposal (recommender engine and NLP feedback) 
- We decided to use Flask instead of AWS as the tutor said they had to be able to run our code on their end  
- Started doing research around how I would implement the recommender engine 

# Week 4
- Submitted project proposal 
- Learned to create test cases
- Successfully wrote and tested some test cases for inserting and updating users into our database

# Week 5
- I was assigned with generating fake data for users and bookings 
- Researched 20 different venues across 4 categories and wrote them to a csv file 
- At the end of the Sprint meeting, I was assigned with making sure that users can only book a maximum of 10 hours per month

# Week 6
- Wrote code in the generate_fake_data.py file which reads data from the aforementioned csv file and inserts into database
- Wrote code to assign each of the bookings to a random user. 
- Continued working on recommender engine, especially brainstorming which features to use and how the system would work

# Week 7
- Added more data for listing venues, users, and ratings to csv file
- Worked on implementing the function responsible for reading the csv file and appropriately adding data to database. I had to make sure that the reviews were properly distributed across different listings.
- Researched methods to perform sentiment analysis for the recommender system. I also explored more methods to implement the recommender system and determine how the top 5 venues would be selected. 

# Week 8
- Finally decided on using the VADER algorithm to perform sentiment analysis on reviews. 
- Implemented the recommender system by ordering each venue based on user's past booking history, average rating, and average sentiment based on reviews. 
- Spent time figuring out how to convert the output of my recommender engine to an appropriate JSON format which would be used to display the recommendations on the front end. 

# Week 9
- Wrote up my section for the project report. I provided a detailed description of how the recommender system works (especially sentiment analysis) and also the challenges I faced in implementing it. 
- Patched up some bug fixed on my recommender system. 
- As a team, we did a trial run to practise for our demonstration next week. I prepared by writing a script for my demo on the recommender system. 