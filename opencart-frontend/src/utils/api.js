import axios from "axios";
import { useRouter } from 'next/router';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;




export const getAPI = async (url) => {
  const router = useRouter();  // Move this line inside the function

  try {
    const token = localStorage.getItem("authToken");
    const { data } = await axios.get(BASE_URL + url, {
      headers: {
        'x-access-token': token,
      },
      withCredentials: true,
    });

    if (data.message === false) {
      localStorage.clear()
      router.push('/login');
    } else if (data.message === true) {
      return data;
    }
    // console.log(data)
  } catch (err) {
    localStorage.clear()
    router.push('/login');
  }
};


export const deleteAPI = async (url) => {
  try {
    const token = localStorage.getItem("authToken");
    const { data } = await axios.delete(BASE_URL + url,  {  headers: {
      'x-access-token': token,
  } }, {
      withCredentials: true,
    });
    return data;
  } catch (err) {
    print(err);
  }
};

export const postLoginAPI = async (url, json) => {
  try {
    const { data } = await axios.post(BASE_URL + url, json, {
      withCredentials: true,
    });
    return data;
  } catch (err) {
    print(err);
    return err;
  }
};

export const postAPI = async (url, json) => {

  try {
    const token = localStorage.getItem("authToken");
    const { data } = await axios.post(BASE_URL + url,  {  headers: {
      'x-access-token': token,
  } }, json, {
      withCredentials: true,
    });
    return data;
  } catch (err) {
    print(err);
    return err;
  }
};

export const putAPI = async (url, json) => {
  try {
    const token = localStorage.getItem("authToken");
    const { data } = await axios.put(BASE_URL + url, {  headers: {
      'x-access-token': token,
  } }, json, {
      withCredentials: true,
    });
    return data;
  } catch (err) {
    print(err);
    return err;
  }
};




