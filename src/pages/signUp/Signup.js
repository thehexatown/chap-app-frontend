import "./signUp.css";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RequestUrl from "../../config/apiUrl";
import { SpinnerCircular } from "spinners-react";

import { SignIn } from "../../features/authSlice";

const SignUp = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [work_email, setwork_email] = useState("");
  const [name, setName] = useState("");
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
          .post(RequestUrl + "/api/auth/register", {
            name,
            work_email,
            password,
          })
          .then((res) => {
            console.log(res.data);
            setLoading(false);
            navigate("/");
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

  const navigateToLogin = () => {
    navigate("/");
  };

  return (
    <>
      <div className="container">
        <div className="SignUp">
          <div className="brand">
            {/* <img src="/icons/brand.svg" /> */}
            <h2>Chat App Sign Up</h2>
          </div>
          <div className="SignUpFOrm">
            <div className="input">
              <label>Name</label>
              <input type="text" onChange={(e) => setName(e.target.value)} />
            </div>
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
                "SignUp"
              )}
            </button>
          </div>
          <div className="loginLink">
            <p>
              Already have an account?
              <span onClick={navigateToLogin}>Login</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
