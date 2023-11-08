var tempo;
var tempodiario;

var agora = parseInt(converterHorarioAgoraParaValor()); // Hora atual

var fetchJaExecutado = false; // Flag para verificar se a função fetchWeatherData() já foi executada
var eventosAdicionados = false; // Flag para verificar se os eventos já foram adicionados
var data; // Variável para armazenar os dados do tempo

var diaAtual = 0; // Índice do dia atual
var horaAtual = 0; // Índice da hora atual

var diamax; // Índice do dia máximo
var horamax; // Índice da hora máxima

const tempoHoraElement = document.getElementById("container-tempo");
const tempoDiarioElement = document.getElementById("container-tempo-diario");

var templateHora = `
<div id="tempo">
    <h2>{{=it.horario}}</h2>
    <p>Temperatura: {{=it.temperatura}}°C</p>
    <p>Umidade: {{=it.umidade}}%</p>
    <p>Sensação Térmica: {{=it.temperaturaAparente}}°C</p>
    <p>Probabilidade de Precipitação: {{=it.probabilidadePrecipitacao}}%</p>
    <p>Precipitação Total: {{=it.precipitacao}} mm</p>
    <p>Chuva: {{=it.chuva}} mm</p>
    <p>Visibilidade: {{=it.visibilidade}} metros</p>
    <p>Evapotranspiração: {{=it.evapotranspiracao}} mm</p>
    <p>Velocidade do Vento: {{=it.velocidadeVento}} km/h</p>
    <p>Direção do Vento: {{=it.direcaoVento}}°</p>
    <p>Temperatura a 80m: {{=it.temperatura80m}}°C</p>
</div>
<div id="controles">
    <button id="anteriorhora">&lt;</button>
    <button id="proximahora">&gt;</button>
</div>
`;

var templateDiario = `
<div id="tempo-diario">
    <h2>{{=it.dia}}</h2>
    <p>{{=it.weathercodeDiario}}</p>
    <p>Temperatura Mínima Diária: {{=it.temperaturaMinimaDiaria}}°C</p>
    <p>Temperatura Máxima Diária: {{=it.temperaturaMaximaDiaria}}°C</p>
    <p>Sensação Térmica Mínima Diária: {{=it.temperaturaAparenteMinimaDiaria}}°C</p>
    <p>Sensação Térmica Máxima Diária: {{=it.temperaturaAparenteMaximaDiaria}}°C</p>
    <p>Nascer do Sol Diário: {{=it.nascerSolDiario}}</p>
    <p>Pôr do Sol Diário: {{=it.porSolDiario}}</p>
    <p>Precipitação Total Diária: {{=it.precipitacaoTotalDiaria}} mm</p>
    <p>Chuva Total Diária: {{=it.chuvaTotalDiaria}} mm</p>
    <p>Horas de Precipitação Diária: {{=it.horasPrecipitacaoDiaria}} horas</p>
    <p>Probabilidade de Precipitação Máxima Diária: {{=it.probabilidadePrecipitacaoMaximaDiaria}}%</p>
</div>
<div id="controles">
    <button id="anteriordia">&lt;</button>
    <button id="proximodia">&gt;</button>
</div>
`;

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

var xhr = new XMLHttpRequest(); // Cria o pedido HTTP
xhr.open("GET", "server/weather_data.json", true); // Configura o pedido HTTP

// Função para buscar informações do tempo
async function fetchWeatherData() {
    try {
        // Se a função fetchWeatherData() já foi executada, não a execute novamente
        if (!fetchJaExecutado) {
            xhr.send(); // Envia o pedido HTTP
            xhr.onload = function () { // Quando o pedido for carregado
                if (xhr.status >= 200 && xhr.status < 300) { // Se o status for entre 200 e 299
                    // O pedido foi bem-sucedido
                    data = JSON.parse(xhr.responseText); // Armazena o arquivo JSON na variável data
                } else {
                    // Lidar com erros, se necessário
                    console.log("Erro ao carregar o arquivo JSON");
                }
            };
            // Espera o pedido ser carregado
            await new Promise(resolve => setTimeout(resolve, 20));
            horaAtual = converterHorarioAgoraParaValor();
            horamax = data.hourly.time.length - 1;
            diamax = data.daily.time.length - 1;
            fetchJaExecutado = true;
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

        updateWeatherContent(weatherData);
    } catch (error) {
        console.error(`Erro ao buscar dados do tempo: ${error}, ${error.message} `);
    }
}

// Função para atualizar o conteúdo HTML com as informações do tempo, usando o template compilado anteriormente e os dados do tempo como parâmetro para o template
function updateWeatherContent(data) {
    // Função para renderizar o tempo diário
    tempoHoraElement.innerHTML = doT.template(templateHora)(data);
    // Função para renderizar o tempo diário
    tempoDiarioElement.innerHTML = doT.template(templateDiario)(data);
    waitForTemplateElements();
}

// Espera os elementos do Template serem carregados
async function waitForTemplateElements() {
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
};

fetchWeatherData();

document.getElementById("botao").addEventListener("click", function () {
    var latitude = document.getElementById("latitude").value;
    var longitude = document.getElementById("longitude").value;
    document.location.href = "custom.html?latitude=" + latitude + "&longitude=" + longitude;
});