import { sql } from '@vercel/postgres';
import Cookies from 'js-cookie'; 
 
import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const token = urlParams.get('token');    
    
    const data = await sql`
        SELECT 
            transactions.id,
            transactions.description,
            transactions.value,
            transactions.date,
            transactions.type
        FROM transactions
        INNER JOIN users ON users.id = transactions.user_id
        WHERE md5(users.email||users.password) = ${token} 
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

