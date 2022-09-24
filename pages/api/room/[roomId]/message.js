import { readDB, writeDB } from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    const rooms = readDB();

    //get all room id
    const roomid = req.query.roomId;
    //get room index
    const roomindex = rooms.findIndex((x) => {
      x.roomId === roomid;
    });
    //check if room exist or not
    if (roomindex === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    return res.json({ ok: true, messages: rooms[roomindex].messages });
  } else if (req.method === "POST") { 
    const rooms = readDB();
    const roomid = req.query.roomId;

    //read request body
    const text = req.body.text;

    //create new id
    const newId = uuidv4();

    const roomindex = rooms.findIndex((x) => {
      x.roomId === roomid;
    });

    //case1 roomid do not exist
    if (roomindex === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    //case2 invalid body
    if (typeof text !== "string")
      return res
        .status(400)
        .json({ ok: false, message: "Invalid text input" });

    //case3 valid both
    const newmessage = {
      messageId: newId,
      text: text
    };
    rooms[roomindex].messages.push(newmessage)
    writeDB(rooms)

    

    return res.json({oK:true,newmessage})

  }
}