export const calculateBalanceNotPaid = (rows:any) => {
    let total = 0;
    rows && rows.forEach((row:any) => {
        if (!row.paid) {
            if (row.type === 1) {
                total += parseFloat(row.value);
            } else {
                total -= parseFloat(row.value);
            }
        }
    });
    return total;
};