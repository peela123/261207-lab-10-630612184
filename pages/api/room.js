import { readDB } from "../../backendLibs/dbLib";

export default function roomRoute(req, res) {
  const rooms = readDB();

  const result = []
  for(const room of rooms)
  {
    result.push({
      roomId: room.roomId,
      roomName: room.roomName
      
      
    })
  }
  // const result = rooms.map((x) => {
  //   roomId = x.roomId,
  //   roomName = x.roomName
  
  // })


  return res.status(200).json({ok:"true",rooms:result})
}
