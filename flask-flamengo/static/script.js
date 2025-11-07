const perguntas = [
    {
        pergunta: "1️⃣ Em que ano o Flamengo foi fundado?",
        opcoes: ["1895", "1901", "1912", "1910"],
        correta: "1895"
    },
    {
        pergunta: "2️⃣ Qual é o estádio onde o Flamengo costuma mandar seus jogos?",
        opcoes: ["Maracanã", "Mineirão", "Morumbi", "São Januário"],
        correta: "Maracanã"
    },
    {
        pergunta: "3️⃣ Quem é considerado o maior ídolo da história do Flamengo?",
        opcoes: ["Zico", "Romário", "Ronaldinho Gaúcho", "Gabigol"],
        correta: "Zico"
    },
    {
        pergunta: "4️⃣ Em que ano o Flamengo conquistou a Libertadores pela primeira vez?",
        opcoes: ["1981", "1995", "2019", "2009"],
        correta: "1981"
    },
    {
        pergunta: "5️⃣ Qual é o mascote oficial do Flamengo?",
        opcoes: ["Urubu", "Leão", "Águia", "Tigre"],
        correta: "Urubu"
    },
    {
        pergunta: "6️⃣ Qual o apelido carinhoso da torcida do Flamengo?",
        opcoes: ["Nação Rubro-Negra", "Galera do Mengão", "Torcida Raiz", "Mengão Fan"],
        correta: "Nação Rubro-Negra"
    },
    {
        pergunta: "7️⃣ Quem era o técnico do Flamengo na conquista da Libertadores de 2019?",
        opcoes: ["Jorge Jesus", "Tite", "Dorival Júnior", "Carpegiani"],
        correta: "Jorge Jesus"
    },
    {
        pergunta: "8️⃣ Quem marcou o gol decisivo na final da Libertadores 2019?",
        opcoes: ["Gabigol", "Diego", "Arrascaeta", "Bruno Henrique"],
        correta: "Gabigol"
    },
    {
        pergunta: "9️⃣ Quantos títulos brasileiros o Flamengo possui até 2023?",
        opcoes: ["7", "6", "8", "5"],
        correta: "8"
    },
    {
        pergunta: "🔟 Qual jogador é conhecido como 'Artilheiro da Nação'?",
        opcoes: ["Gabigol", "Zico", "Adriano", "Romário"],
        correta: "Gabigol"
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

    // Desabilitar opções
    const radios = document.querySelectorAll("input[name='resposta']");
    radios.forEach(r => r.disabled = true);

    // Mostrar próximo após 1 segundo
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
            ? "🔥 MENGÃO NA VEIA! 🔥"
            : pontuacao >= 4
            ? "👏 Mandou bem, quase um craque do Ninho!"
            : "😅 Tá na hora de rever os jogos do Mengão!"}
        <br>
        <img src="/static/img/escudo.png" alt="Escudo do Flamengo" class="escudo" />
        <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px; align-items: center;">
            <button onclick="reiniciarQuiz()">🔁 Jogar Novamente</button>
            <button onclick="irParaPalmeiras()">💚 Ir para o Quiz do Palmeiras</button>
        </div>
    `;
}

// 👉 Nova função para o botão do Palmeiras
function irParaPalmeiras() {
    window.location.href = "/index_palmeiras";
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
