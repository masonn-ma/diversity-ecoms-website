document.addEventListener('DOMContentLoaded', function() {
    const overlayImg = document.getElementById('overlay-img');
    const blurBg = document.getElementById('blur-bg');
    const uploadImg = document.getElementById('uploadImg');
    const closePopup = document.getElementById('closePopup');
    const html = document.getElementsByTagName('html')[0];
    const userProfileImg = document.getElementById('userProfileImg');

    overlayImg.addEventListener('click', function() {
        blurBg.classList.toggle('active');
        uploadImg.classList.toggle('active');
        html.classList.toggle('stopScroll');
    });
    
    userProfileImg.addEventListener('keydown', function() {
        if (event.key === 'Enter') {
            blurBg.classList.toggle('active');
            uploadImg.classList.toggle('active');
            html.classList.toggle('stopScroll');
            uploadImg.focus();
        }
    });

    closePopup.addEventListener('click', function() {
        blurBg.classList.toggle('active');
        uploadImg.classList.toggle('active');
        html.classList.toggle('stopScroll');
    })

    closePopup.addEventListener('keydown', function() {
        if (event.key === 'Enter') {
            blurBg.classList.toggle('active');
            uploadImg.classList.toggle('active');
            html.classList.toggle('stopScroll');
        }
    })
})