document.getElementById('formCriarLogin').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const messageDiv = document.getElementById('message');
    
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
        
        const data = await response.json();
        
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
        console.error('Erro:', error);
        messageDiv.style.color = 'red';
        messageDiv.textContent = '❌ Erro de conexão com o servidor';
    }
});