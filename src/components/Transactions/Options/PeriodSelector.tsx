export default function OptionsPeriodSelector(props:any) {
    return <>
        <div className="options__period">
            <button onClick={() => props.handleDateChanging('prev')}>
                <img src="/icons/angle-left.svg"/>
            </button>
            <span>{props.formatPeriod(props.currentDate?props.currentDate:props.getCurrentDate())}</span>
            <button onClick={() => props.handleDateChanging('next')}>
                <img src="/icons/angle-right.svg"/>
            </button>
        </div>
    </>
}