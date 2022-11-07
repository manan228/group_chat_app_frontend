import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
// import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const GroupChatApp = () => {
  console.log(`group chat app 1st line`);
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);
  const [createGroup, setCreateGroup] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  console.log(`initially`, selectedGroup);

  const messageInputRef = useRef();
  const groupNameRef = useRef();

  const token = localStorage.getItem("token");

  const getGroups = useCallback(async () => {
    console.log(`inside getgroup`, selectedGroup);
    try {
      const response = await axios.get("http://localhost:3000/get-groups", {
        headers: { Authorization: token },
      });

      console.log(response.data);

      if (response.data.length > 0) {
        setGroups(response.data);
        setSelectedGroup(response.data[0]);
      }
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
    console.log(`inside get group useEffect`, selectedGroup);
    getGroups();
  }, [token, getGroups]);

  useEffect(() => {
    console.log(`inside online users useEffect`, selectedGroup);
    const onLineUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/online-users");

        setOnline(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    // setInterval(() => {
    //   onLineUsers();
    // }, 1000);

    onLineUsers();
  }, []);

  useEffect(() => {
    console.log(`inside get all message useEffect`, selectedGroup);
    const getAllMessages = async () => {
      console.log(`inside get all messages`, selectedGroup);
      let lastMessageId;
      const messagesFromLS = JSON.parse(localStorage.getItem("messages"));

      if (messagesFromLS === null) {
        lastMessageId = 0;
      } else if (messagesFromLS.length === 0) {
        lastMessageId = 0;
      } else {
        lastMessageId = messagesFromLS[messagesFromLS.length - 1].id;
      }

      if (selectedGroup !== "") {
        console.log(`inside if`);
        try {
          const response = await axios.get(
            `http://localhost:3000/all-messages?lastMessageId=${lastMessageId}&selectedGroup=${selectedGroup}`
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
      }
    };

    // setInterval(() => {
    //   getAllMessages();
    // }, 1000);

    getAllMessages();
  }, [selectedGroup]);

  const onSendClickHandler = async () => {
    const message = messageInputRef.current.value;

    const sendMessageObj = {
      message,
      selectedGroup,
    };

    try {
      console.log("inside sendClickHandler", sendMessageObj);

      const response = await axios.post(
        "http://localhost:3000/send-message",
        sendMessageObj,
        { headers: { Authorization: token } }
      );

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const onCreateGroupClickHandler = async () => {
    console.log(`on create new group clicked`);
    try {
      const response = await axios.get("http://localhost:3000/get-all-users");

      console.log(response.data);

      setUsers(response.data);
      setFilteredUsers(response.data);
      setCreateGroup(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onSearchActive = (e) => {
    console.log(e.target.value);
    const searchInput = e.target.value;

    if (searchInput.length > 0) {
      const filteredUsers = users.filter((user) => {
        console.log(user.username.match(searchInput));
        return user.username.match(searchInput);
      });

      setFilteredUsers(filteredUsers);
    } else {
      setFilteredUsers(users);
    }
  };

  const onInviteClickHandler = async (userEmail) => {
    console.log(
      `onInviteClickHandler called`,
      userEmail,
      groupNameRef.current.value
    );

    const createGroupObj = {
      grpName: groupNameRef.current.value,
      userEmail,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/create-new-group",
        createGroupObj,
        {
          headers: { Authorization: token },
        }
      );
      console.log(response);

      getGroups();
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeGroupClickHandler = (group) => {
    console.log(group);
    console.log(`onChangeGroupClickHandler clicked`, group);

    localStorage.removeItem("messages");
    setSelectedGroup(group);
  };

  return (
    <>
      {console.log(`inside return`)}
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
      <div>
        <button onClick={onCreateGroupClickHandler}>Create New Group</button>
      </div>
      {createGroup && (
        <div>
          <div>
            <label>Group Name</label>
            <input type="text" ref={groupNameRef} />
          </div>
          <div>
            <label>Search Users</label>
            <input type="text" onChange={(e) => onSearchActive(e)} />
          </div>
          {filteredUsers.map((user) => {
            return (
              <ul>
                <li>{user.username}</li>
                <button
                  style={{ display: "inline-block" }}
                  onClick={() => onInviteClickHandler(user.email)}
                >
                  Invite
                </button>
              </ul>
            );
          })}
        </div>
      )}
      <div>
        List of Groups
        {groups.map((group) => {
          const id = group === selectedGroup ? "red" : null;

          return (
            <div
              onClick={() => onChangeGroupClickHandler(group)}
              key={group}
              style={{ color: id }}
            >
              {group}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GroupChatApp;
