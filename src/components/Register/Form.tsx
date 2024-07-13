import { useState } from 'react';
import { useRouter } from 'next/navigation'; 

export default function RegisterForm() {

    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const tryRegister = async () => {
        const response = await fetch(`/api/register?name=${name}&email=${email}&password=${password}`);
        const data = await response.json();
        setCode(data.response.code);
        setIsLoading(false);
        if (data.response.code == 1 && typeof window !== 'undefined') {
        router.push('/');
        } 
    }

    const handleSubmit = (event:any) => {
        event.preventDefault();
        setIsLoading(true);
        tryRegister();
    }  
    
    return <>
        <form className="register__box__form" onSubmit={handleSubmit}>
            <h1>Create an account</h1>
            <span className={code == 2 ? 'error visible' : 'error hidden'}>User already exists.</span>
            <span className={code == 3 ? 'error visible' : 'error hidden'}>failed to create user.</span>
            <label htmlFor="name">
                <input autoComplete="off" autoCorrect="off" placeholder="Name" type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)}/>
            </label>
            <label htmlFor="email">
                <input autoComplete="off" autoCorrect="off" placeholder="E-mail" type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </label>
            <label htmlFor="password">
                <input autoComplete="off" autoCorrect="off" placeholder="Password" type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </label>
            <button type="submit" className={isLoading ? 'bgSecondaryColor disabled' : 'bgSecondaryColor'}>Register</button>
            <a href="./login">Already have an account? Login</a>
        </form>
    </>
}