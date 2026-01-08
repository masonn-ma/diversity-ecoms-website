document.addEventListener('DOMContentLoaded', function() {
    const reactivateAccount = document.getElementById('reactivate-account-section');
    const blurBg = document.getElementById('blur-bg');
    const reactivateForm = document.getElementById('reactivateForm');
    const closePopup = document.getElementById('closePopup');
    const html = document.getElementsByTagName('html')[0];

    reactivateAccount.addEventListener('click', function() {
        blurBg.classList.toggle('active');
        reactivateForm.classList.toggle('active');
        html.classList.toggle('stopScroll');
    });

    closePopup.addEventListener('click', function() {
        blurBg.classList.toggle('active');
        reactivateForm.classList.toggle('active');
        html.classList.toggle('stopScroll');
    })
})