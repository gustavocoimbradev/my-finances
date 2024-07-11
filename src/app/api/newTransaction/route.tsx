import { sql } from '@vercel/postgres';
import Cookies from 'js-cookie'; 
 
import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const token = urlParams.get('token');    

    const description = urlParams.get('description');    
    const value = urlParams.get('value');    
    const date = urlParams.get('date');    
    const type = urlParams.get('type');    
    const recurring = urlParams.get('recurring') == "1" ? true : false;    
    const paid = urlParams.get('paid') == "1" ? true : false;  
    
    const data = await sql`
        SELECT id FROM users
        WHERE md5(users.email||users.password) = ${token} 
    `;

    let response;

    if (data.rows.length && description && value && date && type) {
        const insert = await sql`INSERT INTO transactions (user_id, description, value, date, type, recurring, paid, from_transaction) VALUES (${data.rows[0].id}, ${description},${value},${date},${type},${recurring},${paid},0)`;
        if (insert) {
            response = {
                code: 1,
                message: `Transaction created successfuly`,
            }
        } else {
            response = {
                code: 3,
                message: 'Failed to create transaction'
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

