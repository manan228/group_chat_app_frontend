import axios from "axios";
import React, { useRef, useState } from "react";

const SignUp = () => {
  console.log(`inside signup`);
  const [error, setError] = useState(false);

  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const phoneInputRef = useRef();
  const passwordInputRef = useRef();

  const onSignUpFormHandler = async (e) => {
    e.preventDefault();

    console.log(`on singup form handler clicked`);

    const name = nameInputRef.current.value;
    const email = emailInputRef.current.value;
    const phone = phoneInputRef.current.value;
    const password = passwordInputRef.current.value;

    const signUpObj = {
      name,
      email,
      phone,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/signup",
        signUpObj
      );

      console.log(response.data);

      alert("successfully signed up");
    } catch (err) {
      console.log(err.response.data);
      setError("user already exist, please Login in");
    }
  };

  return (
    <>
      <form onSubmit={onSignUpFormHandler}>
        <div>
          <label>Name</label>
          <input ref={nameInputRef} required />
        </div>
        <div>
          <label>Email</label>
          <input ref={emailInputRef} type="email" required />
        </div>
        <div>
          <label>Phone No.</label>
          <input ref={phoneInputRef} type="number" required />
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef} type="password" required />
        </div>
        <button>Sign Up</button>
      </form>
      {error && <div>{error}</div>}
    </>
  );
};

export default SignUp;
