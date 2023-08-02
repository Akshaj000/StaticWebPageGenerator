import { getActiveUser, getSessions }  from './api';
import {redirect} from "next/navigation";
import DashBoard from "@/components/Dashboard";

export const metadata = {
    title: 'Home',
    description: 'Home page',
};


export default async function HomePage() {

    const user = await getActiveUser();
    if (!user?.email) {
        redirect('/login')
    }
    const sessions = await getSessions();

    return <DashBoard sessions={sessions} user={user}/>
}