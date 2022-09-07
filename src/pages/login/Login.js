import "./login.css";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { SignIn } from "../../../src/features/authSlice";

const Login = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [work_email, setwork_email] = useState("");
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
      try {
        await axios
          .post("http://localhost:5000/api/auth/login", {
            work_email,
            password,
          })
          .then((res) => {
            dispatch(SignIn(res.data.user));

            navigate("/messenger");
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="main">
      <div className="headline">
        <h1>Login</h1>
        <p>Sign In to your account</p>
      </div>
      <div className="Loginform">
        <input
          type="work_email"
          required
          value={work_email}
          onChange={(e) => setwork_email(e.target.value)}
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" onClick={submitHandler}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
