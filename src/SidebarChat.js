import React, { useEffect, useState } from "react";
import { Avatar, IconButton } from "@mui/material";
import "./SidebarChat.css";
import db from "./firebase";
import { Link } from "@mui/material";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import firebase from "firebase";
import { password } from "./constants";

function SidebarChat(props) {
  const [seed, setSeed] = useState("");
  const { name, id } = props;
  const [messages, setMessages] = useState([]);
  const [{ togglerState }, dispatch] = useStateValue();

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, []);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);
  const deleteRoom = () => {
    const passwordVerify = prompt("Enter Admin Password to delete Room");
    if (passwordVerify === password) {
      db.collection("rooms")
        .doc(id)
        .delete()
        .then(function () {
          window.location = "/";
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
    } else {
      alert("You are not authorised to delete rooms");
    }
  };

  const handleChat = () => {
    dispatch({
      type: actionTypes.SET_TOGGLER,
      togglerState: togglerState + 1,
    });
  };

  return (
    <div className="sidebarChat">
      <Link href={`/rooms/${id}`} onClick={handleChat}>
        <div className="sidebarChat__wrapper">
          <Avatar src={messages[0]?.photoURL} />
          <div className="sidebarChat__info">
            <h2 className="room__name">{name}</h2>
            <p className="sidebar__lastmessages__color">
              <span className="sidebar__lastMessageName">
                {id !== "" && messages.length > 0
                  ? messages[0]?.name + ": "
                  : null}
              </span>
              {id !== "" && messages.length > 0
                ? messages[0]?.message
                : `${messages[0]?.name}`}
            </p>
          </div>
        </div>
      </Link>
      <IconButton className="deleteBtn" onClick={deleteRoom}>
        <DeleteForeverIcon />
      </IconButton>
    </div>
  );
}

export default SidebarChat;
