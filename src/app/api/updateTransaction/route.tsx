import { sql } from '@vercel/postgres';
import Cookies from 'js-cookie'; 
 
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/updateTransaction:
 *   get:
 *     tags:
 *      - Transactions
 *     description: Update a transaction
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
 *         name: paid
 *         required: true
 *         description: Transaction paid
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: from_transaction
 *         required: true
 *         description: From transaction (original transaction ID, if recurring, or the same ID)
 *         schema:
 *           type: integer
 *     responses:
 *       1:
 *         description: Transaction updated successfuly
 *       2:
 *         description: Failed to update transaction
 *       3:
 *         description: Failed to update transaction
 */
export async function GET(request: Request) {

    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const token = urlParams.get('token');    
    const id = urlParams.get('id');     

    const description = urlParams.get('description');    
    const value = urlParams.get('value');    
    const date = urlParams.get('date');    
    //const type = urlParams.get('type');    
    //const recurring = urlParams.get('recurring') == "1" ? true : false;    
    const paid =  urlParams.get('paid') == "1" ? true : false;    
    const from_transaction =  urlParams.get('from_transaction');    

    const data = await sql`
        SELECT id FROM users
        WHERE md5(users.email||users.password) = ${token} 
    `;

    let response;


    if (data.rows.length && description && value && from_transaction) {

        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${data.rows[0].id} AND (id = ${id} OR from_transaction = ${from_transaction})`;

        await Promise.all(transactions.rows.map(async (row) => {

            if (row.recurring) {
                const oldDay = (row.date.toISOString().slice(8,11)).replace('T','');
                const newDay = date?.slice(8,10);
                const newDate = ((row.date.toISOString()).replace(`-${oldDay}T`,`-${newDay}T`));

                const update = await sql`UPDATE transactions SET description = ${description}, value = ${value}, paid = ${paid}, date = ${newDate} WHERE user_id = ${row.user_id} AND id = ${row.id}`;
                
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

                const update = await sql`UPDATE transactions SET description = ${description}, value = ${value}, date = ${date}, paid = ${paid} WHERE user_id = ${data.rows[0].id} AND (id = ${id} OR from_transaction = ${from_transaction})`;
                
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
            
            }

        }))
            
    } else {
        response = {
            code: 2,
            message: `Failed to update transaction`,
        }
    }


    return NextResponse.json(response, { status: 200 });
}

