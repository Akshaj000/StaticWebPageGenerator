import {cookies} from 'next/headers'
import serverFetcher from "@/app/serverFetcher";

type User = {
    username: string,
    email: string,
    name: string
}

const getActiveUser = async (): Promise<User | null> => {
    const cookieStore = cookies()
    const token = cookieStore.get('access')

    const response = await serverFetcher('me', {
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

    const response = await serverFetcher('sessions', {
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
