import { sql } from '@vercel/postgres';
import Cookies from 'js-cookie'; 
 
import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const token = urlParams.get('token');
    const date = urlParams.get('date'); 
    var startDate:string;
    var endDate:string;
    if (date) {

        const [yearStr, monthStr] = date.split('-');
        const year = parseInt(yearStr, 10); 
        const month = parseInt(monthStr, 10); 
        const lastDay = new Date(year, month, 0).getDate(); 
        startDate = `${yearStr}-${monthStr}-01`;
        endDate = `${yearStr}-${monthStr}-${lastDay}`;

        // Percorre transações com recorrência ativada
        const checkRecurring = await sql`SELECT transactions.* FROM transactions INNER JOIN users ON users.id = transactions.user_id WHERE md5(users.email||users.password) = ${token} AND transactions.recurring = TRUE AND from_transaction = transactions.id AND transactions.date <= ${endDate}`;

        await Promise.all(checkRecurring.rows.map(async (row) => {
            
            // Verificar se a transação foi clonada
            const currentPeriod = await sql`
                SELECT 
                    transactions.*
                FROM transactions
                INNER JOIN users ON users.id = transactions.user_id
                WHERE md5(users.email || users.password) = ${token}
                AND transactions.recurring = true
                AND transactions.from_transaction = ${row.id}
                AND transactions.date >= ${startDate}
                AND transactions.date <= ${endDate}
                AND transactions.id <> transactions.from_transaction
                AND NOT EXISTS (
                    SELECT 1 
                    FROM transactions t2
                    WHERE t2.from_transaction = transactions.id
                );
            `;

            if (currentPeriod.rows.length == 0) {

                // Insere 
                const urlParams = new URLSearchParams(request.url.split('?')[1]);
                const date = urlParams.get('date'); 
                if (date) {
                    const [yearStr, monthStr] = date.split('-');
                    const year = parseInt(yearStr, 10); 
                    const month = parseInt(monthStr, 10); 
                    const newDate = `${year}-${month}-${row.date.toISOString().slice(8,10)}`;
                    await sql `INSERT INTO transactions (user_id, description, value, date, type, recurring, from_transaction) VALUES (${row.user_id}, ${row.description},${row.value},${newDate},${row.type},${row.recurring},${row.id})`;
                }

            }
     
        }));

        const data = await sql`
            SELECT 
                transactions.id,
                transactions.description,
                transactions.value,
                transactions.date,
                transactions.type,
                transactions.recurring,
                transactions.paid,
                transactions.from_transaction
            FROM transactions
            INNER JOIN users ON users.id = transactions.user_id
            WHERE md5(users.email||users.password) = ${token} 
            AND transactions.date >= ${startDate} AND transactions.date <= ${endDate}
            AND (transactions.recurring = TRUE and transactions.id <> transactions.from_transaction)
        `;

        let response;

        if (data.rows.length) {
            response = {
                code: 1,
                count: data.rows.length,
                message: `${data.rows.length} transactions found`,
                transactions: data.rows,
            }
        } else {
            response = {
                code: 2,
                count: 0,
                message: `No transactions found`,
            }

        }

        return NextResponse.json(response, { status: 200 });

    }

    const response = {
        code: 2,
        count: 0,
        message: `No transactions found`,
    }

    return NextResponse.json(response, { status: 200 });

}

