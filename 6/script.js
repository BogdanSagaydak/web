const form = document.getElementById('storageForm');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const rawValue = document.getElementById('gbInput').value.trim().replace(',', '.');
    const gb = parseFloat(rawValue);

    if (isNaN(gb) || !isFinite(rawValue) || gb <= 0) {
        resultDiv.style.color = 'red';
        resultDiv.textContent = 'Помилка: введіть коректне додатне число.';
        return;
    }

    const totalMb = gb * 1024;
    const fileSize = 200;

    const filesCount = Math.floor(totalMb / fileSize);
    const remainingMb = totalMb % fileSize;

    resultDiv.style.color = 'green';
    resultDiv.textContent = `У ${gb} ГБ (${totalMb} МБ) поміститься така кількість фа файлів по 200 МБ: ${filesCount} .`;
});
