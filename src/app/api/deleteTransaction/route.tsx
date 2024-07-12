import { sql } from '@vercel/postgres';
import Cookies from 'js-cookie'; 
    
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/deleteTransaction:
 *   get:
 *     tags:
 *      - Transactions
 *     description: Delete a transaction
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: User's token
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         required: true
 *         description: Transaction ID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: from_transaction
 *         required: true
 *         description: From transaction (original transaction ID, if recurring, or the same ID)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: which
 *         required: true
 *         description: Which transaction (this = just this transaction / all = the next ones, if recurring)
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         description: Transaction period (yyyy-mm)
 *         schema:
 *           type: string
 *     responses:
 *       1:
 *         description: Transaction deleted successfuly
 *       2:
 *         description: Failed to delete transaction
 *       3:
 *         description: Failed to delete transaction
 */
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
            message: `Failed to delete the transaction`,
        }
    }


    return NextResponse.json(response, { status: 200 });
}

