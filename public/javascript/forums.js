function toggleAlert() {
    const loginAlert = document.getElementById('loginAlert');
    const html = document.getElementsByTagName('html')[0];
    const blur = document.getElementById('blur-bg');
    html.classList.toggle('stopScroll');
    blur.classList.toggle('active');
    loginAlert.classList.toggle('active');
}

document.addEventListener("DOMContentLoaded", (event) => {
    const createButton = document.getElementById("createPost");
    const closebtn = document.getElementById("closePopup");
    const postForm = document.getElementById('postForm');
    const html = document.getElementsByTagName('html')[0];
    const blur = document.getElementById('blur-bg');

    function toggleCreatePost() {
        html.classList.toggle('stopScroll');
        postForm.classList.toggle('active');
        blur.classList.toggle('active');
    }

    createButton.addEventListener('click', toggleCreatePost);
    closebtn.addEventListener('click', toggleCreatePost);
})



