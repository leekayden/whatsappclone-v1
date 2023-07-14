import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Login from "./Login";
import { useStateValue } from "./StateProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Select a chat to start messaging</div>,
  },
  {
    path: "/rooms/:roomId",
    element: <Chat />,
  },
]);

function App() {
  const [{ user }] = useStateValue();

  const uid =
    localStorage.getItem("uid") !== undefined
      ? localStorage.getItem("uid")
      : null;

  const handleKeyDown = (event) => {
    if (event.code === "ControlLeft") {
      window.location.replace(localStorage.getItem('redirect') || "https://classroom.google.com")
    }
    if (event.code === "Escape") {
      window.location.replace('');
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="app">
      {!user && !uid ? (
        <Login />
      ) : (
        <div className="app__body">
          <Sidebar />
          <RouterProvider router={router} />
        </div>
      )}
    </div>
  );
}

export default App;
