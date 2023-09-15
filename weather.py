import time
import json
import logging
import requests
import datetime

logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s] %(message)s (%(asctime)s)",
    datefmt="%d/%m/%Y %H:%M:%S",
)


def load_config(filename="weather_config.json"):
    try:
        with open(filename, "r") as config_file:
            return json.load(config_file)
    except (FileNotFoundError, JSONDecodeError) as e:
        logging.error(f"Error loading config file '{filename}': {e}")
        return {}


def fetch_weather_data(api_url):
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        return response.json()
    except (requests.RequestException, json.JSONDecodeError) as e:
        logging.error(f"Error fetching weather data: {e}")
        return None


def update_weather_periodically(api_url, update_interval, output_file):
    while True:
        weather_data = fetch_weather_data(api_url)
        if weather_data:
            with open(output_file, "w") as json_file:
                json.dump(weather_data, json_file)
            logging.info(f"Weather data updated and saved to: {output_file}")

        time.sleep(update_interval)


def main():
    config = load_config()

    if not config:
        logging.error("Failed to load configuration.")
        return

    api_url = config.get("API_URL")
    update_interval = config.get("UPDATE_INTERVAL")
    output_file = config.get("OUTPUT_FILE")

    try:
        update_weather_periodically(api_url, update_interval, output_file)
    except KeyboardInterrupt:
        logging.info("Weather update process stopped by user.")


if __name__ == "__main__":
    main()
