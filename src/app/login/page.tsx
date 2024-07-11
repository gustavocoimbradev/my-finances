'use client';

import Cookies from 'js-cookie'; 

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import crypto from 'crypto';
import '@/app/scss/pages/login.scss';


export default function Page(){

    const router = useRouter();

    if (typeof window !== 'undefined' && Cookies.get('userLogged')) {
        router.push('/dashboard');
        return false;
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    const tryLogin = async () => {
        const response = await fetch(`/api/login?email=${email}&password=${password}`);
        const data = await response.json();
        setCode(data.code);
        setIsLoading(false);
        if (data.code == 1 && typeof window !== 'undefined') {
            Cookies.set(`userLogged`, `${data.token}`);
            window.location.reload();
        }
    }   

    const handleSubmit = (event:any) => {
        event.preventDefault();
        setIsLoading(true);
        tryLogin();
    }   

    return (
        <div className="login">
            <div className="login__box">
                <form className="login__box__form" onSubmit={handleSubmit}>
                    <h1>Welcome</h1>
                    <h5>Already have an account? Login</h5>
                    <span className={code == 2 ? 'error visible' : 'error hidden'}>Invalid credentials.</span>
                    <label htmlFor="email">
                        <input autoComplete="off" autoCorrect="off" className={code == 2 ? 'is-invalid' : ''} placeholder="E-mail" type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </label>
                    <label htmlFor="password">
                        <input autoComplete="off" autoCorrect="off" className={code == 2 ? 'is-invalid' : ''} placeholder="Password" type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </label>
                    <button type="submit" className={isLoading ? 'bgPrimaryColor disabled' : 'bgPrimaryColor'}>Login</button>
                    <a href="./register">Don't have an account? Register</a>
                </form>
                <figure className="login__box__figure">
                    <img src="./banner-login.jpg"/>
                </figure>
            </div>
        </div>
    );

}