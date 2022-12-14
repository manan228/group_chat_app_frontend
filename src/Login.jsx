import axios from "axios";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const onLoginFormHandler = async (e) => {
    e.preventDefault();

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    const loginObj = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        loginObj
      );

      const token = response.data.token;

      localStorage.setItem("token", token);

      navigate("/group-chat-app");
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <>
      <form onSubmit={onLoginFormHandler}>
        <div>
          <label>Email</label>
          <input ref={emailInputRef} type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef} type="password" required />
        </div>
        <button>Login</button>
      </form>
      <button onClick={() => navigate("/signup")}>SignUp</button>
    </>
  );
};

export default Login;
