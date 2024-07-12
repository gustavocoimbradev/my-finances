import { sql } from '@vercel/postgres';
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/register:
 *   get:
 *     tags:
 *      - Accounts
 *     description: Create an account
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         description: User's name
 *         schema:
 *           type: string
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
 *         description: User created
 *       2:
 *         description: User already exists
 *       3:
 *         description: Failed to create user
 */
export async function GET(request: Request) {
    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const name = urlParams.get('name');    
    const email = urlParams.get('email');    
    const password = urlParams.get('password'); 
    let response;
    if (name && email && password) {
    
        const data = await sql`SELECT count(*) AS found FROM users WHERE email = ${email} AND password = md5(${password})`;
        if (data.rows[0].found > 0) {
            response = {
                code: 2,
                message: 'User already exists'
            }
        } else {
            const insert = await sql`INSERT INTO users (name, email, password) VALUES (${name},${email},md5(${password}))`;
            if (insert) {
                response = {
                    code: 1,
                    message: 'User created'
                };
            } else {
                response = {
                    code: 3,
                    message: 'failed to create user'
                };
            }
        }

    } else {
        response = { 
            code: 3,
            message: 'failed to create user.'
        };
    }
    return NextResponse.json({response}, { status: 200 });
}

