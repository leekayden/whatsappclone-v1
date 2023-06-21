import React, { useState, useEffect } from "react";
import { Avatar, Collapse, IconButton } from "@mui/material";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ChatIcon from "@mui/icons-material/Chat";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import SidebarChat from "./SidebarChat";
import "./Sidebar.css";
import MenuIcon from "@mui/icons-material/Menu";
import db from "./firebase";
import firebase from "firebase";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import UseWindowDimensions from "./UseWindowDimensions";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Loader from "./Loader";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [toggler, setToggler] = useState(false);
  const [sidebarBool, setsidebarBool] = useState(true);
  const [{ togglerState }, dispatch] = useStateValue();
  const [search, setSearch] = useState([]);
  const [input, setInput] = useState("");
  const [logout, setLogout] = useState(false);
  const { width } = UseWindowDimensions();
  const [seed, setSeed] = useState("");
  const [open, setOpen] = React.useState(false);
  const [roomN, setRoomN] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
    db.collection("rooms").add({
      name: roomN,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };

  // const { addNewChatVal, name, id } = props;
  const [messages, setMessages] = useState([]);
  const matcher = (s, values) => {
    const re = RegExp(`.*${s.toLowerCase().split("").join(".*")}.*`);
    return values.filter((v) => v.data.name.toLowerCase().match(re));
  };
  const handleChange = (e) => {
    setsidebarBool(false);
    setInput(e.target.value);
  };
  const exitApp = () => {
    localStorage.removeItem("uid");
    window.location.reload();
    setLogout(true);
  };
  useEffect(() => {
    if (rooms.length > 0) {
      setSearch(matcher(input, rooms));
    }
    if (input === "") {
      setsidebarBool(true);
    }
  }, [input]);

  useEffect(() => {
    const unsubscribe = db
      .collection("rooms")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setRooms(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setToggler(!toggler);
  }, [togglerState]);
  const handleDrawerToggle = () => {
    setToggler(toggler);

    dispatch({
      type: actionTypes.SET_TOGGLER,
      togglerState: togglerState + 1,
    });
  };
  const photoURL =
    localStorage.getItem("photoURL") !== ""
      ? localStorage.getItem("photoURL")
      : null;
  const displayName = localStorage.getItem("displayName");

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createChat = () => {
    const roomName = roomN;
    if (roomName && roomName.length >= 20) {
      return alert("enter a shorter name for the room");
    }
    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  return (
    <>
      {width < 629 ? (
        <div
          className={
            togglerState % 2 !== 0 ? "sidebar" : "sidebar hide__sidebar"
          }
        >
          <div className="siderbar__wrapper">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              className="sidebar__burger"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <div className="sidebar__header">
              <Avatar src={photoURL} />{" "}
              <div className="sidebar__headerRight">
                <IconButton>
                  <DonutLargeIcon />
                </IconButton>
                <IconButton>
                  <div onClick={createChat}>
                    <ChatIcon />
                  </div>
                </IconButton>
                <IconButton>
                  <div onClick={exitApp}>
                    <ExitToAppIcon />
                  </div>
                </IconButton>
              </div>
            </div>
          </div>
          <div className="sidebar__search">
            <div className="sidebar__searchContainer">
              <SearchOutlined />
              <input
                placeholder="Search or Start a new chat"
                value={input}
                type="text"
                onChange={handleChange}
              />
            </div>
          </div>
          {sidebarBool ? (
            <div className="sidebar__chats">
              <SidebarChat addNewChatVal="true" />
              {rooms.map((room) => (
                <SidebarChat key={room.id} id={room.id} name={room.data.name} />
              ))}
            </div>
          ) : (
            <div className="sidebar__chats">
              <SidebarChat addNewChatVal="true" />
              {search.map((room) => (
                <SidebarChat key={room.id} id={room.id} name={room.data.name} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={"sidebar"}>
          <div className="sidebar__header">
            <Avatar src={photoURL} />{" "}
            <div className="sidebar__headerRight">
              <IconButton>
                <DonutLargeIcon />
              </IconButton>
              <IconButton onClick={handleClickOpen}>
                <ChatIcon />
              </IconButton>
              <IconButton onClick={exitApp}>
                <ExitToAppIcon />
              </IconButton>
            </div>
          </div>
          <div className="sidebar__search">
            <div className="sidebar__searchContainer">
              <SearchOutlined />
              <input
                placeholder="Search or Start a new chat"
                value={input}
                type="text"
                onChange={handleChange}
              />
            </div>
          </div>
          {sidebarBool ? (
            <div className="sidebar__chats scrollbar-juicy-peach">
              <SidebarChat addNewChatVal="true" />
              {rooms.length === 0 ? (
                <Loader />
              ) : (
                rooms.map((room) => (
                  <SidebarChat
                    key={room.id}
                    id={room.id}
                    name={room.data.name}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="sidebar__chats ">
              <SidebarChat addNewChatVal="true" />
              {search.map((room) => (
                <SidebarChat key={room.id} id={room.id} name={room.data.name} />
              ))}
            </div>
          )}
        </div>
      )}
      <Dialog open={open}>
        <DialogTitle>Room Name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for your room
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Room Name"
            type="name"
            fullWidth
            variant="standard"
            value={roomN}
            onChange={(e) => setRoomN(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={roomN === ''}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Sidebar;
