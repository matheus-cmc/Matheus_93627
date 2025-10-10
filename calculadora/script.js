document.getElementById('CalculatorForm').addEventListener
('submit',
      function(event){
                       event.preventDefault();

        const num1 = parseFloat(document.getElementById('num1').value);
        const num2 = parseFloat(document.getElementById('num2').value);

        if (isNaN(num1)||isNaN(num2)) {
            alert('Por favor, insira números válidas!');
            return;
        }

        const result = num1 + num2;

        document.getElementById('result').textContent = result;
});