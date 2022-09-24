import { writeDB, readDB } from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  //read value from URL
  const roomId = req.query.roomId;
  const messageId = req.query.messageId;
 
 
  
  if(req.method === "DELETE")
  {
    const rooms = readDB()
    const roomindex = rooms.findIndex((x) => {x.roomId === roomId})  
    const messageindex = rooms[roomindex].messages.findIndex((x) => {x.messageId === messageId})
    
    

     //case2 roomId dose not exist
     if(roomindex === -1) return res.status(404).json({ok:false,message:"Invalid room id"})


     //case3 messsage dose not exist
     if(messageindex === -1) return res.status(404).json({ok:false,message:"Invalid message id"})
    
     

    //case1 roomId and messageId valid
    rooms[roomindex].messages.splice(messageindex,1)
    writeDB(rooms)
    return res.json({ok:true})
    

   
    

     
  }
}