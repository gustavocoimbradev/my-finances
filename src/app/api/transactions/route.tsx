import { sql } from '@vercel/postgres';
import Cookies from 'js-cookie'; 
 
import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const token = urlParams.get('token');
    const date = urlParams.get('date'); 
    let startDate;
    let endDate;
    if (date) {
        const [yearStr, monthStr] = date.split('-');
        const year = parseInt(yearStr, 10); 
        const month = parseInt(monthStr, 10); 
        const lastDay = new Date(year, month, 0).getDate(); 
        startDate = `${yearStr}-${monthStr}-01`;
        endDate = `${yearStr}-${monthStr}-${lastDay}`;
    }

    const checkRecurring = await sql`
        SELECT 
            transactions.*
        FROM transactions
        INNER JOIN users ON users.id = transactions.user_id
        WHERE md5(users.email||users.password) = ${token} 
        AND transactions.recurring = 1 AND from_transaction = 0 AND transactions.date <= ${endDate}
    `;

    if(checkRecurring.rows.length) {

        const currentPeriod = await sql`
            SELECT 
                count(*) found
            FROM transactions
            INNER JOIN users ON users.id = transactions.user_id
            WHERE md5(users.email||users.password) = ${token} 
            AND transactions.recurring = 1
            AND (transactions.from_transaction = ${checkRecurring.rows[0].id} OR transactions.id = ${checkRecurring.rows[0].id})
            AND transactions.date >= ${startDate} AND transactions.date <= ${endDate} 
        `;

        if (currentPeriod.rows[0].found == "0") {
            const urlParams = new URLSearchParams(request.url.split('?')[1]);
            const date = urlParams.get('date'); 
            if (date) {
                const [yearStr, monthStr] = date.split('-');
                const year = parseInt(yearStr, 10); 
                const month = parseInt(monthStr, 10); 
                const newDate = `${year}-${month}-${checkRecurring.rows[0].date.toISOString().slice(8,10)}`;
                await sql`INSERT INTO transactions (user_id, description, value, date, type, recurring, from_transaction) VALUES (${checkRecurring.rows[0].user_id}, ${checkRecurring.rows[0].description},${checkRecurring.rows[0].value},${newDate},${checkRecurring.rows[0].type},${checkRecurring.rows[0].recurring},${checkRecurring.rows[0].id})`;
            }
        }
    }

    const data = await sql`
        SELECT 
            transactions.id,
            transactions.description,
            transactions.value,
            transactions.date,
            transactions.type,
            transactions.recurring,
            transactions.paid
        FROM transactions
        INNER JOIN users ON users.id = transactions.user_id
        WHERE md5(users.email||users.password) = ${token} 
        AND transactions.date >= ${startDate} AND transactions.date <= ${endDate}
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

