import axios from 'axios';
import { toast } from 'react-toastify';

// class used for the Toastify error component styling
const toastErrorStyle = {
  backgroundColor: '#cc0000',
  opacity: 0.8,
  textAlign: 'center',
  fontSize: '18px'
};


export async function fetchAuthMe (baseUrl, token, setUserInfo)
{
  try {
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}/auth/me`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": `JWT ${token}`,
      },
    })
    setUserInfo(response.data);
  } catch (error) {
    console.log(error.response);
    let errorText = '';
    if (error.response.data.error !== undefined) {
      errorText = error.response.data.error;
    } else if (error.response.data.message !== undefined) {
      errorText = error.response.data.message;
    } else {
      errorText = 'Bad request';
    }
    toast.error(
      errorText, {
        position: 'top-right',
        hideProgressBar: true,
        style: toastErrorStyle
      }
    );
    setUserInfo(null);
  }
}


export async function fetchMyListings (baseUrl, token, setMylistings)
{
  try {
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}/listings/mylistings`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": `JWT ${token}`,
      },
    })
    await setMylistings(response.data.mylistings);
  } catch (error) {
    console.log(error.response);
    let errorText = '';
    if (error.response.data.error !== undefined) {
      errorText = error.response.data.error;
    } else if (error.response.data.message !== undefined) {
      errorText = error.response.data.message;
    } else {
      errorText = 'Bad request';
    }
    toast.error(
      errorText, {
        position: 'top-right',
        hideProgressBar: true,
        style: toastErrorStyle
      }
    );
    setMylistings(null);
  }
}


export async function fetchSearchListings (
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
  try {
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
  } catch (error) {
    console.log(error.response);
    let errorText = '';
    if (error.response.data.error !== undefined) {
      errorText = error.response.data.error;
    } else if (error.response.data.message !== undefined) {
      errorText = error.response.data.message;
    } else {
      errorText = 'Invalid input';
    }
    toast.error(
      errorText, {
        position: 'top-right',
        hideProgressBar: true,
        style: toastErrorStyle
      }
    );
    setSearchResults(null);
  }
}


export async function fetchSearchUsers (
    baseUrl, token, searchUserQuery, setSearchUserResults
  )
{
  let queryUrl = `${baseUrl}/users?username=${searchUserQuery}`;
  try {
    const response = await axios({
      method: 'GET',
      url: queryUrl,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": `JWT ${token}`,
      },
    })
    await setSearchUserResults(response.data.users);
  } catch (error) {
    console.log(error.response);
    let errorText = '';
    if (error.response.data.error !== undefined) {
      errorText = error.response.data.error;
    } else if (error.response.data.message !== undefined) {
      errorText = error.response.data.message;
    } else {
      errorText = 'Bad request';
    }
    toast.error(
      errorText, {
        position: 'top-right',
        hideProgressBar: true,
        style: toastErrorStyle
      }
    );
    setSearchUserResults(null);
  }
}


export async function fetchMyBookings (baseUrl, token, setMybookings)
{
  try {
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}/bookings/mybookings`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": `JWT ${token}`,
      },
    })
    await setMybookings(response.data.mybookings);
  } catch (error) {
    console.log(error.response);
    let errorText = '';
    if (error.response.data.error !== undefined) {
      errorText = error.response.data.error;
    } else if (error.response.data.message !== undefined) {
      errorText = error.response.data.message;
    } else {
      errorText = 'Bad request';
    }
    toast.error(
      errorText, {
        position: 'top-right',
        hideProgressBar: true,
        style: toastErrorStyle
      }
    );
    setMybookings(null);
  }
}


export async function fetchProfile (baseUrl, token, username, setProfile)
{
  try {
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}/profiles/${username}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": `JWT ${token}`,
      },
    })
    await setProfile(response.data);
  } catch (error) {
    console.log(error.response);
    let errorText = '';
    if (error.response.data.error !== undefined) {
      errorText = error.response.data.error;
    } else if (error.response.data.message !== undefined) {
      errorText = error.response.data.message;
    } else {
      errorText = 'Bad request';
    }
    toast.error(
      errorText, {
        position: 'top-right',
        hideProgressBar: true,
        style: toastErrorStyle
      }
    );
    setProfile(null);
  }
}


export async function fetchProfileListings (
    baseUrl, token, username, setProfileListings
  )
{
  try {
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}/profiles/${username}/listings`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": `JWT ${token}`,
      },
    })
    await setProfileListings(response.data);
  } catch (error) {
    console.log(error.response);
    let errorText = '';
    if (error.response.data.error !== undefined) {
      errorText = error.response.data.error;
    } else if (error.response.data.message !== undefined) {
      errorText = error.response.data.message;
    } else {
      errorText = 'Bad request';
    }
    toast.error(
      errorText, {
        position: 'top-right',
        hideProgressBar: true,
        style: toastErrorStyle
      }
    );
    setProfileListings(null);
  }
}


export async function followUserRequest (baseUrl, token, followee_user_id)
{
  try {
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
    console.log(response)
  } catch (error) {
    console.log(error.response);
    let errorText = '';
    if (error.response.data.error !== undefined) {
      errorText = error.response.data.error;
    } else if (error.response.data.message !== undefined) {
      errorText = error.response.data.message;
    } else {
      errorText = 'Bad request';
    }
    toast.error(
      errorText, {
        position: 'top-right',
        hideProgressBar: true,
        style: toastErrorStyle
      }
    );
  }
}


export async function unfollowUserRequest (baseUrl, token, unfollow_username)
{
  try {
    const response = await axios({
      method: 'DELETE',
      url: `${baseUrl}/followers/unfollow/${unfollow_username}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": `JWT ${token}`,
      },
    })
    console.log(response)
  } catch (error) {
    console.log(error.response);
    let errorText = '';
    if (error.response.data.error !== undefined) {
      errorText = error.response.data.error;
    } else if (error.response.data.message !== undefined) {
      errorText = error.response.data.message;
    } else {
      errorText = 'Bad request';
    }
    toast.error(
      errorText, {
        position: 'top-right',
        hideProgressBar: true,
        style: toastErrorStyle
      }
    );
  }
}


export async function fetchUserFeed (baseUrl, token, setUserFeed)
{
  try {
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}/auth/userfeed`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": `JWT ${token}`,
      },
    })
    setUserFeed(response.data);
  } catch (error) {
    console.log(error.response);
    let errorText = '';
    if (error.response.data.error !== undefined) {
      errorText = error.response.data.error;
    } else if (error.response.data.message !== undefined) {
      errorText = error.response.data.message;
    } else {
      errorText = 'Bad request';
    }
    toast.error(
      errorText, {
        position: 'top-right',
        hideProgressBar: true,
        style: toastErrorStyle
      }
    );
    setUserFeed(null);
  }
}


export async function fetchRecommendations (baseUrl, token, setRecListings, top5)
{
  let reqUrl = `${baseUrl}/recommendations/`;
  top5 === true ? 
    reqUrl += `top_5_rated_listings`:
    reqUrl += `listings`;
  try {
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
  } catch (error) {
    console.log(error.response);
    let errorText = '';
    if (error.response.data.error !== undefined) {
      errorText = error.response.data.error;
    } else if (error.response.data.message !== undefined) {
      errorText = error.response.data.message;
    } else {
      errorText = 'Bad request';
    }
    toast.error(
      errorText, {
        position: 'top-right',
        hideProgressBar: true,
        style: toastErrorStyle
      }
    );
    setRecListings(null);
  }
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
