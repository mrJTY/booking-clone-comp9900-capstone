import axios from 'axios';
// import { toast } from 'react-toastify';

// class used for the Toastify error component styling
// const toastErrorStyle = {
//   backgroundColor: '#cc0000',
//   opacity: 0.8,
//   textAlign: 'center',
//   fontSize: '18px'
// };

export async function fetchMyListings (baseUrl, username, password, setMylistings)
{
  const response = await axios({
    method: 'GET',
    url: `${baseUrl}/listings/mylistings`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Password ${password}`,
      Username: `${username}`,
    },
  })
  await setMylistings(response.data.mylistings);
}

// validate an image upload
export const fileToDataUrl = (file) => {
  if (file === null) {
    return 0;
  } else {
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
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
