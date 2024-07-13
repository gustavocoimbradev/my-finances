'use client';

import Cookies from 'js-cookie'; 
import { useRouter } from 'next/navigation'; 
import '@/styles/pages/login.scss';
import Login from '@/components/Login';

export default function Page(){

    const router = useRouter();

    if (typeof window !== 'undefined' && Cookies.get('userLogged')) {
        router.push('/transactions');
        return false;
    }

    return (
        <Login/>
    );

}