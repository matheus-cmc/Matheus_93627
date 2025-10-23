function consultarCnpj() {
    const cnpj = document.getElementById('cnpj').value.trim();

    if (cnpj.length !== 14 || isNaN(cnpj)) {
        alert("Por favor, insira um CNPJ válido com 14 dígitos numéricos.");
        return;
    }

    const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro na resposta da API");
            }
            return response.json();
        })
        .then(data => {
            // Função para formatar o texto
            function formatarTexto(texto) {
                if (!texto) return "—";
                return texto
                    .toLowerCase()
                    .replace(/(?:^|\s)\S/g, letra => letra.toUpperCase());
            }

            document.getElementById('razao').textContent = formatarTexto(data.razao_social);
            document.getElementById('fantasia').textContent = formatarTexto(data.nome_fantasia);
            document.getElementById('cep').textContent = data.cep || "—";
            document.getElementById('municipio').textContent = formatarTexto(data.municipio);
            document.getElementById('uf').textContent = data.uf || "—";
            document.getElementById('situacao').textContent = formatarTexto(data.descricao_situacao_cadastral);
        })
        .catch(error => {
            console.error("Erro ao consultar o CNPJ:", error);
            alert("Ocorreu um erro ao consultar o CNPJ ou ele não foi encontrado.");
        });
}
