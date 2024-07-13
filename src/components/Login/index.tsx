
import Form from '@/components/Login/Form';
import Figure from '@/components/Login/Figure';

export default function Login(props: any) {

    return <>
        <div className="login">
            <div className="login__box">
                <Form/>
                <Figure/>
            </div>
        </div>
    </>

}