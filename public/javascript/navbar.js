document.addEventListener("DOMContentLoaded", (event) => {
    const hamOpen = document.getElementById('hamOpen');
    const hamMenu = document.getElementById('hamMenu');
    const hamClose = document.getElementById('hamClose');
    const html = document.getElementsByTagName('html');
    const blurMobile = document.getElementById('blur-mobile-bg');
    document.getElementById('blur-background').style.height = (document.querySelector('body').scrollHeight - document.querySelector('nav').scrollHeight - document.querySelector
        ('footer').scrollHeight) + "px";

    function toggleMenu() {
        hamMenu.classList.toggle('active');
        html[0].classList.toggle('stopScroll');
        blurMobile.classList.toggle('active');
    }

    hamOpen.addEventListener('click', toggleMenu);
    hamClose.addEventListener('click', toggleMenu);

    const category = document.getElementById('category');
    const category_expand = document.getElementById('category-expand');
    const blur_background = document.getElementById('blur-background');

    function openMenu() {
        category_expand.classList.add('active');
        blur_background.classList.add('active');
    }

    function closeMenu() {
        category_expand.classList.remove('active');
        blur_background.classList.remove('active');
    }

    category.addEventListener('mouseover', openMenu);
    category.addEventListener('mouseout', closeMenu);
});