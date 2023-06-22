import React, { useEffect } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import { useStateValue } from "./StateProvider";
import UseWindowDimensions from "./UseWindowDimensions";

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
  const [{ user }, dispatch] = useStateValue();
  const { width } = UseWindowDimensions();
  const uid =
    localStorage.getItem("uid") !== undefined
      ? localStorage.getItem("uid")
      : null;

  const handleKeyDown = (event) => {
    if (event.code === "ControlLeft") {
      // window.history.replaceState(null, document.title, "https://classroom.google.com/")
      window.location.replace(localStorage.getItem('redirect') || "https://classroom.google.com")
    }
    if (event.code === "Escape") {
      // window.history.replaceState(null, document.title, "/")
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
