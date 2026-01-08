
document.addEventListener("DOMContentLoaded", function() {
    const email = document.getElementById('email');
    const phone = document.getElementById('phoneNumber');
    const firstName = document.getElementById('firstName');

    const houseNumber = document.getElementById('houseNumber');
    const streetName = document.getElementById('streetName');
    const province = document.getElementById('province');
    const district = document.getElementById('district');
    const ward = document.getElementById('ward');
    const city = document.getElementById('city');
    const checkbox = document.getElementById('privacyPolicy');

    function toggleError(event) {
        const target = event.target;
        const nextDiv = target.nextElementSibling;

        if (target.value === '') {
            nextDiv.style.display = 'block';
        } else {
            nextDiv.style.display = 'none';
        }
    }

    email.addEventListener('blur', toggleError);
    phone.addEventListener('blur', toggleError);
    firstName.addEventListener('blur', toggleError);
    houseNumber.addEventListener('blur', toggleError);
    streetName.addEventListener('blur', toggleError);
    province.addEventListener('blur', toggleError);
    ward.addEventListener('blur', toggleError);
    district.addEventListener('blur', toggleError);
    city.addEventListener('blur', toggleError);
    checkbox.addEventListener('click', function(event) {
        const target = event.target;
        const nextDiv = target.nextElementSibling.nextElementSibling;

        if (checkbox.checked) {
            nextDiv.style.display = 'none';
        } else {
            nextDiv.style.display = 'block';
        }
    })

    document.getElementById('addressBook').addEventListener('change', function() {
        houseNumber.value = '123';
        streetName.value = 'Fake Street';
    });

    function validation(event) {
        let isError = false;

        if (email.value === '') {
            email.nextElementSibling.style.display = 'block';
            isError = true;
        }
        if (phone.value === '') {
            phone.nextElementSibling.style.display = 'block';
            isError = true;
        }
        if (firstName.value === '') {
            firstName.nextElementSibling.style.display = 'block';
            isError = true;
        }
        if (streetName.value === '') {
            streetName.nextElementSibling.style.display = 'block';
            isError = true;
        }
        if (province.value === '') {
            province.nextElementSibling.style.display = 'block';
            isError = true;
        }
        if (ward.value === '') {
            ward.nextElementSibling.style.display = 'block';
            isError = true;
        }
        if (district.value === '') {
            district.nextElementSibling.style.display = 'block';
            isError = true;
        }
        if (city.value === '') {
            city.nextElementSibling.style.display = 'block';
            isError = true;
        }
        if (houseNumber.value === '') {
            houseNumber.nextElementSibling.style.display = 'block';
            isError = true;
        }
        if (!checkbox.checked) {
            checkbox.nextElementSibling.nextElementSibling.style.display = 'block';
            isError = true;
        }

        if (isError) {
            event.preventDefault()
        } else {
            console.log('ok');
        }
    }

    const submit = document.getElementById('submit');

    submit.addEventListener('click', validation);
});

