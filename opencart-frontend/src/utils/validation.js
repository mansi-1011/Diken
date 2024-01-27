import * as Yup from "yup";

export const initialLogin = { username: "", password: "" };

export const loginScheme = Yup.object({
  username: Yup.string().required("Please enter your username"),
    password: Yup.string().required("Please enter your password"),
  });