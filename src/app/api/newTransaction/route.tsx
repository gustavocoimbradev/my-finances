import { sql } from '@vercel/postgres';
import Cookies from 'js-cookie'; 
 
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/newTransaction:
 *   get:
 *     tags:
 *      - Transactions
 *     description: Create a transaction
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: User's token
 *         schema:
 *           type: string
 *       - in: query
 *         name: description
 *         required: true
 *         description: Transaction description
 *         schema:
 *           type: string
 *       - in: query
 *         name: value
 *         required: true
 *         description: Transaction value
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         description: Transaction date (yyyy-mm-dd)
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         required: true
 *         description: Transaction type (1 = Income / 2 = Expense)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: recurring
 *         required: true
 *         description: Transaction recurring
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: paid
 *         required: true
 *         description: Transaction paid
 *         schema:
 *           type: boolean
 *     responses:
 *       1:
 *         description: Transaction created successfuly
 *       2:
 *         description: Failed to create transaction
 *       3:
 *         description: Failed to create transaction
 */
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
        const insert = await sql`INSERT INTO transactions (user_id, description, value, date, type, recurring, paid, from_transaction) VALUES (${data.rows[0].id}, ${description}, ${value}, ${date}, ${type}, ${recurring}, ${paid}, 0) RETURNING id`;
        const transactionId = insert.rows[0].id;
        await sql`UPDATE transactions SET from_transaction = ${transactionId} WHERE id = ${transactionId}`;
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
            message: `Failed to create transaction`,
        }
    }


    return NextResponse.json(response, { status: 200 });
}

