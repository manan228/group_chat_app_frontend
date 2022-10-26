import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const GroupChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);

  const messageInputRef = useRef();

  useEffect(() => {
    const onLineUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/online-users");

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
      let lastMessageId;
      const messagesFromLS = JSON.parse(localStorage.getItem("messages"));

      if (messagesFromLS === null) {
        lastMessageId = 0;
      } else if (messagesFromLS.length === 0) {
        lastMessageId = 0;
      } else {
        lastMessageId = messagesFromLS[messagesFromLS.length - 1].id;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/all-messages?lastMessageId=${lastMessageId}`
        );

        const messagesFromDB = response.data.response;

        let finalMessagesToStore;

        if (messagesFromLS === null) {
          localStorage.setItem("messages", JSON.stringify([]));

          finalMessagesToStore = JSON.stringify([...messagesFromDB]);
        } else {
          finalMessagesToStore = JSON.stringify([
            ...messagesFromLS,
            ...messagesFromDB,
          ]);
        }

        localStorage.setItem("messages", finalMessagesToStore);

        setMessages(JSON.parse(finalMessagesToStore));
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
    const token = localStorage.getItem("token");

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
        return <div key={username}>{username} Joined!!</div>;
      })}
      {messages.map((message) => {
        return (
          <div key={message.id}>
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
