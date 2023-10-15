import React from 'react';
import SessionList from './SessionList';
import UserSettingsPopup from "@/app/home/Dashboard/Sidebar/UserSettingPopup";

const Sidebar = ({ sessions, user, setCurrentSession, currentSession, showUserSettings }: any) => {
    return (
        <div className="h-screen w-64 bg-gray-900 flex flex-col justify-between">
            <SessionList
                sessions={sessions}
                setCurrentSession={setCurrentSession}
                currentSession={currentSession}
            />
            <UserSettingsPopup
                user={user}
                showModal={showUserSettings}
            />
        </div>
    );
};

export default Sidebar;
