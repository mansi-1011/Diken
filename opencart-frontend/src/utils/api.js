import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const getAPI = async (url) => {
  try {
    const { data } = await axios.get(BASE_URL + url, { withCredentials: true });
    // console.log(data)
    return data;
  } catch (err) {
    print(err);
  }
};
export const deleteAPI = async (url) => {
  try {
    const { data } = await axios.delete(BASE_URL + url, {
      withCredentials: true,
    });
    return data;
  } catch (err) {
    print(err);
  }
};

export const postAPI = async (url, json) => {
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
export const postMultipartAPI = async (url, json) => {
  try {
    const { data } = await axios.post(BASE_URL + url, json, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data"
    },

    });
    return data;
  } catch (err) {
    print(err);
    return err;
  }
};

export const putAPI = async (url, json) => {
  try {
    const { data } = await axios.put(BASE_URL + url, json, {
      withCredentials: true,
    });
    return data;
  } catch (err) {
    print(err);
    return err;
  }
};

export const createOrder = async (values) => {
  try {
    const data = values.details.filter((i) => {
      i.filter((i) => i.Qty !== 0);
    });
    values.form = data;
    console.log("create order values", values);

    const res = await postMultipartAPI("/users/create-order", values);
    console.log("create order response", res);
    return res;
  } catch (error) {
    return error;
  }
};

export const getBlobAPI = async (url) => {
  try {
    const res = await axios.get(BASE_URL + url, {
      responseType: "blob",
      withCredentials: true,
    });


    return res.data;
  } catch (err) {
    print(err);
  }
};
export const getBlobAPIForExcel = async (url) => {
  try {
    const res = await axios.get(BASE_URL + url, {
      responseType: "blob",
      withCredentials: true,
    });


    return res.data;
  } catch (err) {
    print(err);
  }
};