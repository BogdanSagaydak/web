function sumOrMinus(numbers) {
    const count = numbers.length;

    if (count === 0) {
        return 0;
    }

    if (count % 2 === 0) {
        let sum = 0;
        for (let i = 0; i < count; i++) {
            sum += numbers[i];
        }
        return {
            result: sum,
            explanation: `Кількість елементів парна (${count}). Сума всіх чисел:`
        };
    } 

    else {
        let lastElement = numbers[count - 1];
        let othersSum = 0;
        
        for (let i = 0; i < count - 1; i++) {
            othersSum += numbers[i];
        }
        
        let result = lastElement - othersSum;
        return {
            result: result,
            explanation: `Кількість елементів непарна (${count}). Останнє мінус сума інших:`
        };
    }
}

const form = document.getElementById('calcForm');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const rawValue = document.getElementById('numbersInput').value.trim();
    const parts = rawValue.split(/[\s,]+/).filter(Boolean);

    if (parts.length === 0) {
        resultDiv.style.color = 'red';
        resultDiv.textContent = 'Помилка: введіть хоча б одне число.';
        return;
    }

    let numbers = [];
    
    for (let i = 0; i < parts.length; i++) {
        let cleanedStr = parts[i].replace(',', '.');
        let num = parseFloat(cleanedStr);

        if (isNaN(num) || !isFinite(cleanedStr)) {
            resultDiv.style.color = 'red';
            resultDiv.textContent = `Помилка: "${parts[i]}" не є коректним числом.`;
            return;
        }
        numbers.push(num);
    }

    const calculation = sumOrMinus(numbers);

    resultDiv.style.color = 'green';
    resultDiv.textContent = `${calculation.explanation} ${calculation.result}`;
});


//------------------------------------------------------------------------------------------------------------------


function factorialRecursion(n) {
    if (n === 0 || n === 1) {
        return 1;
    }
    return n * factorialRecursion(n - 1);
}

const factorialForm2 = document.getElementById('factorialForm2');
const resultFactorial2 = document.getElementById('resultFactorial2');

factorialForm2.addEventListener('submit', function(event) {
    event.preventDefault(); // Запобігаємо перезавантаженню сторінки

    const rawValue = document.getElementById('factorialInput2').value.trim().replace(',', '.');
    const n = parseFloat(rawValue);

    if (isNaN(n) || !isFinite(rawValue) || n < 0 || !Number.isInteger(n)) {
        resultFactorial2.style.color = 'red';
        resultFactorial2.textContent = 'Помилка: введіть ціле невід\'ємне число.';
        return;
    }

    if (n > 170) {
        resultFactorial2.style.color = 'red';
        resultFactorial2.textContent = 'Помилка: число занадто велике для обчислень (максимум 170).';
        return;
    }

    const result = factorialRecursion(n);

    resultFactorial2.style.color = 'green';
    resultFactorial2.textContent = `Факторіал числа ${n} (!${n}) дорівнює: ${result}`;
});


//------------------------------------------------------------------------------------------------------------------


let numberOfRecursionCalls = 0;

function fibonacciRecursion(n) {
    numberOfRecursionCalls++;
    if (n <= 1) {
        return n;
    }
    return fibonacciRecursion(n - 1) + fibonacciRecursion(n - 2);
}


function createFibonacciMemo() {
    const cache = {};
    let callCount = 0;

    function fib(n) {
        callCount++;
        
        if (n <= 1) {
            return n;
        }
        
        if (cache[n] !== undefined) {
            return cache[n];
        }
        
        cache[n] = fib(n - 1) + fib(n - 2);
        return cache[n];
    }

    fib.getCallCount = function() {
        return callCount;
    };
    
    fib.resetCallCount = function() {
        callCount = 0;
    };

    return fib;
}

const fibonacciMemo = createFibonacciMemo();

const fibonacciForm3 = document.getElementById('fibonacciForm3');
const resultFibonacci3 = document.getElementById('resultFibonacci3');

fibonacciForm3.addEventListener('submit', function(event) {
    event.preventDefault(); // Запобігаємо перезавантаженню сторінки

    const rawValue = document.getElementById('fibonacciInput3').value.trim().replace(',', '.');
    const n = parseFloat(rawValue);

    if (isNaN(n) || !isFinite(rawValue) || n < 0 || !Number.isInteger(n)) {
        resultFibonacci3.style.color = 'red';
        resultFibonacci3.textContent = 'Помилка: введіть ціле невід\'ємне число.';
        return;
    }

    if (n > 40) {
        resultFibonacci3.style.color = 'red';
        resultFibonacci3.textContent = 'Помилка: для звичайної рекурсії значення n не повинно перевищувати 40.';
        return;
    }

    numberOfRecursionCalls = 0;
    const resultRec = fibonacciRecursion(n);

    fibonacciMemo.resetCallCount();
    const resultMemo = fibonacciMemo(n);
    const memoCalls = fibonacciMemo.getCallCount();

    resultFibonacci3.style.color = 'green';
    resultFibonacci3.innerHTML = `
        <strong>Результат Фібоначчі для n = ${n}:</strong> ${resultMemo}<br><br>
        <strong>1. Звичайна рекурсія:</strong><br>
        — Кількість викликів функції: <code>${numberOfRecursionCalls}</code><br>
        <strong>2. Мемоізована рекурсія (з замиканням):</strong><br>
        — Кількість викликів функції: <code>${memoCalls}</code><br>
    `;
});

