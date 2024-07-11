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

    const transactions = <><img src="/icons/transactions.svg"/> <span>Transactions</span></>;
    const emergency = <><img src="/icons/emergency.svg"/> <span>Emergency</span></>;
    const investments = <><img src="/icons/investments.svg"/> <span>Investments</span></>;
    const logout = <><img src="/icons/logout.svg"/> <span>Logout</span></>;

    if (pathname == '/dashboard' || pathname == '/dashboard/transactions') {
        currentPage = transactions;
    }

    if (pathname == '/dashboard/emergency') {
        currentPage = emergency;
    }

    if (pathname == '/dashboard/investments') {
        currentPage = investments;
    }
  
    return (
        <div className="dashboard">    
            {/* <div className="dashboard__sidebar"> 
                <nav>
                    <ul>
                        <li><a href="/dashboard/transactions">{transactions}</a></li>
                        <li><a href="/dashboard/emergency">{emergency}</a></li> 
                        <li><a href="/dashboard/investments">{investments}</a></li>
                        <li><a href="/logout">{logout}</a></li>
                    </ul>
                </nav>
            </div> */}
            <div className="dashboard__content">
                <div className="dashboard__content__header">
                    {currentPage}
                    <a href="/logout">{logout}</a>
                </div>
                <div className="dashboard__content__main">
                    {children}
                </div>
            </div>
        </div>
    );
}
