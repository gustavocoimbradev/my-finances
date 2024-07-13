export default function TransactionsBalance(props:any) {
    return <>
        <div className="balance">
            <h4>Balance (pending)</h4>
            <h2>{props.balanceNotPaid.toFixed(2)}</h2>
            <h4>Balance (paid/received)</h4>
            <h1 className={`text ${props.balancePaid>=0?'text--success':'text--danger'}`}>{props.balancePaid.toFixed(2)}</h1>
        </div>
    </>
}