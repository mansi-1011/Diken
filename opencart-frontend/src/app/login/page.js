"use client";
import style from "./login.module.css";
// import logo from "../../assets/logo.png";
import ads from "../../assets/login.webp";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useState } from "react";
import { initialLogin, loginScheme } from "@/src/utils/validation";
import {  postLoginAPI, print } from "@/src/utils/api";
import { toast } from "react-toastify";
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { userData } from "@/slice/userSlice";
import viewIcon from "@/src/assets/icon/view_icon.png";
import hiddenIcon from "@/src/assets/icon/hidden_icon.png";
import Navbar from "@/src/component/navbar/Navbar";
import Cookies from "js-cookie";

export default function Login() {
  const route = useRouter();
  // const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    values: valuesL,
    errors: errorsL,
    touched: touchedL,
    handleBlur: handleBlurL,
    handleChange: handleChangeL,
    handleSubmit: handleSubmitL,
  } = useFormik({
    initialValues: initialLogin,
    validationSchema: loginScheme,
    onSubmit: async (e, action) => {

      setLoading(true);
          const data = await postLoginAPI("/api/user/auth", e);
          console.log(data)
          if (data.status === true) {
            // Cookies.setItem("authToken", data.token);
            Cookies.set('authToken', data.token);
            // dispatch(userData(data.business_info));
            route.replace("/home");
            action.resetForm();
          } else {
            toast.error(data.message);
          }

      setLoading(false);
    },
  });

  return (
    <>
      <Navbar />
      <div className={style.login}>
        <form className={style.login_form} onSubmit={handleSubmitL}>
          <div>
            <p>Sign in</p>
          </div>

          <div className={style.form_control}>
            <input
              type="text"
              placeholder="username"
              name="username"
              value={valuesL.username}
              onChange={handleChangeL}
              onBlur={handleBlurL}
              autoComplete="off"
            />
            {errorsL.username && touchedL.username ? (
              <p className={style.error}>{errorsL.username}</p>
            ) : null}
          </div>
          <div className={style.form_control}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={valuesL.password}
              onChange={handleChangeL}
              onBlur={handleBlurL}
              autoComplete="off"
            />
            <img
              className={style.img_icon}
              onClick={() => setShowPassword(!showPassword)}
              src={showPassword ? viewIcon.src : hiddenIcon.src}
              alt="icon"
            />
            {errorsL.password && touchedL.password ? (
              <p className={style.error}>{errorsL.password}</p>
            ) : null}
          </div>
          <div>
            <button
              className={`${style.login_submit}`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign in"}
            </button>
          </div>
          {/* <div>
            <p>Forget Password? </p>{" "}
            <span
              className="pointer"
              onClick={() => route.push("/forgotpassword")}
            >
              {" "}
              Reset Here
            </span>
          </div> */}
        </form>
      </div>
    </>
  );
}
