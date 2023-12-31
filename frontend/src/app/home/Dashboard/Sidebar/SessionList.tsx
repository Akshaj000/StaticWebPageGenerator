import React, { useState } from 'react';
import { Trash2, Edit2 } from 'react-feather';
import {toast} from "react-toastify";
import clientFetcher from "@/app/clientFetcher";
interface Session {
    id: number;
    name: string;
}

const MAX_TITLE_LENGTH = 20; // Maximum characters to display for session title

const SessionList = ({ sessions: initialSessions, currentSession, setCurrentSession }: any) => {
    const [sessions, setSessions] = useState<Session[]>(initialSessions || []);
    const [editingSessionId, setEditingSessionId] = useState<number | null>(null);
    const [editingSessionTitle, setEditingSessionTitle] = useState('');

    const fetchSession = async ({session}: { session: any }) => {
        const response = await clientFetcher(`session/?id=${session?.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        if (response.status === 200) {
            setCurrentSession(response.data)
        } else {
            toast.error('Error fetching session');
        }
    };

    const handleDelete = async (id: number) => {
        const response = await clientFetcher(`session/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id
            }),
        })
        if (response.status === 200) {
            setSessions(sessions.filter((session) => session.id !== id));
            setCurrentSession(null);
        } else {
            toast.error('Error deleting session');
        }
    };

    const handleEdit = async (id: number, newTitle: string) => {
        const response = await clientFetcher(`session/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newTitle.trim(),
                id: id
            }),
        })
        if (response.status === 200) {
            const updatedSessions = sessions.map((session) => {
                if (session.id === id) {
                    return {...session, name: newTitle};
                }
                return session;
            });
            setSessions(updatedSessions);
        } else {
            toast.error('Error updating session');
        }
    };

    const handleNewSession = (data: any) =>{
        const newSession = {
            id: data?.id,
            name: data?.name,
        }
        setCurrentSession(newSession);
        setSessions([newSession, ...sessions]);
    }

    const handleAddSession = async () => {
        const response =  await clientFetcher(`session/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: "New Session"}),
        })
        if (response.status === 200 && response?.data) {
            handleNewSession(response.data)
        }
    };

    const handleSessionChange = (session: Session) => {
        setCurrentSession(session);
        fetchSession({ session });
    }

    return (
        <div className="px-4 py-6">
            <h2 className="text-xl font-semibold mb-4">Sessions</h2>
            <div className="mb-4 flex">
                <button
                    type="button"
                    onClick={handleAddSession}
                    className="px-4 py-1 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none w-full text-left"
                >
                   + Add a new session
                </button>
            </div>
            <ul>
                {sessions?.map((session) => (
                    <li
                        key={session.id}
                        className={`flex items-center justify-between text-gray-400 mb-4 ${
                            editingSessionId === session.id ? 'bg-blue-100' : ''
                        }`}
                    >
                        {editingSessionId === session.id ? (
                            <input
                                type="text"
                                value={editingSessionTitle}
                                onChange={(e) => setEditingSessionTitle(e.target.value)}
                                onBlur={() => {
                                    handleEdit(session.id, editingSessionTitle.trim());
                                    setEditingSessionId(null);
                                }}
                                autoFocus
                                className="w-full text-lg bg-blue-950 text-white focus:outline-none"
                            />
                        ) : (
                             <button
                                 className={`text-lg overflow-hidden whitespace-nowrap ${currentSession?.id === session?.id ? 'text-blue-600' : 'text-gray-400'}`}
                                 onClick={() => handleSessionChange(session)}
                             >
                                {session?.name?.length > MAX_TITLE_LENGTH
                                 ? `${session?.name?.slice(0, MAX_TITLE_LENGTH)}...`
                                : session?.name}
                             </button>
                        )}
                        {editingSessionId !== session?.id && (
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    className="focus:outline-none text-gray-600 hover:text-gray-800"
                                    onClick={() => {
                                        setEditingSessionId(session?.id);
                                        setEditingSessionTitle(session?.name);
                                    }}
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    type="button"
                                    className="focus:outline-none text-red-600 hover:text-red-800"
                                    onClick={() => handleDelete(session?.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SessionList;
