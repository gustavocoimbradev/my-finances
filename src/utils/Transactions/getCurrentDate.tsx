export const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = (today.getMonth() + 1).toString();
    let day = (today.getDate()).toString();
    if (month.length === 1) {
        month = `0${month}`;
      }
      if (day.length === 1) {
        day = `0${day}`;
      }
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
}