import axios from 'axios';
// import { toast } from 'react-toastify';

// class used for the Toastify error component styling
// const toastErrorStyle = {
//   backgroundColor: '#cc0000',
//   opacity: 0.8,
//   textAlign: 'center',
//   fontSize: '18px'
// };

export async function fetchAuthMe (baseUrl, token, setUserInfo)
{
  const response = await axios({
    method: 'GET',
    url: `${baseUrl}/auth/me`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `JWT ${token}`,
    },
  })
  
  console.log('auth me response is:')
  console.log(response)
  
  setUserInfo(response.data);
}


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


export async function fetchSearchUsers (baseUrl, token, searchUserQuery, setSearchUserResults)
{
  let queryUrl = `${baseUrl}/users?username=${searchUserQuery}`;

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


export async function fetchProfile (baseUrl, token, username, setProfile)
{
  const response = await axios({
    method: 'GET',
    url: `${baseUrl}/profiles/${username}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `JWT ${token}`,
    },
  })
  
  console.log('GET profile response is:')
  console.log(response)

  await setProfile(response.data);
}


export async function fetchProfileListings (baseUrl, token, username, setProfileListings)
{
  const response = await axios({
    method: 'GET',
    url: `${baseUrl}/profiles/${username}/listings`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `JWT ${token}`,
    },
  })
  
  console.log('GET profile listings response is:')
  console.log(response)

  await setProfileListings(response.data);
}


export async function followUserRequest (baseUrl, token, followee_user_id)
{
  const response = await axios({
    method: 'POST',
    url: `${baseUrl}/followers/follow`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `JWT ${token}`,
    },
    data: {
      "influencer_user_id": followee_user_id,
    }
  })
  
  console.log('POST follow response is:')
  console.log(response)
  
}


export async function unfollowUserRequest (baseUrl, token, unfollow_username)
{
  const response = await axios({
    method: 'DELETE',
    url: `${baseUrl}/followers/unfollow/${unfollow_username}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `JWT ${token}`,
    },
  })
  
  console.log('DELETE ufollow response is:')
  console.log(response)
  
}


export async function fetchUserFeed (baseUrl, token, setUserFeed)
{
  const response = await axios({
    method: 'GET',
    url: `${baseUrl}/auth/userfeed`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `JWT ${token}`,
    },
  })
  
  console.log('user feed response is:')
  console.log(response)
  
  setUserFeed(response.data);
}


export async function fetchRecommendations (baseUrl, token, setRecListings, top5)
{
  let reqUrl = `${baseUrl}/recommendations/`;
  top5 === true ? 
    reqUrl += `top_5_rated_listings`:
    reqUrl += `listings`;

  const response = await axios({
    method: 'GET',
    url: reqUrl,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `JWT ${token}`,
    },
  })
  
  setRecListings(response.data);
}

// convert an image to a base64 image src
export const imageToBase64 = (imageFile, setFunc) => {
  if (!imageFile || imageFile === null) {
    return -1;
  }
  const validImage = ['image/jpeg', 'image/png', 'image/jpg'].includes(imageFile.type);
  if (!validImage) {
    return -1;
  } else {
    const reader = new FileReader();
    const base64Promise = new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(imageFile);
    base64Promise.then((base64url) => {
      setFunc(`${base64url}`);
    })
  }
}
