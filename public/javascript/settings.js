document.addEventListener('DOMContentLoaded', function() {
    // const blurBg = document.getElementById('blur-bg');
    // const uploadImg = document.getElementById('uploadImg');
    // const closePopup = document.getElementById('closePopup');
    // const html = document.getElementsByTagName('html')[0];
    const darkMode = document.getElementById('dark');
    const darkModeForm = document.getElementById('darkModeForm');

    darkMode.addEventListener('change', function() {
        darkModeForm.submit()
    })

})