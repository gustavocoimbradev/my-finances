import { sql } from '@vercel/postgres';

import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/login:
 *   get:
 *     tags:
 *      - Accounts
 *     description: Authenticate an user
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: User's email
 *         schema:
 *           type: string
 *       - in: query
 *         name: password
 *         required: true
 *         description: User's password
 *         schema:
 *           type: string
 *     responses:
 *       1:
 *         description: User authenticated
 *       2:
 *         description: Invalid credentials
 */
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
            message: 'User authenticated',
            token: token
        };
    } else {
        response = {
            code: 2,
            message: 'Invalid credentials'
        }
    }
    return NextResponse.json(response, { status: 200 });
}

