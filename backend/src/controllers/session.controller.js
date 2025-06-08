
import Message from "../models/message.model.js";
import Offer from "../models/offer.model.js";
import Session from "../models/session.model.js";

export const createSession = async (req, res) => {
  const { offer_id, student_id, tutor_id,accepted_by } = req.body;
  try {  
    const offer = await Offer.findOne({ _id: offer_id });
    const startTime = new Date(offer.date);
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + offer.dure);
    let session =await new Session();
    session.offer_id = offer_id;
    session.student_id = student_id;
    session.tutor_id = tutor_id;
    session.session_id = session._id;
    session.scheduled_start = startTime;
    session.scheduled_end = endTime;
    session.active = false;
    session.save();
  
    console.log(session._id);
  

    const offerUpdate = await Offer.findByIdAndUpdate(offer_id, {
      status: "accepted",
      accepted_by
    });
    const offers=await Offer.find({status:"open"});
    
    res.status(201).json({ message: "session created successfully" ,offers,session_id:session._id});
  } catch {
    res.status(500).json({ message: "error creating session" });
  }
};

export const showSessions=async(req,res)=>{
  try {
    const { userId, status,role } = req.query;
    const sessions = await Session.find({
      [role=="student"?"student_id":"tutor_id"]:userId,
      status,
    }).populate("tutor_id student_id offer_id");

    res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Server error" });
  }

}


export const getReady=async(req,res)=>{
  const {session}=req.params
  const { role } = req.body;
 

  const session_=await Session.findOne({_id:session})

  
  if(role=='student'){
    session_.student_ready=true
  }else{
    session_.tutor_ready=true
  }
  if(session_.student_ready && session_.tutor_ready){
    session_.chat_active=true;
  }
  session_.save()
  console.log(session_.chat_active)
  res.json({message:"session is ready",ready:session_.chat_active});
} 
export const  fetchMessages=async(req,res)=>{
  const {session_id}=req.params
  const messages=await Message.find({session_id})

  res.send(messages)
}
export const sendMessage=async(req,res)=>{
  const {session_id}=req.params
  const { receiver_id, sender_id ,content} = req.body;
  const message=await new Message({
    session_id,
    receiver_id,
    sender_id,
    content,

  }).save()
  console.log(message)
  res.json(message)
}