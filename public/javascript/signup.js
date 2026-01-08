document.addEventListener('DOMContentLoaded', function () {

    const showPassButtons = document.querySelectorAll('#showpass');
    const name = document.getElementById('username');
    const errName = document.getElementById('errorName');

    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const retype = document.getElementById('retype');

    showPassButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            const target = event.target;
            const previousInput = target.previousElementSibling.previousElementSibling;

            if (previousInput && previousInput.tagName === 'INPUT') {
                if (previousInput.type === 'password') {
                    previousInput.type = 'text';
                    target.textContent = 'Hide Password';
                    target.setAttribute('aria-pressed', 'true');
                } else {
                    previousInput.type = 'password';
                    target.textContent = 'Show Password';
                    target.setAttribute('aria-pressed', 'false');
                }
            }
        });

        button.addEventListener('keydown', function (event) {
            const target = event.target;
            const previousInput = target.previousElementSibling.previousElementSibling;

            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (previousInput && previousInput.tagName === 'INPUT') {
                    if (previousInput.type === 'password') {
                        previousInput.type = 'text';
                        target.textContent = 'Hide Password';
                        target.setAttribute('aria-pressed', 'true');
                    } else {
                        previousInput.type = 'password';
                        target.textContent = 'Show Password';
                        target.setAttribute('aria-pressed', 'false');
                    }
                }
            }
        });
    });

    name.addEventListener('blur', function () {
        if (name.value === '') {
            errorName.textContent = 'Username cannot be empty.';
        }
    });

    email.addEventListener('blur', function () {
        if (email.value === '') {
            errorEmail.textContent = 'Email cannot be empty.';
        }
    });

    password.addEventListener('blur', function () {
        if (password.value === '') {
            errorPass.textContent = 'Password cannot be empty.';
        }
    });

    retype.addEventListener('blur', function () {
        if (retype.value !== password.value) {
            errorRetype.textContent = 'Passwords must be matching.';
        }
    });

    function clearErr(event) {
        const target = event.target;
        target.nextElementSibling.textContent = '';
    }

    name.addEventListener('focus', clearErr);
    email.addEventListener('focus', clearErr);
    password.addEventListener('focus', clearErr);
    retype.addEventListener('focus', clearErr);

    function onSubmit(token) {
      document.getElementById("signupForm").submit();
    }
});