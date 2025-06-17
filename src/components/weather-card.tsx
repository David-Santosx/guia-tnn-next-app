import { useEffect, useState } from "react";
import { CloudSun, CloudRain, Sun, Thermometer, Droplets } from "lucide-react";

export const WeatherCard = () => {
  const [weather, setWeather] = useState<null | {
    temperature: number;
    weathercode: number;
    windspeed: number;
    humidity: number;
    description: string;
  }>(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = "1e5027a9549d4f4183e222142251706";
  const LAT = -10.6185;
  const LON = -55.2317;

  useEffect(() => {
    fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${LAT},${LON}&lang=pt`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather({
          temperature: data.current.temp_c,
          weathercode: data.current.condition.code,
          windspeed: data.current.wind_kph,
          humidity: data.current.humidity,
          description: data.current.condition.text,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // Função para traduzir o código do tempo em ícone e texto
  const getWeatherInfo = (code: number) => {
    if ([0, 1].includes(code)) return { icon: <Sun className="w-7 h-7 text-yellow-400" />, text: "Ensolarado" };
    if ([2, 3].includes(code)) return { icon: <CloudSun className="w-7 h-7 text-blue-400" />, text: "Parcialmente nublado" };
    if ([45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
      return { icon: <CloudRain className="w-7 h-7 text-blue-600" />, text: "Chuva" };
    return { icon: <CloudSun className="w-7 h-7 text-gray-400" />, text: "Nublado" };
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-xl mx-auto">
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        ) : (
          weather && getWeatherInfo(weather.weathercode).icon
        )}
        <div>
          <div className="text-lg font-semibold text-brand-blue">
            {loading
              ? "Carregando previsão..."
              : weather && getWeatherInfo(weather.weathercode).text}
          </div>
          <div className="text-gray-500 text-sm">Terra Nova do Norte, MT</div>
        </div>
      </div>
      <div className="flex gap-6 items-center">
        <div className="flex items-center gap-1">
          <Thermometer className="w-4 h-4 text-brand-orange" />
          <span className="font-medium">
            {loading ? "--" : Math.round(weather?.temperature ?? 0)}°C
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Droplets className="w-4 h-4 text-blue-400" />
          <span className="font-medium">
            {loading ? "--" : weather?.humidity}%
          </span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M17.7 17.7a8 8 0 1 1 0-11.3M12 2v2m0 16v2m10-10h-2M4 12H2" />
          </svg>
          <span className="font-medium">
            {loading ? "--" : weather?.windspeed} km/h
          </span>
        </div>
      </div>
    </div>
  );
};