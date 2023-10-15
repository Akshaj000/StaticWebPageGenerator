import {cookies} from 'next/headers'

const serverFetcher = async (url: string, options: RequestInit = {}) => {
    const cookieStore = cookies();
    const auth_token = cookieStore.get('AUTH_TOKEN');
    options.headers = {
        ...options.headers,
        'Cookie': `AUTH_TOKEN=${auth_token?.value}`
    };
    return await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${url}/`,
        options
    );
};


export default serverFetcher;
