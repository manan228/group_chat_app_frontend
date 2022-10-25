import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const GroupChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);

  const messageInputRef = useRef();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const onLineUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/online-users");

        console.log(response.data);

        setOnline(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    setInterval(() => {
      onLineUsers();
    }, 1000);

    // onLineUsers();
  }, []);

  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const response = await axios.get("http://localhost:3000/all-messages");

        console.log(response.data);
        setMessages(response.data.response);
      } catch (err) {
        console.log(err);
      }
    };

    setInterval(() => {
      getAllMessages();
    }, 1000);

    // getAllMessages();
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
      {online.map(({ username }) => {
        return <div>{username} Joined!!</div>;
      })}
      {messages.map((message) => {
        return (
          <div>
            {message.userEmail}: {message.message}
          </div>
        );
      })}
      <input ref={messageInputRef} required />
      <button onClick={onSendClickHandler}>Send</button>
    </>
  );
};

export default GroupChatApp;
