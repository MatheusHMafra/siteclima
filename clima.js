var tempo;
var tempodiario;

var agora = parseInt(converterHorarioAgoraParaValor()); // Hora atual

var fetchJaExecutado = false; // Flag para verificar se a função fetchWeatherData() já foi executada
var data; // Variável para armazenar os dados do tempo

var diaAtual = 0; // Índice do dia atual
var horaAtual = 0; // Índice da hora atual

var diamax; // Índice do dia máximo
var horamax; // Índice da hora máxima

const tempoElement = document.getElementById("tempo");
const tempodiarioElement = document.getElementById("tempo-diario");

// Função para obter a descrição do tempo com base no código
function getWeatherDescription(code) {
    var weatherCodeMapping = {
        0: "Céu Limpo",
        1: "Principalmente Limpo",
        2: "Parcialmente Nublado",
        3: "Céu Encoberto",
        45: "Nevoeiro e Neve em Formação",
        48: "Nevoeiro",
        51: "Chuvisco: Leve",
        53: "Chuvisco: Moderado",
        55: "Chuvisco: Intenso",
        56: "Chuvisco Congelante: Leve",
        57: "Chuvisco Congelante: Intenso",
        61: "Chuva: Fraca",
        63: "Chuva: Moderada",
        65: "Chuva: Forte",
        66: "Chuva Congelante: Leve",
        67: "Chuva Congelante: Forte",
        71: "Neve: Fraca",
        73: "Neve: Moderada",
        75: "Neve: Forte",
        77: "Grãos de Neve",
        80: "Chuvas: Leves",
        81: "Chuvas: Moderadas",
        82: "Chuvas: Fortes",
        85: "Poucas Neves: Leves",
        86: "Poucas Neves: Fortes"
    };
    return weatherCodeMapping[code] || "Descrição não disponível";
}

function converterTimestampParaHora(timestamp) {
    var data = new Date(timestamp * 1000); // Multiplicado por 1000 para converter para milissegundos
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();
    return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + "h";
}

function converterTimestampParaDia(timestamp) {
    // Transformar o milisegundos em timestamp
    var data = new Date(timestamp * 1000);
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();

    // Formatar a data para o padrão dd/mm/aaaa
    return dia + "/" + mes + "/" + ano;
}

function converterHorarioAgoraParaValor() {
    var data = new Date();
    var hora = data.getHours();
    var valor = hora - 0;
    return valor.toString();
}

// Função para buscar informações do tempo
async function fetchWeatherData() {
    try {
        // Se a função fetchWeatherData() já foi executada, não a execute novamente
        if (!fetchJaExecutado) {
            const response = await fetch("weather_data.json");
            data = await response.json();
            horaAtual = converterHorarioAgoraParaValor();
            horamax = data.hourly.time.length - 1;
            diamax = data.daily.time.length - 1;
        }

        const weatherData = {
            horario: converterTimestampParaHora(data.hourly.time[horaAtual]),
            temperatura: data.hourly.temperature_2m[horaAtual],
            umidade: data.hourly.relativehumidity_2m[horaAtual],
            temperaturaAparente: data.hourly.apparent_temperature[horaAtual],
            probabilidadePrecipitacao: data.hourly.precipitation_probability[horaAtual],
            precipitacao: data.hourly.precipitation[horaAtual],
            chuva: data.hourly.rain[horaAtual],
            visibilidade: data.hourly.visibility[horaAtual],
            evapotranspiracao: data.hourly.evapotranspiration[horaAtual],
            velocidadeVento: data.hourly.windspeed_80m[horaAtual],
            direcaoVento: data.hourly.winddirection_80m[horaAtual],
            temperatura80m: data.hourly.temperature_80m[horaAtual],
            dia: converterTimestampParaDia(data.daily.time[diaAtual]),
            weathercodeDiario: getWeatherDescription(data.daily.weathercode[diaAtual]),
            temperaturaMinimaDiaria: data.daily.temperature_2m_min[diaAtual],
            temperaturaMaximaDiaria: data.daily.temperature_2m_max[diaAtual],
            temperaturaAparenteMinimaDiaria: data.daily.apparent_temperature_min[diaAtual],
            temperaturaAparenteMaximaDiaria: data.daily.apparent_temperature_max[diaAtual],
            nascerSolDiario: converterTimestampParaHora(data.daily.sunrise[diaAtual]),
            porSolDiario: converterTimestampParaHora(data.daily.sunset[diaAtual]),
            precipitacaoTotalDiaria: data.daily.precipitation_sum[diaAtual],
            chuvaTotalDiaria: data.daily.rain_sum[diaAtual],
            horasPrecipitacaoDiaria: data.daily.precipitation_hours[diaAtual],
            probabilidadePrecipitacaoMaximaDiaria: data.daily.precipitation_probability_max[diaAtual]
        };

        fetchJaExecutado = true;

        updateWeatherContent(weatherData);
    } catch (error) {
        console.error(`Erro ao buscar dados do tempo: ${error}, ${error.message}`);
    }
}

// Função para atualizar o conteúdo HTML com as informações do tempo
function updateWeatherContent(data) {
    tempo = `
    <h2>Clima de Itajaí ${data.horario}</h2>
    <p>Temperatura: ${data.temperatura}°C</p>
    <p>Umidade: ${data.umidade}%</p>
    <p>Sensação Térmica: ${data.temperaturaAparente}°C</p>
    <p>Probabilidade de Precipitação: ${data.probabilidadePrecipitacao}%</p>
    <p>Precipitação Total: ${data.precipitacao} mm</p>
    <p>Chuva: ${data.chuva} mm</p>
    <p>Visibilidade: ${data.visibilidade} metros</p>
    <p>Evapotranspiração: ${data.evapotranspiracao} mm</p>
    <p>Velocidade do Vento: ${data.velocidadeVento} km/h</p>
    <p>Direção do Vento: ${data.direcaoVento}°</p>
    <p>Temperatura a 80m: ${data.temperatura80m}°C</p>
    `;

    tempodiario = `
    <h2>Clima de Itajaí ${data.dia}</h2>
    <p>${data.weathercodeDiario}</p>
    <p>Temperatura Mínima Diária: ${data.temperaturaMinimaDiaria}°C</p>
    <p>Temperatura Máxima Diária: ${data.temperaturaMaximaDiaria}°C</p>
    <p>Sensação Térmica Mínima Diária: ${data.temperaturaAparenteMinimaDiaria}°C</p>
    <p>Sensação Térmica Máxima Diária: ${data.temperaturaAparenteMaximaDiaria}°C</p>
    <p>Nascer do Sol Diário: ${data.nascerSolDiario}</p>
    <p>Pôr do Sol Diário: ${data.porSolDiario}</p>
    <p>Precipitação Total Diária: ${data.precipitacaoTotalDiaria} mm</p>
    <p>Chuva Total Diária: ${data.chuvaTotalDiaria} mm</p>
    <p>Horas de Precipitação Diária: ${data.horasPrecipitacaoDiaria} horas</p>
    <p>Probabilidade de Precipitação Máxima Diária: ${data.probabilidadePrecipitacaoMaximaDiaria}%</p>
    `;

    tempoElement.innerHTML = tempo;
    tempodiarioElement.innerHTML = tempodiario;
}

fetchWeatherData();

// Eventos para os botões de navegação do tempo horário
document.getElementById("anteriorhora").addEventListener("click", function () {
    var textoCompleto = document.querySelector("#tempo h2").textContent.trim();
    var regexHorario = /\d{1,2}:\d{2}/; // Expressão regular para encontrar horários no formato HH:mm
    var horario = textoCompleto.match(regexHorario);
    if (horario) {
        horario = horario[0]; // Pega o primeiro horário encontrado
        if (horario == "00:00" && diaAtual > 0) {
            diaAtual--;
        }
    }
    if (horaAtual > 0) {
        horaAtual--;
    }
    fetchWeatherData();
});

document.getElementById("proximahora").addEventListener("click", function () {
    var textoCompleto = document.querySelector("#tempo h2").textContent.trim();
    var regexHorario = /\d{1,2}:\d{2}/; // Expressão regular para encontrar horários no formato HH:mm
    var horario = textoCompleto.match(regexHorario);

    if (horario) {
        horario = horario[0]; // Pega o primeiro horário encontrado
        if (horario == "23:00" && diaAtual < diamax) {
            diaAtual++;
        }
    }
    if (horaAtual < horamax) {
        horaAtual++;
    }
    fetchWeatherData();
});

// Eventos para os botões de navegação do tempo diário
document.getElementById("anteriordia").addEventListener("click", function () {
    if (diaAtual > 0) {
        diaAtual--;
    }
    horaAtual = (diaAtual * 24) + agora;
    fetchWeatherData();
});

document.getElementById("proximodia").addEventListener("click", function () {
    if (diaAtual < diamax) {
        diaAtual++;
    }
    horaAtual = (diaAtual * 24) + agora;
    fetchWeatherData();
});