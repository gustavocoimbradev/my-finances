'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import '@/app/scss/pages/dashboard.scss';

import Transactions from '@/app/dashboard/transactions/page';

export default function Page(){
    return <Transactions/>;
}