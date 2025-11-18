document.addEventListener('DOMContentLoaded', function() {
    // Form de Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this, '/login/', 'message');
        });
    }

    // Form de Cadastro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this, '/register/', 'message');
        });
    }

    // Form de Produto
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this, '/add_product/', 'productMessage', true);
        });
    }

    // Função genérica para envio de formulários
    function handleFormSubmit(form, url, messageId, reload = false) {
        const formData = new FormData(form);
        const messageDiv = document.getElementById(messageId);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Mostrar loading
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageDiv.className = 'message success';
                messageDiv.textContent = data.message;
                form.reset();
                
                if (reload) {
                    setTimeout(() => {
                        location.reload();
                    }, 1500);
                } else if (url === '/login/') {
                    setTimeout(() => {
                        window.location.href = '/dashboard/';
                    }, 1000);
                } else if (url === '/register/') {
                    setTimeout(() => {
                        window.location.href = '/login/';
                    }, 2000);
                }
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Erro de conexão! Tente novamente.';
        })
        .finally(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
    }

    // Função para deletar produtos (botão ×)
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const productCard = this.closest('.product-card');
            
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                fetch(`/delete_product/${productId}`, {
                    method: 'POST'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        productCard.style.opacity = '0';
                        productCard.style.transform = 'translateX(100px)';
                        setTimeout(() => {
                            productCard.remove();
                        }, 300);
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Erro ao excluir produto!');
                });
            }
        });
    });

    // Validação de formulários em tempo real
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = 'var(--accent)';
            } else {
                this.style.borderColor = 'var(--primary)';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.style.borderColor = 'var(--primary)';
            }
        });
    });

    // Efeito de digitação no título
    const heroTitle = document.querySelector('.hero-section h2');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        typeWriter();
    }
});

// Função para deletar produto com verificação de senha
function deleteProduct(productId) {
    const password = document.getElementById(`password_${productId}`).value;
    const messageDiv = document.getElementById('productMessage');
    
    if (!password) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Por favor, digite sua senha!';
        return;
    }
    
    if (!confirm('Tem certeza que deseja deletar este produto?')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('password', password);
    
    fetch(`/delete_my_product/${productId}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageDiv.className = 'message success';
            messageDiv.textContent = data.message;
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Erro ao deletar produto!';
    });
}


// Função para deletar produto com verificação de senha
function deleteProduct(productId) {
    console.log('Tentando deletar produto:', productId);
    
    const passwordInput = document.getElementById(`password_${productId}`);
    if (!passwordInput) {
        console.error('Campo de senha não encontrado para o produto:', productId);
        return;
    }
    
    const password = passwordInput.value;
    const messageDiv = document.getElementById('productMessage');
    
    // Limpar mensagens anteriores
    messageDiv.className = '';
    messageDiv.textContent = '';
    
    if (!password) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ Por favor, digite sua senha!';
        return;
    }
    
    if (!confirm('Tem certeza que deseja deletar este produto?')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('password', password);
    
    fetch(`/delete_my_product/${productId}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageDiv.className = 'message success';
            messageDiv.textContent = '✅ ' + data.message;
            // Limpar o campo de senha
            passwordInput.value = '';
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = '❌ ' + data.message;
            // Limpar o campo de senha
            passwordInput.value = '';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ Erro ao deletar produto!';
        passwordInput.value = '';
    });
}
function deleteProduct(productId) {
    console.log('🔄 Iniciando deleteProduct para ID:', productId);
    
    const passwordInput = document.getElementById(`password_${productId}`);
    const password = passwordInput ? passwordInput.value : '';
    const messageDiv = document.getElementById('productMessage');
    
    console.log('Senha digitada:', password);
    console.log('Div de mensagem:', messageDiv);
    
    // FORÇAR a mensagem a aparecer
    if (messageDiv) {
        messageDiv.innerHTML = '';
        messageDiv.style.display = 'block';
        messageDiv.style.visibility = 'visible';
        messageDiv.style.opacity = '1';
    } else {
        console.error('❌ Div de mensagem não encontrada!');
        alert('Erro: Div de mensagem não encontrada');
        return;
    }
    
    if (!password) {
        console.log('❌ Senha vazia');
        messageDiv.innerHTML = '<div class="message error">❌ Por favor, digite sua senha!</div>';
        return;
    }
    
    console.log('📤 Enviando requisição para verificar senha...');
    
    const formData = new FormData();
    formData.append('password', password);
    
    // Primeiro verifica a senha
    fetch(`/delete_my_product/${productId}`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('📥 Resposta do servidor - Status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('📊 Dados recebidos:', data);
        
        if (data.success) {
            // Senha correta - pergunta confirmação
            console.log('✅ Senha correta - Pedindo confirmação');
            if (confirm('✅ Senha correta! Tem certeza que deseja deletar este produto?')) {
                // Se confirmar, faz a deleção
                messageDiv.innerHTML = '<div class="message success">✅ Deletando produto...</div>';
                
                fetch(`/delete_my_product/${productId}`, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(finalData => {
                    if (finalData.success) {
                        messageDiv.innerHTML = '<div class="message success">✅ ' + finalData.message + '</div>';
                        passwordInput.value = '';
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    } else {
                        messageDiv.innerHTML = '<div class="message error">❌ ' + finalData.message + '</div>';
                    }
                });
            } else {
                messageDiv.innerHTML = '<div class="message">❌ Deleção cancelada</div>';
            }
        } else {
            // Senha incorreta - mostra erro DIRETO
            console.log('❌ Senha incorreta - Mostrando erro');
            messageDiv.innerHTML = '<div class="message error">❌ ' + data.message + '</div>';
            passwordInput.value = '';
            passwordInput.focus();
        }
    })
    .catch(error => {
        console.error('💥 Erro na requisição:', error);
        messageDiv.innerHTML = '<div class="message error">❌ Erro ao conectar com o servidor!</div>';
        passwordInput.value = '';
    });
}

// VERSÃO SIMPLES E DIRETA - deleteAccount
function deleteAccount() {
    const password = document.getElementById('delete_account_password').value;
    const messageDiv = document.getElementById('productMessage');
    
    // SEMPRE limpe e mostre a mensagem
    if (messageDiv) {
        messageDiv.innerHTML = '';
        messageDiv.style.display = 'block';
    }
    
    if (!password) {
        if (messageDiv) {
            messageDiv.innerHTML = '<div class="message error">❌ Por favor, digite sua senha!</div>';
        }
        return;
    }
    
    // Crie uma mensagem de carregamento VISÍVEL
    if (messageDiv) {
        messageDiv.innerHTML = '<div class="message">⏳ Verificando senha...</div>';
    }
    
    fetch('/delete_account/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `password=${encodeURIComponent(password)}`
    })
    .then(response => response.json())
    .then(data => {
        console.log('RESPOSTA DO SERVIDOR (conta):', data);
        
        if (data.success) {
            if (confirm('🚨 ATENÇÃO: Esta ação é PERMANENTE!\n\nTem certeza que deseja deletar SUA CONTA e TODOS os seus produtos?')) {
                if (messageDiv) {
                    messageDiv.innerHTML = '<div class="message success">✅ ' + data.message + '</div>';
                }
                document.getElementById('delete_account_password').value = '';
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                if (messageDiv) {
                    messageDiv.innerHTML = '<div class="message">❌ Deleção cancelada</div>';
                }
            }
        } else {
            // SENHA ERRADA - mostra ERRO
            if (messageDiv) {
                messageDiv.innerHTML = '<div class="message error">❌ ' + data.message + '</div>';
            }
            document.getElementById('delete_account_password').value = '';
        }
    })
    .catch(error => {
        console.error('ERRO:', error);
        if (messageDiv) {
            messageDiv.innerHTML = '<div class="message error">❌ Erro de conexão!</div>';
        }
        document.getElementById('delete_account_password').value = '';
    });
}

// Event listener para os botões de deletar produto
document.addEventListener('DOMContentLoaded', function() {
    // ... (seu código existente aqui) ...
    
    // NOVO CÓDIGO - Event listener para os botões de deletar com senha
    document.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            deleteProduct(productId);
        });
    });
});

// Código de debug - remova depois que estiver funcionando
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada!');
    
    const deleteButtons = document.querySelectorAll('.delete-product-btn');
    console.log(`Encontrados ${deleteButtons.length} botões de deletar`);
    
    deleteButtons.forEach(btn => {
        console.log('Botão encontrado:', btn);
    });
});