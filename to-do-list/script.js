// Obtém referências para os elementos do DOM
const taskInput = document.getElementById('task-input'); // Campo de entrada de tarefa
const addTaskButton = document.getElementById('add-task-button'); // Botão de adicionar tarefa
const taskList = document.getElementById('task-list'); // Lista de tarefas

// Adiciona um evento de clique ao botão de adicionar tarefa
addTaskButton.addEventListener('click', function() {
    const taskText = taskInput.value.trim(); // Obtém o texto da tarefa e remove espaços em branco

    // Verifica se o campo de entrada não está vazio
    if (taskText !== '') {
        addTask(taskText); // Adiciona a nova tarefa
        taskInput.value = ''; // Limpa o campo de entrada após adicionar a tarefa
    }
});

// Função para adicionar uma nova tarefa
function addTask(taskText) {
    // Cria um novo item de lista
    const listItem = document.createElement('li');
    listItem.className = 'task-item'; // Adiciona a classe de estilo ao item de lista

    // Cria o elemento de texto para a tarefa
    const taskElement = document.createElement('span');
    taskElement.className = 'task-text'; // Adiciona a classe de estilo ao texto da tarefa
    taskElement.textContent = taskText; // Define o texto da tarefa

    // Cria o botão de edição
    const editButton = document.createElement('button');
    editButton.className = 'edit-task'; // Adiciona a classe de estilo ao botão de edição
    editButton.textContent = 'Editar'; // Define o texto do botão de edição

    // Cria o botão de remoção
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-task'; // Adiciona a classe de estilo ao botão de remoção
    removeButton.textContent = 'Remover'; // Define o texto do botão de remoção

    // Adiciona um evento de clique ao botão de remoção
    removeButton.addEventListener('click', function() {
        taskList.removeChild(listItem); // Remove o item da lista ao clicar no botão de remoção
    });

    // Adiciona um evento de clique ao botão de edição
    editButton.addEventListener('click', function() {
        // Torna o texto da tarefa editável
        if (editButton.textContent === 'Editar') {
            taskElement.contentEditable = true; // Torna o texto editável
            taskElement.focus(); // Foca no texto da tarefa para começar a edição
            editButton.textContent = 'Salvar'; // Altera o texto do botão para "Salvar"
        } else {
            taskElement.contentEditable = false; // Torna o texto não editável
            editButton.textContent = 'Editar'; // Altera o texto do botão de volta para "Editar"
        }
    });

    // Adiciona o texto da tarefa e os botões ao item de lista
    listItem.appendChild(taskElement);
    listItem.appendChild(editButton);
    listItem.appendChild(removeButton);

    // Adiciona o novo item à lista de tarefas
    taskList.appendChild(listItem);
}

// Adiciona um evento de pressionar tecla no campo de entrada
taskInput.addEventListener('keypress', function(event) {
    // Verifica se a tecla pressionada é Enter
    if (event.key === 'Enter') {
        addTaskButton.click(); // Aciona o clique no botão de adicionar tarefa
    }
});