export default function TransactionsPopupDeleteTransaction(props:any){
    return <>
        <div className="popup" id={`popup-delete-${props.id}`}>
            <div className="popup__box">
                <div className="popup__box__header">
                    <img src="/icons/trash.svg"/>
                    <span>Delete transaction</span>
                    <button onClick={() => props.openPopup(`#popup-${props.id}`)}><img src="/icons/close.svg"/></button>
                </div>
                <div className="popup__box__content">
                    Are you sure you want to delete this transaction? This action will directly affect your balance.
                </div>
                <div className="popup__box__footer">
                    <button className="text text--dark" onClick={() => props.openPopup(`#popup-${props.id}`)}>Cancel</button>
                    {props.recurring ? (
                        <button className="text text--danger" onClick={(e) => props.handleDeleteTransaction(props.id, e, 'all', props.from_transaction)}>Delete this and the next ones</button>
                    ) : null }
                    <button className="text text--danger" onClick={(e) => props.handleDeleteTransaction(props.id, e, 'this', 0)}>Delete only this one</button>
                </div>
            </div>
        </div>
    </>
}