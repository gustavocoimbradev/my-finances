import { sql } from '@vercel/postgres';
import Cookies from 'js-cookie'; 
    
import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const token = urlParams.get('token');    
    const id = urlParams.get('id');     

    const data = await sql`
        SELECT id FROM users
        WHERE md5(users.email||users.password) = ${token} 
    `;


    let response;

    if (data.rows.length && id) {
        const insert = await sql`DELETE FROM transactions WHERE user_id = ${data.rows[0].id} AND id = ${id}`;
        if (insert) {
            response = {
                code: 1,
                message: `Transaction deleted successfuly`,
            }
        } else {
            response = {
                code: 3,
                message: 'Failed to delete the transaction'
            };
        }
    } else {
        response = {
            code: 2,
            message: `Sorry. You can't do that`,
        }
    }


    return NextResponse.json(response, { status: 200 });
}

