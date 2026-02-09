// <img id="imagem" src="" alt="Imagem de teste">

// const imagem = document.getElementById('imagem');
// imagem.setAttribute('src', 'imagem.jpg'); // Adiciona no src
// imagem.setAttribute('alt', 'Nova descrição'); // Altera o alt

// Isso é para alterar elementos


const apiKey = "9f650b6c027d74bb126935622010f501";

const busca = document.getElementById("buscar");
const buscarbotao = document.getElementById("botao-buscar");

const cidade = document.querySelector("#info-cidade h3");
const dia = document.querySelector("#info-cidade p");

const temperatura = document.querySelector("#temperatura h2");
const tempo = document.querySelector("#tempo h5");

const vento = document.querySelector("#dados-tempo .dados-inferiores:nth-child(1) p");
const umidade = document.querySelector("#dados-tempo .dados-inferiores:nth-child(2) p");

const imagemTempo = document.querySelector("#temperatura img");

const sugestao = document.querySelector("#sugestao-inteligente p");

const diasSemanaEls = document.querySelectorAll("#proximos-dias .dia-semana");
const tempEls = document.querySelectorAll("#proximos-dias .proxima-temp");
const iconeEls = document.querySelectorAll("#proximos-dias .icone-dia");



async function buscarClima(cidade){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&lang=pt_br`;

    const resposta = await fetch(url);

    if(!resposta.ok){
        alert("Cidade não encontrada!");
        return;
    }

    const dados = await resposta.json();

    atualizarTela(dados);

}

function atualizarTela (dados) {
    cidade.textContent = dados.name;

    const tempC = (dados.main.temp - 273.15).toFixed(1);
    temperatura.textContent = `${tempC}°C`;

    tempo.textContent = dados.weather[0].description; // salva a descrição

    const ventoKm = (dados.wind.speed * 3.6).toFixed(1);
    vento.textContent = `${ventoKm} km/h`;
    umidade.textContent = `${dados.main.humidity}%`;

    const descricao = dados.weather[0].description;
    tempo.textContent = descricao;

    aplicarTemaHorario();
    aplicarTemaClima(descricao);

    sugestaoInteligente(descricao, Number(tempC));

    atualizarIconeClima(descricao);

    dia.textContent = formatarData();

}

buscarbotao.addEventListener(("click"), () => {
    const cidadeBuscada = busca.value.trim();

    buscarClima(cidadeBuscada);
    buscarProximosDias(cidadeBuscada);
});

function formatarData () {
    const hoje = new Date();

    const diasSemana = [
        "domingo",
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado"
    ];
    const meses = [
        "jan.", "fev.", 
        "mar.", "abr.", "mai.", 
        "jun.", "jul.", "ago.", 
        "set.", "out.", "nov.", "dez."];

    const diaSemana = diasSemana[hoje.getDay()];
    const diaMes = hoje.getDate();
    const mes = meses[hoje.getMonth()];

    return `${diaSemana}, ${diaMes} ${mes}`;
}

function aplicarTemaHorario () {
    const hora = new Date().getHours();

    document.body.classList.remove("tema-dia", "tema-noite");

    if (hora >= 18 || hora < 6){
        document.body.classList.add("tema-noite");
    } else {
        document.body.classList.add("tema-dia");
    }
}
function aplicarTemaClima (descricao) {
    document.body.classList.remove("tema-sol", "tema-chuva", "tema-nublado");

    if (descricao.includes("chuva") || descricao.includes("garoa")) {
        document.body.classList.add("tema-chuva");

    } else if (
        descricao.includes("céu limpo") ||
        descricao.includes("limpo") ||
        descricao.includes("poucas nuvens") ||
        descricao.includes("nuvens dispersas")
    ) {
        document.body.classList.add("tema-sol");

    } else if (
        descricao.includes("nublado") ||
        descricao.includes("nuvens")
    ) {
        document.body.classList.add("tema-nublado");
    }
}

function sugestaoInteligente (descricao, temperatura) {
    descricao = descricao.toLowerCase();

    if (descricao.includes("chuva") || descricao.includes("garoa")) {
        sugestao.textContent = "Leve um guarda-chuva!";

    } else if (temperatura >= 28 && descricao.includes("limpo")) {
        sugestao.textContent = "Dia quente! Hidrate-se bem.";

    } else if (temperatura >= 22 && temperatura <= 27 && descricao.includes("limpo") || descricao.includes("nuvens dispersas")) {
        sugestao.textContent = "Ótimo dia para uma caminhada!";

    } else if (descricao.includes("nublado")) {
        sugestao.textContent = "Clima tranquilo para atividades leves.";

    } else {
        sugestao.textContent = "Que tal um filme ou uma série hoje?";
    }
}

function atualizarIconeClima(descricao) {
    descricao = descricao.toLowerCase();

    if (descricao.includes("chuva") || descricao.includes("garoa")) {
        imagemTempo.src = "src/chuva.png";

    } else if (descricao.includes("trovoada") || descricao.includes ("raios") || descricao.includes("trovoes")) {
        imagemTempo.src = "src/trovoada.png";

    } else if (descricao.includes("céu limpo") || descricao.includes("limpo")) {
        imagemTempo.src = "src/ensolarado.png";

    } else if (descricao.includes("nublado") || descricao.includes("nuvens")) {
        imagemTempo.src = "src/nublado.png";

    } else {
        imagemTempo.src = "src/nublado.png";
    }
}

function buscarProximosDias(cidade) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`)
        .then(res => res.json())
        .then(data => {

            const dias = [
                data.list[8],
                data.list[16],
                data.list[24]
            ];

            dias.forEach((dia, i) => {
                const dataDia = new Date(dia.dt * 1000);

                diasSemanaEls[i].textContent =
                    dataDia.toLocaleDateString("pt-BR", { weekday: "short" });

                tempEls[i].textContent =
                    Math.round(dia.main.temp) + "°C";

                iconeEls[i].src =
                    escolherIcone(dia.weather[0].main);
            });
        });
}

function escolherIcone(main) {
    if (main === "Rain" || main === "Drizzle") {
        return "src/chuva.png";
    }
    if (main === "Thunderstorm") {
        return "src/trovoada.png";
    }
    if (main === "Clear") {
        return "src/ensolarado.png";
    }
    if (main === "Clouds") {
        return "src/nublado.png";
    }
    return "src/nublado.png";
}




// fetch(url)
//   .then((response) => {
//     if (!response.ok) throw new Error("Erro ao buscar dados");
//     return response.json();
//   })
//   .then((data) => {
//     console.log(`A temperatura em ${data.name} é de ${data.main.temp}°C`);
//   })
//   .catch((error) => console.error("Erro:", error));