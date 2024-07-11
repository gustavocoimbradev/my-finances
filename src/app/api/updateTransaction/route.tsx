import { sql } from '@vercel/postgres';
import Cookies from 'js-cookie'; 
 
import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const token = urlParams.get('token');    
    const id = urlParams.get('id');     

    const description = urlParams.get('description');    
    const value = urlParams.get('value');    
    const date = urlParams.get('date');    
    const type = urlParams.get('type');    
    const recurring = urlParams.get('recurring');    

    const data = await sql`
        SELECT id FROM users
        WHERE md5(users.email||users.password) = ${token} 
    `;

    let response;

    if (data.rows.length && description && value && date && type) {
        const update = await sql`UPDATE transactions SET description = ${description}, value = ${value}, date = ${date}, type = ${type}, recurring = ${recurring} WHERE user_id= ${data.rows[0].id} AND id = ${id}`;
        if (update) {
            response = {
                code: 1,
                message: `Transaction updated successfuly`,
            }
        } else {
            response = {
                code: 3,
                message: 'Failed to update transaction'
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

