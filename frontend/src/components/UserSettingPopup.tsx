import React, { useState } from 'react';
import {toast} from "react-toastify";
import {useCookies} from "react-cookie";

const UserSettingsPopup = ({ user, showModal: _show }: any) => {
    const [userSettings, setUserSettings] = useState(user);
    const [showModal, setShowModal] = useState(_show || false);
    const [cookies] = useCookies(['access']);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'name':
                setUserSettings({ ...userSettings, name: value });
                break;
            case 'openAIKey':
                setUserSettings({ ...userSettings, openAIKey: value });
                break;
            case 'githubUsername':
                setUserSettings({ ...userSettings, githubUsername: value });
                break;
            case 'githubToken':
                setUserSettings({ ...userSettings, githubToken: value });
                break;
            default:
                break;
        }
    };

    const handleUpdate = () => {
        const token = cookies?.access
        fetch(`http://localhost/api/me/update/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: userSettings.name,
                githubUsername: userSettings.githubUsername,
                githubToken: userSettings.githubToken,
                openAIKey: userSettings.openAIKey,
            }),
        }).then((response) => {
            if (response.status === 200) {
                toast.success('User settings updated');
                toggleModal();
            } else {
                toast.error('Error updating user settings');
            }
        })
    }

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <div>
            <button
                type="button"
                className="px-4 py-2 bg-blue-950 text-white w-full"
                onClick={toggleModal}
            >
                User Settings
            </button>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-gray-900 rounded-lg p-6 w-[700px]">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="top-2 right-2 text-gray-400 hover:text-gray-100 focus:outline-none"
                                onClick={toggleModal}
                            >
                                Close
                            </button>
                        </div>
                        <h2 className="text-xl font-semibold mb-4">User Settings</h2>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={userSettings?.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="openAIKey" className="block text-sm font-medium text-gray-400 mb-2">
                                    OpenAI Key
                                </label>
                                <input
                                    type="text"
                                    id="openAIKey"
                                    name="openAIKey"
                                    value={userSettings?.openAIKey}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-400 mb-2">
                                    GitHub Username
                                </label>
                                <input
                                    type="text"
                                    id="githubUsername"
                                    name="githubUsername"
                                    value={userSettings?.githubUsername}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="githubToken" className="block text-sm font-medium text-gray-400 mb-2">
                                    GitHub Token
                                </label>
                                <input
                                    type="text"
                                    id="githubToken"
                                    name="githubToken"
                                    value={userSettings?.githubToken}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                                    onClick={() => {
                                        handleUpdate();
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSettingsPopup;
