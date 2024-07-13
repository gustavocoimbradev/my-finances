import PopupEditTransaction from '@/components/Transactions/Popup/EditTransaction';
import PopupDeleteTransaction from '@/components/Transactions/Popup/DeleteTransaction';

export default function TransactionsTable(props:any) {
    return <>
        <div className="responsive-table">
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Recurring</th>
                        <th>Date</th>
                        <th>Value</th>
                        <th>Paid/received</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {props.rows && props.rows.map((row:any) => (
                        <tr key={row.id} id={`transaction-${row.id}`} attr-val={row.id} attr-type={row.type}>
                            <td id={`transaction-description-${row.id}`} attr-val={row.description}>{row.description}</td>
                            <td id={`transaction-recurring-${row.id}`} attr-val={row.recurring}>{row.recurring == 0 ? '-' : 'Every month'}</td>
                            <td id={`transaction-date-${row.id}`} attr-val={row.date}>{props.formatDate(row.date)}</td>
                            <td id={`transaction-value-${row.id}`} attr-val={row.value} className={row.type == 1 ? 'text text--bold text--success' : 'text text--bold text--danger'}>
                                {row.type == 1 ? '(+)' : '(-)'} {parseFloat(row.value).toFixed(2)} 
                            </td>
                            <td id={`transaction-paid-${row.id}`} attr-val={row.paid == 1 ? '1' : '0'}>{row.paid == 1 ? 'Yes' : '-'}</td>
                            <td>
                                <button onClick={() => props.openPopup(`#popup-${row.id}`, true)}>
                                    <img src="/icons/edit.svg"/>
                                </button>
                            </td>
                            <PopupEditTransaction
                                id={row.id}
                                from_transaction={row.from_transaction}
                                description={props.description}
                                value={props.value}
                                date={props.date}
                                paid={props.paid}
                                closePopup={props.closePopup}
                                openPopup={props.openPopup}
                                handleDescription={props.handleDescription}
                                handleValue={props.handleValue}
                                handleType={props.handleType}
                                handleRecurring={props.handleRecurring}
                                handleDate={props.handleDate}
                                handlePaid={props.handlePaid}
                                handleUpdateTransaction={props.handleUpdateTransaction}
                                handleDeleteTransaction={props.handleDeleteTransaction}
                            />
                            <PopupDeleteTransaction
                                closePopup={props.closePopup}
                                openPopup={props.openPopup}
                                id={row.id}
                                from_transaction={row.from_transaction}
                                handleDeleteTransaction={props.handleDeleteTransaction}
                                recurring={row.recurring}
                            />
                        </tr>
                    ))}
                    {props.rows?'':
                        <tr>
                            <td colSpan={6} className="message">No transactions found</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    </>
}