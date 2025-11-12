// Carregar produtos ao abrir a página
document.addEventListener('DOMContentLoaded', carregarProdutos);

// Cadastrar produto
document.getElementById('formProduto').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const quantidade = document.getElementById('quantidade').value;
    const messageDiv = document.getElementById('message');
    
    if (!nome || !preco || !quantidade) {
        showMessage('❌ Preencha todos os campos!', 'red');
        return;
    }
    
    if (preco <= 0 || quantidade < 0) {
        showMessage('❌ Preço e quantidade devem ser valores válidos!', 'red');
        return;
    }
    
    showMessage('Cadastrando produto...', 'blue');
    
    try {
        const response = await fetch('/cadastrar_produto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: nome,
                preco: parseFloat(preco),
                quantidade: parseInt(quantidade)
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('✅ ' + data.message, 'green');
            document.getElementById('formProduto').reset();
            carregarProdutos();
        } else {
            showMessage('❌ ' + data.message, 'red');
        }
    } catch (error) {
        console.error('Erro:', error);
        showMessage('❌ Erro de conexão com o servidor', 'red');
    }
});

// Carregar lista de produtos
async function carregarProdutos() {
    try {
        const response = await fetch('/listar_produtos');
        const data = await response.json();
        
        const listaDiv = document.getElementById('listaProdutos');
        
        if (data.success && data.produtos.length > 0) {
            let html = '<table><tr><th>ID</th><th>Nome</th><th>Preço</th><th>Quantidade</th></tr>';
            
            data.produtos.forEach(produto => {
                html += `<tr>
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>R$ ${produto.preco.toFixed(2)}</td>
                    <td>${produto.quantidade}</td>
                </tr>`;
            });
            
            html += '</table>';
            listaDiv.innerHTML = html;
        } else {
            listaDiv.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">Nenhum produto cadastrado ainda.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        const listaDiv = document.getElementById('listaProdutos');
        listaDiv.innerHTML = '<p style="text-align: center; color: red;">Erro ao carregar produtos</p>';
    }
}

function showMessage(text, color) {
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'block';
    messageDiv.style.color = color;
    messageDiv.textContent = text;
    
    if (color === 'green') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}