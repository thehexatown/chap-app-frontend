import "./login.css";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SpinnerCircular } from "spinners-react";
import RequestUrl from "../../config/apiUrl";
import { SignIn } from "../../../src/features/authSlice";

const Login = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [work_email, setwork_email] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);

  const submitHandler = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    if (work_email && password && !validated) {
      setLoading(true);
      try {
        await axios
          .post(RequestUrl + "/api/auth/login", {
            work_email,
            password,
          })
          .then((res) => {
            setLoading(false);
            dispatch(SignIn(res.data.user));

            navigate("/messenger");
          })
          .catch((error) => {
            setLoading(false);
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const navigateToSignUp = () => {
    navigate("/signUp");
  };
  return (
    <>
      <div className="container">
        <div className="Login">
          <div className="brand">
            {/* <img src="/icons/brand.svg" /> */}
            <h2>Chat Login</h2>
          </div>
          <div className="loginFOrm">
            <div className="input">
              <label>Email Address</label>
              <input
                type="text"
                onChange={(e) => setwork_email(e.target.value)}
              />
            </div>
            <div className="input">
              <label>Password</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="button" onClick={submitHandler}>
              {loading == true ? (
                <SpinnerCircular size="30" color="white" />
              ) : (
                "Login"
              )}
            </button>
          </div>
          <div className="signUpLink">
            <p>
              Don’t have an account?
              <span onClick={navigateToSignUp}>Sign up</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
