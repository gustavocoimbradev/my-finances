'use client';

import Cookies from 'js-cookie'; 

import { useState, useEffect } from 'react';

import Dashboard from '@/app/transactions/page';
import Login from '@/app/login/page';

export default function Page() {

  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    if (Cookies.get('userLogged')) {
      setAuthenticated(true);
    }
  }, []);

  return authenticated ? <Dashboard /> : <Login />;

}
