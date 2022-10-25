import axios from "axios";
import React, { useEffect, useRef } from "react";

const GroupChatApp = () => {
  const messageInputRef = useRef();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const response = await axios.get("http://localhost:3000/all-messages");

        console.log(response.data.response)
      } catch (err) {
        console.log(err);
      }
    };

    getAllMessages();
  }, []);

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
