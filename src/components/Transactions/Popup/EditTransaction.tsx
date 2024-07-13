export default function TransactionsPopupEditTransaction(props: any) {
    return <>
        <div className="popup" id={`popup-${props.id}`} attr-from-transaction={props.from_transaction}>
            <div className="popup__box">
                <div className="popup__box__header">
                    <img src="/icons/edit.svg"/>
                    <span>Edit transaction</span>
                    <button onClick={() => props.closePopup(`#popup-${props.id}`)}><img src="/icons/close.svg"/></button>
                </div>
                <div className="popup__box__content">
                    <form>
                        <input required type="hidden" name="id" id="id" value={props.id}/>
                        <input required type="hidden" name="from_transaction" id="from_transaction" value={props.from_transaction}/>
                        <label htmlFor="description">
                            <input required placeholder="Description" name="text" id="text" value={props.description} onChange={(e) => props.handleDescription(e.target.value)}/>
                        </label>
                        <label htmlFor="value">
                            <input inputMode="decimal" required placeholder="Value" type="text" name="value" id="value" value={props.value} onChange={(e) => props.handleValue(e.target.value)}/>
                        </label>
                        <label htmlFor="date">
                            <input type="date" name="date" id="date" value={props.date} onChange={(e) => props.handleDate(e.target.value)}/>
                        </label>
                        <label htmlFor="paid">
                            <select required name="paid" id="paid" value={props.paid} onChange={(e) => props.handlePaid(e.target.value)}>
                                <option value="0">Pending</option>
                                <option value="1">Paid/received</option>
                            </select>
                        </label>
                    </form>
                </div>
                <div className="popup__box__footer">
                    <button className="text text--danger" onClick={() => props.openPopup(`#popup-delete-${props.id}`)}>Delete transaction</button>
                    <button className="text text--dark" onClick={(e) => props.handleUpdateTransaction(e)}>Confirm changes</button>
                </div>
            </div>
        </div>
    </>
}