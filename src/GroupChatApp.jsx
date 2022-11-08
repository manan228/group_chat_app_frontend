import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
// import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const GroupChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);
  const [createGroup, setCreateGroup] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);
  const [toShowGroupUsers, setToShowGroupUsers] = useState(false);

  const messageInputRef = useRef();
  const groupNameRef = useRef();

  const token = localStorage.getItem("token");

  const getGroups = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/get-groups", {
        headers: { Authorization: token },
      });

      if (response.data.length > 0) {
        setGroups(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
    // getGroups();

    const id = setInterval(() => {
      getGroups();
    }, 1000);

    return () => clearInterval(id);
  }, [token, getGroups]);

  useEffect(() => {
    const onLineUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/online-users");

        setOnline(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const id = setInterval(() => {
      onLineUsers();
    }, 1000);

    return () => clearInterval(id);

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

      if (selectedGroup !== "") {
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

    const id = setInterval(() => {
      getAllMessages();
    }, 1000);

    return () => clearInterval(id);

    // getAllMessages();
  }, [selectedGroup]);

  const onSendClickHandler = async () => {
    const message = messageInputRef.current.value;

    const sendMessageObj = {
      message,
      selectedGroup,
    };

    try {
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
    try {
      const response = await axios.get("http://localhost:3000/get-all-users");

      setUsers(response.data);
      setFilteredUsers(response.data);
      setCreateGroup(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onSearchActive = (e) => {
    const searchInput = e.target.value;

    if (searchInput.length > 0) {
      const filteredUsers = users.filter((user) => {
        return user.username.match(searchInput);
      });

      setFilteredUsers(filteredUsers);
    } else {
      setFilteredUsers(users);
    }
  };

  const onInviteClickHandler = async (userEmail) => {
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
    localStorage.removeItem("messages");
    setSelectedGroup(group);
  };

  const onShowUsersClickHandler = async (group) => {
    try {
      if (toShowGroupUsers === false) {
        const response = await axios.get(
          `http://localhost:3000/get-users/${group}`
        );

        setGroupUsers(response.data);
      }
      setToShowGroupUsers((prevState) => !prevState);
    } catch (err) {
      console.log(err);
    }
  };

  const onMakeAdminClickHandler = async (user) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/make-admin",
        user,
        {
          headers: { Authorization: token },
        }
      );

      const index = groupUsers.findIndex(
        (user) => user.id === response.data.id
      );

      groupUsers[index] = response.data;

      setGroupUsers([...groupUsers]);
    } catch (err) {
      console.log(err);
      alert("You are unauthorized");
    }
  };

  const onRemoveUserClickHandler = async (user) => {
    const { id } = user;
    try {
      const response = await axios.delete(
        `http://localhost:3000/delete-group-user/${id}`,
        {
          headers: { Authorization: token },
        }
      );

      console.log(response);

      if (response.data === 1) {
        const updatedGrpUser = groupUsers.filter(
          (grpUser) => grpUser.id !== user.id
        );

        setGroupUsers(updatedGrpUser);
      }
    } catch (err) {
      console.log(err);
      alert("You are unauthorized");
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
      <div>
        <button onClick={onCreateGroupClickHandler}>Create New Group</button>
        <button onClick={() => setCreateGroup(false)}>X</button>
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
              <ul key={user.username}>
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
            <div key={group}>
              <span
                onClick={() => onChangeGroupClickHandler(group)}
                key={group}
                style={{ color: id }}
              >
                {group}
              </span>
              <button onClick={() => onShowUsersClickHandler(group)}>
                Show Users
              </button>
            </div>
          );
        })}
        {toShowGroupUsers &&
          groupUsers.map((user) => {
            return (
              <React.Fragment key={user.userEmail}>
                <div>
                  <span>{user.userEmail}</span>
                  <button onClick={() => onMakeAdminClickHandler(user)}>
                    Make Admin
                  </button>
                  <button onClick={() => onRemoveUserClickHandler(user)}>
                    Remove User
                  </button>
                  {user.admin ? "admin" : ""}
                </div>
              </React.Fragment>
            );
          })}
      </div>
    </>
  );
};

export default GroupChatApp;
