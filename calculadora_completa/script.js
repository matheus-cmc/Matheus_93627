const display = document.getElementById('display');

const botoes = document.querySelectorAll('.botao, .maior, .menor, .a');

botoes.forEach(botao => {
    botao.addEventListener('click', () =>{
        if(botao.textContent ==='C'){
            display.value='';
        } 

        else if(botao.textContent==='DEL'){
            display.value=display.value.slice(0, -1);

        }

        else if(botao.textContent==='='){
            try{
                if(display.value !== ''){
                    console.log('Calculando', display.value);
                display.value=eval(display.value);
                }
            }catch (e){
                console.error("Erro ao calcular:", e)
                display.value="Erro";
            }

        }

        else{
            display.value += botao.textContent
        }
    })
})
