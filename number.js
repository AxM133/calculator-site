document.addEventListener('DOMContentLoaded', (event) => {
    const display = document.querySelector('.display');
    const count = document.querySelector('.count');
    const numButtons = document.querySelectorAll('.num');
    const operatorButtons = document.querySelectorAll('.container-button span button:not(.num)');
    let insideBrackets = false;
    let bracketStartIndex = -1;

    const operators = ['/', 'x', '-', '+', '(', ')', '=', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'π', '!', 'ln', 'log', 'e', '^', '√'];
    let expressionHistory = [];
    let memory = 0;

    document.querySelector('.clear').addEventListener('click', () => {
        display.value = '';
        insideBrackets = false;
        bracketStartIndex = -1;
    });

    display.addEventListener('keypress', (event) => {
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '÷', 'x', '-', '+', '(', ')', '*', '/', 'Enter', 'Backspace', 'Delete', ' '];
        const key = event.key;
        if (!allowedKeys.includes(key)) {
            event.preventDefault();
        }
        if (key === 'Enter') {
            evaluateExpression();
            event.preventDefault();
        }
    });

    const evaluateExpression = () => {
        try {
            let expression = display.value;
            expression = expression.replace(/x/g, '*').replace(/÷/g, '/');
            expression = expression.replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E');
            expression = expression.replace(/√/g, 'Math.sqrt');
            expression = expression.replace(/sin/g, 'Math.sin');
            expression = expression.replace(/cos/g, 'Math.cos');
            expression = expression.replace(/tan/g, 'Math.tan');
            expression = expression.replace(/asin/g, 'Math.asin');
            expression = expression.replace(/acos/g, 'Math.acos');
            expression = expression.replace(/atan/g, 'Math.atan');
            expression = expression.replace(/ln/g, 'Math.log');
            expression = expression.replace(/log/g, 'Math.log10');
            expression = expression.replace(/(\d+)!/g, (match, number) => factorial(parseInt(number)));
            expression = expression.replace(/\^/g, '**');
    
            const result = eval(expression);
            expressionHistory.push(`${display.value} = ${result}`);
            if (expressionHistory.length > 3) {
                expressionHistory.shift();
            }
            count.innerHTML = expressionHistory.join('<br>');
            display.value = result;
        } catch (e) {
            display.value = 'Error';
        }
    };    

    const factorial = (n) => {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    };
    

    const insertTextAtCursor = (text) => {
        const start = display.selectionStart;
        const end = display.selectionEnd;
        const before = display.value.substring(0, start);
        const after = display.value.substring(end);
        display.value = before + text + after;
        display.setSelectionRange(start + text.length, start + text.length);
    };

    const insertTextInsideBrackets = (text) => {
        const before = display.value.substring(0, bracketStartIndex + 1);
        const inside = display.value.substring(bracketStartIndex + 1, display.selectionStart);
        const after = display.value.substring(display.selectionStart);
        display.value = before + inside + text + after;
        display.setSelectionRange(bracketStartIndex + 1 + inside.length + text.length, bracketStartIndex + 1 + inside.length + text.length);
    };

    numButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.innerText === 'DEL') {
                const start = display.selectionStart;
                const end = display.selectionEnd;
                if (start === end) {
                    display.value = display.value.slice(0, start - 1) + display.value.slice(end);
                    display.setSelectionRange(start - 1, start - 1);
                } else {
                    display.value = display.value.slice(0, start) + display.value.slice(end);
                    display.setSelectionRange(start, start);
                }
            } else if (!button.classList.contains('clear')) {
                if (insideBrackets) {
                    insertTextInsideBrackets(button.innerText);
                } else {
                    insertTextAtCursor(button.innerText);
                }
            }
        });
    });

    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const operator = button.innerText;
            if (operator === '=') {
                evaluateExpression();
            } else if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'ln', 'log', '√'].includes(operator)) {
                if (!insideBrackets) {
                    const textToAdd = operator + '()';
                    const cursorPosition = display.selectionStart + operator.length + 1;
                    insertTextAtCursor(textToAdd);
                    display.setSelectionRange(cursorPosition, cursorPosition);
                } else {
                    insertTextAtCursor(operator);
                }
            } else {
                insertTextAtCursor(operator);
            }
        });
    });
});