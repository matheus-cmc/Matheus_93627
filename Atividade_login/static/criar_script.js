document.getElementById('formCriarLogin').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const messageDiv = document.getElementById('message');
    
    console.log("🎯 Tentando criar conta no MySQL...");
    
    if (password !== confirmPassword) {
        messageDiv.style.display = 'block';
        messageDiv.style.color = 'red';
        messageDiv.textContent = '❌ As senhas não coincidem!';
        return;
    }
    
    if (password.length < 6) {
        messageDiv.style.display = 'block';
        messageDiv.style.color = 'red';
        messageDiv.textContent = '❌ A senha deve ter pelo menos 6 caracteres!';
        return;
    }
    
    // Mostrar loading
    messageDiv.style.display = 'block';
    messageDiv.style.color = '#007bff';
    messageDiv.textContent = 'Criando conta...';
    
    try {
        console.log("📤 Enviando dados para criação de usuário...");
        
        const response = await fetch('/criar_usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                confirm_password: confirmPassword
            })
        });
        
        console.log("📥 Resposta recebida:", response.status);
        
        const data = await response.json();
        console.log("📋 Dados:", data);
        
        if (data.success) {
            messageDiv.style.color = 'green';
            messageDiv.textContent = '✅ ' + data.message;
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = '❌ ' + data.message;
        }
    } catch (error) {
        console.error('💥 ERRO COMPLETO:', error);
        messageDiv.style.color = 'red';
        messageDiv.textContent = '❌ Erro de conexão com o servidor.';
    }
});

// Teste de conexão quando a página carrega
window.addEventListener('load', function() {
    console.log("🔍 Testando conexão com MySQL...");
    fetch('/teste_db')
        .then(response => response.json())
        .then(data => {
            console.log("📊 Status MySQL:", data);
            if (data.success) {
                console.log("✅ MySQL conectado na porta 3307");
                console.log(`📊 Usuários: ${data.users}, Produtos: ${data.products}`);
            } else {
                console.log("❌ MySQL não conectado:", data.message);
            }
        })
        .catch(error => {
            console.log("❌ Servidor não responde");
        });
});