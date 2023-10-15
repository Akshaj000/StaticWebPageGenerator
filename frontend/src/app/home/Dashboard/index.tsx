"use client";
import Sidebar from "@/app/home/Dashboard/Sidebar";
import { useState } from "react";
import PlayGround from "@/app/home/Dashboard/PlayGround";
import Login from "@/app/home/Dashboard/Login";

const Dashboard = ({ sessions, user }: any) => {

    const [currentSession, setCurrentSession] = useState(null);
    const [showUserSettings, setShowUserSettings] = useState(false);

    return (
        <div className="flex">
            {!user && <Login/>}
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

export default Dashboard
