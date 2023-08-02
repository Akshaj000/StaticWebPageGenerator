"use client";
import Sidebar from "@/components/SideBar";
import {useState} from "react";
import PlayGround from "@/components/PlayGround";

const DashBoard = ({ sessions, user }: any) => {

    const [currentSession, setCurrentSession] = useState(null);
    const [showUserSettings, setShowUserSettings] = useState(false);

    return (
        <div className="flex">
            <Sidebar
                sessions={sessions}
                user={user}
                showUserSettings={showUserSettings}
                setCurrentSession={setCurrentSession}
                currentSession={currentSession}
            />
            <PlayGround
                session={currentSession}
                setSession={setCurrentSession}
                setShowUserSettings={setShowUserSettings}
            />
        </div>
    )
}

export default DashBoard
