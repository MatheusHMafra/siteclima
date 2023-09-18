# Dados do clima
Os dados do clima são obtidos através do script weather.py.  
```bash
python weather.py
```
O script weather.py pode ser executado em um intervalo de tempo definido no arquivo weather_config.json, ele está localizado dentro da pasta json.
O arquivo weather_config.json contém os seguintes atributos:
- API_URL: (É usado a API do open-meteo.com)
    URL da API que será utilizada para pegar os dados do clima
- UPDATE_INTERVAL: 
    Intervalo de tempo em milisegundos para executar o script
- OUTPUT_FILE: (Preferivel: server/json/weather_data.json)
    Arquivo onde os dados do clima serão salvos

Exemplo:
```json
{
    "API_URL": "url da api",
    "UPDATE_INTERVAL": 600000,
    "OUTPUT_FILE": "server/json/weather_data.json"
}
```
