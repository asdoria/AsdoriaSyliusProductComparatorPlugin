export default () => {
    const buttons = document.querySelectorAll('.js-prev-page');

    [...buttons].forEach(button => button.addEventListener('click', () => history.back()))
}
