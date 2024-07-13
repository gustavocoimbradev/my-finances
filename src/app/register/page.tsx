'use client';

import Cookies from 'js-cookie'; 
import '@/styles/pages/register.scss';
import Register from '@/components/Register';

export default function Page(){

  if (typeof window !== 'undefined' && Cookies.get('userLogged')) {
      window.location.reload();
      return false;
  }
 
  return ( 
    <Register/>
  );

}