import { sql } from '@vercel/postgres';
import Cookies from 'js-cookie'; 
 
import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const token = urlParams.get('token');
    const date = urlParams.get('date'); 
    let startDate;
    let endDate;
    if (date) {
        const [yearStr, monthStr] = date.split('-');
        const year = parseInt(yearStr, 10); 
        const month = parseInt(monthStr, 10); 
        const lastDay = new Date(year, month, 0).getDate(); 
        startDate = `${yearStr}-${monthStr}-01`;
        endDate = `${yearStr}-${monthStr}-${lastDay}`;
    }

    const data = await sql`
        SELECT 
            transactions.id,
            transactions.description,
            transactions.value,
            transactions.date,
            transactions.type,
            transactions.recurring
        FROM transactions
        INNER JOIN users ON users.id = transactions.user_id
        WHERE md5(users.email||users.password) = ${token} 
        AND transactions.date >= ${startDate} AND transactions.date <= ${endDate}
    `;

    let response;

    if (data.rows.length) {
        response = {
            code: 1,
            count: data.rows.length,
            message: `${data.rows.length} transactions found`,
            transactions: data.rows,
        }
    } else {
        response = {
            code: 2,
            count: 0,
            message: `No transactions found`,
        }
    }


    return NextResponse.json(response, { status: 200 });
}

