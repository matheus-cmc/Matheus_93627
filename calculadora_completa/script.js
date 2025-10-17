const display = document.getElementById('display');
const botoes = document.querySelectorAll('button');

let primeiroNumero = '';
let operador = '';
let aguardandoSegundoNumero = false;

botoes.forEach(botao => {
    botao.addEventListener('click', () => {
        const txt = botao.textContent.trim();

       
        if (txt === 'C') {
            display.value = '';
            primeiroNumero = '';
            operador = '';
            aguardandoSegundoNumero = false;
        } 

      
        else if (txt === 'DEL') {
            display.value = display.value.slice(0, -1);
        } 

    
        else if (['+', '-', '*', '/'].includes(txt)) {
            if (display.value !== '') {
                primeiroNumero = display.value;
                operador = txt;
                aguardandoSegundoNumero = true; 
            }
        } 

       
        else if (txt === '=') {
            if (primeiroNumero !== '' && operador !== '' && display.value !== '') {
                const segundoNumero = display.value;
                try {
                    const resultado = eval(primeiroNumero + operador + segundoNumero);
                    display.value = resultado;
                    primeiroNumero = '';
                    operador = '';
                    aguardandoSegundoNumero = false;
                } catch (e) {
                    display.value = 'Erro';
                }
            }
        } 

        else {
          
            if (aguardandoSegundoNumero) {
                display.value = txt;  anterior
                aguardandoSegundoNumero = false;
            } else {
                display.value += txt;
            }
        }
    });
});
