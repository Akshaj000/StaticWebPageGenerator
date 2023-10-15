import { getActiveUser, getSessions }  from './api';
import Dashboard from "@/app/home/Dashboard";

export const metadata = {
    title: 'Home',
    description: 'Home page',
};


export default async function HomePage() {

    const user = await getActiveUser();
    const sessions = await getSessions();

    return <Dashboard sessions={sessions} user={user}/>
}