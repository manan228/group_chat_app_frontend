import React from "react";

function SignUp() {
  const onSignUpFormHandler = (e) => {
    e.preventDefault();
    console.log(`on singup form handler clicked`);
  };
  return (
    <>
      <form onSubmit={onSignUpFormHandler}>
        <div>
          <label>Name</label>
          <input required/>
        </div>
        <div>
          <label>Email</label>
          <input type='email' required/>
        </div>
        <div>
          <label>Phone No.</label>
          <input type='number' required/>
        </div>
        <div>
          <label>Password</label>
          <input type='password' required/>
        </div>
        <button>Sign Up</button>
      </form>
    </>
  );
}

export default SignUp;
