document.addEventListener('DOMContentLoaded', function () {

    const showPassButtons = document.querySelectorAll('#showpass');

    showPassButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            const target = event.target;
            const previousInput = target.previousElementSibling;

            if (previousInput && previousInput.tagName === 'INPUT') {
                if (previousInput.type === 'password') {
                    previousInput.type = 'text';
                    target.textContent = 'Hide Password';
                } else {
                    previousInput.type = 'password';
                    target.textContent = 'Show Password';
                }
            }
        });

        button.addEventListener('keydown', function (event) {
            const target = event.target;
            const previousInput = target.previousElementSibling;
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (previousInput && previousInput.tagName === 'INPUT') {
                    if (previousInput.type === 'password') {
                        previousInput.type = 'text';
                        target.textContent = 'Hide Password';
                    } else {
                        previousInput.type = 'password';
                        target.textContent = 'Show Password';
                    }
                }
            }
        });
    });
});