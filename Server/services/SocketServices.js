const { updateVideoDataByEmail } = require("../controllers/userController");

let onlineUsers = {};

const addUsers = (email, videoData)=>{
    onlineUsers[email]= videoData;
    return;
}

const updateVideoData = (email, updates)=>{
    onlineUsers[email] = updates;
}

const updateResumeTime = (email, time)=>{
    onlineUsers[email][0].resumePoint = time;
}
const handleDisconnect = (email)=>{
    console.log(onlineUsers[email]);
    updateVideoDataByEmail(email, onlineUsers[email])
}
const getOnlineUsers = ()=>{
    return onlineUsers;
}


module.exports = {addUsers, getOnlineUsers, updateVideoData, updateResumeTime, handleDisconnect};