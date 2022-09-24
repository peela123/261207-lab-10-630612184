import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [roomList, setRoomList] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [roomName, setRoomName] = useState("");

  const [msgs, setMsgs] = useState([]);
  const [msg, setMsg] = useState("");

  function processMsgs(msgs) {
    msgs.reverse();

    setMsgs(msgs.slice(0, 10));
  }

  async function getRooms() {
    const resp = await axios.get("/api/room");
    setRoomList(resp.data.rooms);
  }

  async function getMsgs() {
    if (!roomId) return;
    const resp = await axios.get("/api/room/" + roomId + "/message");
    const msgs = resp.data.messages;
    processMsgs(msgs);
  }

  async function joinRoom(roomId) {
    setRoomId(roomId);
    const resp = await axios.get("/api/room/" + roomId + "/message");
    const msgs = resp.data.messages;
    processMsgs(msgs);
  }

  async function postMsg() {
    const resp = await axios.post("/api/room/" + roomId + "/message", {
      text: msg,
    });
    if (resp.data.ok) await getMsgs();
  }

  async function deleteMsg(messageId) {
    const resp = await axios.delete(
      "/api/room/" + roomId + "/message/" + messageId
    );
    if (resp.data.ok) await getMsgs();
  }

  const [intId, setIntId] = useState(null);
  useEffect(() => {
    clearInterval(intId);
    const newIntId = setInterval(() => {
      if (roomId) {
        getMsgs();
        console.log("called");
      }
    }, 3000);
    setIntId(newIntId);
  }, [roomId]);

  return (
    <div>
      <p>Public Chat Room</p>
      <button onClick={getRooms}>Connect</button>

      {roomList.length > 0 && (
        <ul>
          {roomList.map((x) => (
            <li key={x.roomId}>
              {x.roomName}{" "}
              <button
                onClick={() => {
                  joinRoom(x.roomId);
                  setRoomName(x.roomName);
                }}
              >
                Join
              </button>
            </li>
          ))}
        </ul>
      )}

      <hr />

      {roomId && (
        <div>
          <p>Room Name : {roomName}</p>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                postMsg();
                setMsg("");
              }
            }}
            placeholder="Type Something.."
          ></input>
          {msgs.map((x) => (
            <p key={x.messageId}>
              {x.text}{" "}
              <button onClick={() => deleteMsg(x.messageId)}>Delete</button>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}