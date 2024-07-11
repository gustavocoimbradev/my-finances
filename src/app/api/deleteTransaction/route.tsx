import { sql } from '@vercel/postgres';
import Cookies from 'js-cookie'; 
    
import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const token = urlParams.get('token');    
    const id = urlParams.get('id');     
    const from_transaction = urlParams.get('from_transaction');     
    const which = urlParams.get('which');     
    const date = urlParams.get('date');     

    const data = await sql`
        SELECT id FROM users
        WHERE md5(users.email||users.password) = ${token} 
    `;


    let response;

    if (data.rows.length && id && date) {

        const execute = await sql`
            DELETE FROM transactions
            WHERE 
            (user_id = ${data.rows[0].id} AND id = ${id})
            OR (from_transaction = ${from_transaction} AND ${which} = 'all' AND date >= ${date})
        `;

        if (which == 'all') {
            await sql`UPDATE transactions SET recurring = false WHERE user_id = ${data.rows[0].id} AND from_transaction = ${from_transaction}`;
        }
        
        if (execute) {
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

