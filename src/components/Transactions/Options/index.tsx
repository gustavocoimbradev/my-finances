import PeriodSelector from '@/components/Transactions/Options/PeriodSelector';
import Buttons from '@/components/Transactions/Options/Buttons';

export default function TransactionsOptions(props:any) {
    return <>
        <div className="options">
            <div className="options__left"></div>
            <PeriodSelector {...props}/>
            <Buttons {...props}/>
        </div>
    </>
}