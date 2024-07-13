'use client';

import Cookies from 'js-cookie'; 

import { useRouter } from 'next/navigation'; 

import '@/styles/pages/logout.scss';

export default function Page() {
    Cookies.remove('userLogged');
    const router = useRouter();
    router.push('/login');

    return (
        <div className="logout">
            <div className="logout__box">Disconnecting...</div>
        </div>
    )
        
}