export const closePopup = (ref:string) => {
    const popup = document.querySelector(`${ref}`);
    if (popup) {
        popup.classList.remove(`active`);
    }
}