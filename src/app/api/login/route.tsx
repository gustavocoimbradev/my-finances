import { sql } from '@vercel/postgres';

import { NextResponse } from "next/server";
import crypto from 'crypto';

export async function GET(request: Request) {

    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const email = urlParams.get('email');    
    const password = urlParams.get('password');    
    
    const data = await sql`SELECT md5(users.email||users.password) AS token FROM users WHERE email = ${email} AND password = md5(${password})`;
    let response;
    let token;
    if (token = data.rows[0].token) {
        response = {
            code: 1,
            message: 'User authenticated!',
            token: token
        };
    } else {
        response = {
            code: 2,
            message: 'Invalid credentials.'
        }
    }
    return NextResponse.json(response, { status: 200 });
}

