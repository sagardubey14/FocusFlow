import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({children})=>{
    const [user, setUser] = useState({
        "username": "abc",
        "videodata": [
            {
                "videoId": "video456",
                "watchedIntervals": [],
                "resumePoint": 0,
                "videoLength": 224.327982,
                "_id": "681350abb940cd95f6489290"
            }
        ]
    });

    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    return useContext(UserContext);
};