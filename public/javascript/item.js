document.addEventListener("DOMContentLoaded", (event) => {
    const decrease = document.getElementById('decrease');
    const increase = document.getElementById('increase');
    const quantityInput = document.getElementById('quantityInput');

    window.onload = () => {
        quantityInput.onpaste = e => e.preventDefault();
    }
    
    function decreaseAmount() {
        if (parseInt(quantityInput.value) > 1) {
            let inValue = parseInt(quantityInput.value);
            inValue--;
            quantityInput.value = String(inValue);
        }
    }

    function increaseAmount() {
        if (parseInt(quantityInput.value) < parseInt(quantityInput.max)) {
            let inValue = parseInt(quantityInput.value);
            inValue++;
            quantityInput.value = String(inValue);
        }
    }

    decrease.addEventListener('click', decreaseAmount);
    increase.addEventListener('click', increaseAmount);

    decrease.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            decreaseAmount;
        }
    });

    increase.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            increaseAmount;
        }
    });
});