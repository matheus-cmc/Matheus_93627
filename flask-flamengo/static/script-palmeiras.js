const perguntas = [
    {
        pergunta: "1️⃣ Em que ano o Palmeiras foi fundado?",
        opcoes: ["1914", "1915", "1920", "1909"],
        correta: "1914"
    },
    {
        pergunta: "2️⃣ Qual é o estádio oficial do Palmeiras?",
        opcoes: ["Allianz Parque", "Pacaembu", "Morumbi", "Maracanã"],
        correta: "Allianz Parque"
    },
    {
        pergunta: "3️⃣ Qual jogador é ídolo histórico do Palmeiras?",
        opcoes: ["Marcos", "Evair", "Djalminha", "Zinho"],
        correta: "Marcos"
    },
    {
        pergunta: "4️⃣ Quantas Libertadores o Palmeiras ganhou até 2023?",
        opcoes: ["2", "3", "1", "4"],
        correta: "3"
    },
    {
        pergunta: "5️⃣ Qual é o mascote oficial do Palmeiras?",
        opcoes: ["Periquito", "Porco", "Águia", "Tigre"],
        correta: "Porco"
    },
    {
        pergunta: "6️⃣ Quem era técnico do Palmeiras na Libertadores 2020?",
        opcoes: ["Abel Ferreira", "Felipão", "Jorge Jesus", "Carpegiani"],
        correta: "Abel Ferreira"
    },
    {
        pergunta: "7️⃣ Qual o apelido carinhoso da torcida do Palmeiras?",
        opcoes: ["Porcada", "Verdão", "Nação Verde", "Torcida Raiz"],
        correta: "Verdão"
    },
    {
        pergunta: "8️⃣ Quem marcou gols decisivos na final da Libertadores 2020?",
        opcoes: ["Rony", "Dudu", "Gustavo Scarpa", "Breno lopes"],
        correta: "Breno lopes"
    },
    {
        pergunta: "9️⃣ Quantos títulos brasileiros o Palmeiras possui até 2023?",
        opcoes: ["11", "10", "9", "12"],
        correta: "11"
    },
    {
        pergunta: "🔟 Quem é conhecido como 'Goleiro eterno do Palmeiras'?",
        opcoes: ["Marcos", "Felipão", "Weverton", "Fernando Prass"],
        correta: "Marcos"
    },
    {
        pergunta: "11️⃣ Em quais anos o Palmeiras foi rebaixado para a segunda divisão?",
        opcoes: ["2002 e 2012", "1999 e 2005", "2003 e 2013", "2000 e 2010"],
        correta: "2002 e 2012"
    },
    {
        pergunta: "🔟 O Palmeiras tem mundial?",
        opcoes: ["Sim, várias vezes", "Claro que sim", "Não, mas a zoeira é garantida", "Nem de longe"],
        correta: "Não, mas a zoeira é garantida"
    }
];

let indiceAtual = 0;
let pontuacao = 0;
let erros = 0;

const telaInicial = document.getElementById("tela-inicial");
const quizContainer = document.getElementById("quiz");
const nextBtn = document.getElementById("next-btn");
const startBtn = document.getElementById("start-btn");
const controls = document.getElementById("controls");
const resultadoDiv = document.getElementById("resultado");

startBtn.addEventListener("click", iniciarQuiz);
nextBtn.addEventListener("click", verificarResposta);

function iniciarQuiz() {
    telaInicial.style.display = "none";
    quizContainer.style.display = "block";
    controls.style.display = "block";
    mostrarPergunta();
}

function mostrarPergunta() {
    const q = perguntas[indiceAtual];
    quizContainer.innerHTML = `
        <div class="question active">
            <h3>${q.pergunta}</h3>
            ${q.opcoes
                .map(
                    (opcao) => `
                <label>
                    <input type="radio" name="resposta" value="${opcao}"> ${opcao}
                </label>
            `
                )
                .join("")}
        </div>
        <div id="feedback" style="margin-top:10px; font-weight:bold;"></div>
    `;
}

function verificarResposta() {
    const selecionada = document.querySelector("input[name='resposta']:checked");
    if (!selecionada) return alert("Escolha uma opção!");

    const resposta = selecionada.value;
    const feedbackDiv = document.getElementById("feedback");

    if (resposta === perguntas[indiceAtual].correta) {
        pontuacao++;
        feedbackDiv.textContent = "✅ Acertou!";
        feedbackDiv.style.color = "#0f0";
    } else {
        erros++;
        feedbackDiv.textContent = `❌ Errou! A resposta certa é: ${perguntas[indiceAtual].correta}`;
        feedbackDiv.style.color = "#f00";
    }

    const radios = document.querySelectorAll("input[name='resposta']");
    radios.forEach(r => r.disabled = true);

    setTimeout(() => {
        indiceAtual++;
        if (indiceAtual < perguntas.length) {
            animarTransicao();
            setTimeout(mostrarPergunta, 400);
        } else {
            mostrarResultado();
        }
    }, 1000);
}

function mostrarResultado() {
    quizContainer.style.display = "none";
    controls.style.display = "none";
    resultadoDiv.style.display = "block";
    resultadoDiv.innerHTML = `
        <h2>🏆 Resultado do Quiz 🏆</h2>
        <p>✅ Acertos: ${pontuacao}</p>
        <p>❌ Erros: ${erros}</p>
        ${pontuacao === perguntas.length
            ? "💚 VERDÃO NA VEIA! 💚"
            : pontuacao >= 4
            ? "👏 Mandou bem, quase um craque do Allianz!"
            : "😅 Tá na hora de rever os jogos do Verdão!"}
        <br>
        <img src="/static/img/escudo-palmeiras.jpg" alt="Escudo do Palmeiras" class="escudo" />
        <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px; align-items: center;">
            <button id="btn-reiniciar">🔁 Jogar Novamente</button>
            <button id="btn-flamengo">❤️ Ir para o Quiz do Flamengo</button>
        </div>
    `;

    // ✅ Agora adicionamos os eventos DEPOIS que o HTML foi inserido
    document.getElementById("btn-reiniciar").addEventListener("click", reiniciarQuiz);
    document.getElementById("btn-flamengo").addEventListener("click", irParaFlamengo);
}

function irParaFlamengo() {
    // redireciona para o arquivo do quiz do Flamengo
    window.location.href = "index.html";
}



function reiniciarQuiz() {
    indiceAtual = 0;
    pontuacao = 0;
    erros = 0;
    resultadoDiv.style.display = "none";
    telaInicial.style.display = "block";
}

function animarTransicao() {
    const perguntaAtual = document.querySelector(".question");
    if (perguntaAtual) {
        perguntaAtual.classList.remove("active");
        perguntaAtual.style.opacity = 0;
        perguntaAtual.style.transform = "translateY(-20px)";
    }
}
