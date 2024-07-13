export default function TransactionsOptionsButtons(props:any) {
    return <>
        <div className="options__buttons">
            <button onClick={() => props.handleNewTransaction(`#popup-new-transaction`)}>
                <img src="/icons/plus.svg"/> <span className="text text--bold">New transaction</span>
            </button>
        </div>
    </>
}