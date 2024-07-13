'use client';

import Cookies from 'js-cookie'; 

import { usePathname } from 'next/navigation'; 
import { useRouter } from 'next/navigation'; 
import { useEffect, useState } from 'react';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const pathname = usePathname();
    let currentPage; 

    const router = useRouter();

    useEffect(() => {
      if (!Cookies.get('userLogged')) {
        return router.push('/login');
      }
    }, []);


    return (
        <div className="transactions">    
            <div className="transactions__content">
                <div className="transactions__content__header">
                    <div>
                        <img src="/icons/transactions.svg"/> <span>Transactions</span>
                    </div>
                    <div>
                        <a href="/logout"><img src="/icons/logout.svg"/> <span>Logout</span></a>
                    </div>
                </div>
                <div className="transactions__content__main">
                    {children}
                </div>
            </div>
        </div>
    );
}
