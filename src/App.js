import SignUp from "./SignUp";
import "./App.css";
import Login from "./Login";
import { Route, Routes } from "react-router-dom";
import GroupChatApp from "./GroupChatApp";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/group-chat-app" element={<GroupChatApp />} />
      </Routes>
    </div>
  );
}

export default App;
