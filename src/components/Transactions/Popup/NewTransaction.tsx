export default function TransactionsPopupNewTransaction(props: any) {
    return <>
        <div className="popup" id={`popup-new-transaction`}>
            <div className="popup__box">
                <div className="popup__box__header">
                    <img src="/icons/plus.svg"/>
                    <span>New transaction</span>
                    <button onClick={() => props.closePopup(`#popup-new-transaction`)}><img src="/icons/close.svg"/></button>
                </div>
                <div className="popup__box__content">
                    <form>
                        <label htmlFor="description">
                            <input required placeholder="Description" name="text" id="text" value={props.description} onChange={(e) => props.handleDescription(e.target.value)}/>
                        </label>
                        <label htmlFor="value">
                            <input inputMode="decimal" required placeholder="Value" type="text" name="value" id="value" value={props.value} onChange={(e) => props.handleValue(e.target.value)}/>
                        </label>
                        <label htmlFor="type">
                            <select required name="type" id="type" value={props.type} onChange={(e) => props.handleType(e.target.value)}>
                                <option value="1">Income</option>
                                <option value="2">Expense</option>
                            </select>
                        </label>
                        <label htmlFor="recurring">
                            <select required name="recurring" id="recurring" value={props.recurring} onChange={(e) => props.handleRecurring(e.target.value)}>
                                <option value="0">Just once</option>
                                <option value="1">Every month</option>
                            </select>
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
                    <button className="text text--dark" onClick={(e) => props.handleSaveTransaction(e)}>Save transaction</button>
                </div>
            </div>
        </div>
    </>
}