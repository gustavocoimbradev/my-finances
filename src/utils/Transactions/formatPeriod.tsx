export const formatPeriod = (date:string) => {
    const months : {[key: string]:string} = {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    };
    let dateFormatted;
    dateFormatted = `${months[(date).slice(5,7)]} ${(date).slice(0,4)}`;
    return dateFormatted;
}