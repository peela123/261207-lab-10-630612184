import { readDB, writeDB } from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";

export default function roomIdMessageRoute(req, res) {
  const rooms = readDB();
  if (req.method === "GET") {
    //get all room id
    const id = req.query.roomId;
    //get room index
    const roomIdx = rooms.findIndex((x) => {
      x.roomId === id;
    });
    //check if room exist or not
    if (roomIdx === -1) {
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    }

    return res.json({ ok: true, messages: rooms[roomIdx].messages });
  } else if (req.method === "POST") {
    const rooms = readDB();
    const id = req.query.roomId;

    //read request body
    const text = req.body.text;

    //create new id
    const newId = uuidv4();

    const roomIdx = rooms.findIndex((x) => {
      x.roomId === id;
    });

    //case1 roomid do not exist
    if (roomIdx === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    //case2 invalid body
    if (typeof text !== "string")
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    //case3 valid both
    const newmessage = {
      messageId: newId,
      text: text,
    };
    rooms[roomIdx].messages.push(newmessage);
    writeDB(rooms);

    return res.json({ oK: true, newmessage });
  }
}
