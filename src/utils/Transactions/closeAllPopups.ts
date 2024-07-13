export const closeAllPopups = () => {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        popup.classList.remove('active');
    })
}