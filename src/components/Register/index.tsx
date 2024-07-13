import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Form from '@/components/Register/Form'
import Figure from '@/components/Register/Figure'

export default function Register() {

    return <>
        <div className="register"> 
            <div className="register__box">
                <Form/>
                <Figure/>
            </div>
        </div>
    </>
}