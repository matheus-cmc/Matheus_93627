// função que será chamada ao clicar o botão//
function consultarCep(){
    //Obtém o valor do CEP
    const cep = document.getElementById('cep').value;

    if (cep.length != 8){
        alert("Por favor, insira um CEP válido com 8 dígitos.");
        return;
    }

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
    .then(response => response.json())
    .then(data => {

         if(data.erro){
            alert("CEP não encontrado");
            return; //Interrope a execução se o CEP não for válido

         }

         
            document.getElementById('rua').textContent = data.logradouro;
            document.getElementById('bairro').textContent = data.bairro;
            document.getElementById('cidade').textContent = data.localidade;
            document.getElementById('estado').textContent = data.uf;
    })

    .catch(error => {
        console.error("Erro ao consultar o CEP:", error);
        alert("Ocorreu um erro ao consultar o CEP.");
    });
}