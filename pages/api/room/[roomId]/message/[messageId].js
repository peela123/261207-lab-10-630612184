import { writeDB, readDB } from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  const rooms = readDB();
  //read value from URL
  const roomId = req.query.roomId;
  const roomIdx = rooms.findIndex((x) => x.roomId === roomId);
  const messageId = req.query.messageId
  const messageIdx = rooms[roomIdx].messages.findIndex((x) => {x.messageId === messageId})

  if (req.method === "DELETE") {
    const roomindex = rooms.findIndex((x) => {
      x.roomId === roomId;
    });
    const messageindex = rooms[roomindex].messages.findIndex((x) => {
      x.messageId === messageId;
    });

    // roomId dose not exist
    if (roomIdx === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });

    //messsage dose not exist
    if (messageIdx === -1)
      return res.status(404).json({ ok: false, message: "Invalid message id" });

    // roomId and messageId valid
    rooms[roomIdx].messages.splice(messageIdx, 1);
    writeDB(rooms);
    return res.json({ ok: true });
  }
}
