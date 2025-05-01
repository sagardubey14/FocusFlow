const { updateVideoDataByEmail } = require("../controllers/userController");
const User = require("../models/User");


let onlineUsers = {};

const addUsers = (email, videoData) => {
    onlineUsers[email] = videoData;
    return;
}

const updateVideoData = (email, updates) => {
    onlineUsers[email] = updates;
}

const updateVideoDataByEmail = async (email, newVideoData) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }
        user.videoData = newVideoData.map(({ _id, ...rest }) => ({
            ...rest,
        }));

        const updatedUser = await user.save();
        return updatedUser;
    } catch (error) {
        console.error('Error updating videoData:', error.message);
        throw error;
    }
}

const updateResumeTime = (email, time) => {
    onlineUsers[email][0].resumePoint = time;
}
const handleDisconnect = (email) => {
    console.log(onlineUsers[email]);
    updateVideoDataByEmail(email, onlineUsers[email])
}
const getOnlineUsers = () => {
    return onlineUsers;
}


module.exports = { addUsers, getOnlineUsers, updateVideoData, updateResumeTime, handleDisconnect };