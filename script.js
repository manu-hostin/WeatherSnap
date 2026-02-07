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

async function buscarClima(cidade, estadp){
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

    dia.textContent = formatarData();

}

buscarbotao.addEventListener(("click"), () => {
    const cidadeBuscada = busca.value.trim();

    buscarClima(cidadeBuscada);

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





// fetch(url)
//   .then((response) => {
//     if (!response.ok) throw new Error("Erro ao buscar dados");
//     return response.json();
//   })
//   .then((data) => {
//     console.log(`A temperatura em ${data.name} é de ${data.main.temp}°C`);
//   })
//   .catch((error) => console.error("Erro:", error));