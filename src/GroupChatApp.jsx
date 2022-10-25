import axios from "axios";
import React, { useRef } from "react";

const GroupChatApp = () => {
  const messageInputRef = useRef();

  const token = localStorage.getItem("token");
  console.log(token);

  const onSendClickHandler = async () => {
    const message = messageInputRef.current.value;

    try {
      console.log(`inside sendClickHandler ${message}`);

      const response = await axios.post(
        "http://localhost:3000/send-message",
        { message },
        { headers: { Authorization: token } }
      );

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>GroupChatApp</div>
      <ul>
        <li>You Joined</li>
      </ul>
      <input ref={messageInputRef} required />
      <button onClick={onSendClickHandler}>Send</button>
    </>
  );
};

export default GroupChatApp;
