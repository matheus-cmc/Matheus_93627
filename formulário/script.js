function validateform(){
   
    let nome = document.getElementById('nome').value;
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    let confirmasenha  = document.getElementById('confirmasenha').value;
    let errormessage = document.getElementById('erro-message');



    errormessage.textContent='';


if(nome===''){

    errormessage.textContent = 'Por favor, insira o nome.';
    return false;
}


if(email===''){

    errormessage.textContent = 'Por favor, insira o E-mail.';
    return false;
}


if(senha===''){

    errormessage.textContent = 'Por favor, insira sua senha.';
    return false;
}


if(confirmasenha===''){

    errormessage.textContent = 'Por favor, confirme sua senha novamente.';
    return false;
}

 return true;          
}