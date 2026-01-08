function toggleAlert() {
    const loginAlert = document.getElementById('loginAlert');
    const html = document.getElementsByTagName('html')[0];
    const blur = document.getElementById('blur-bg');
    html.classList.toggle('stopScroll');
    blur.classList.toggle('active');
    loginAlert.classList.toggle('active');
}

function toggleReply() {
    const reply = document.querySelector("#replycmt")
    const cmtChild = document.querySelector(".inputCommentChild")

    cmtChild.classList.toggle("active")
}