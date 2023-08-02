import {cookies} from 'next/headers'

type User = {
    username: string,
    email: string,
    name: string
}

const getActiveUser = async (): Promise<User | null> => {
    const cookieStore = cookies()
    const token = cookieStore.get('access')

    const response = await fetch(`${process.env.API_ENDPOINT}/me/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token?.value}`,
        },
    });

    if (response.status === 200) {
        return await response.json();
    } else {
        return null;
    }
};


const getSessions = async (): Promise<any> => {
    const cookieStore = cookies()
    const token = cookieStore.get('access')

    const response = await fetch(`${process.env.API_ENDPOINT}/sessions/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token?.value}`,
        },
    });

    if (response.status === 200) {
        return await response.json();
    } else {
        return null;
    }
}

export {
    getActiveUser,
    getSessions
}
