import { useEffect, useState } from "react";
import { CloudSun, CloudRain, Sun, Thermometer, Droplets } from "lucide-react";

type WeatherNow = {
  temperature: number;
  weathercode: number;
  windspeed: number;
  humidity: number;
  description: string;
};

type ForecastDay = {
  date: string;
  max: number;
  min: number;
  code: number;
};

export const WeatherCard = () => {
  const [weather, setWeather] = useState<null | WeatherNow>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);

  const LAT = -10.598523;
  const LON = -55.118888;

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=5&timezone=America%2FCuiaba`
    )
      .then((res) => res.json())
      .then((data) => {
        // Atual
        setWeather({
          temperature: data.current_weather.temperature,
          weathercode: data.current_weather.weathercode,
          windspeed: data.current_weather.windspeed,
          humidity: data.daily?.relative_humidity_2m_max?.[0] ?? 0, // OpenMeteo não retorna umidade atual, só diária
          description: getWeatherInfo(data.current_weather.weathercode).text,
        });

        // Previsão
        const days: ForecastDay[] = [];
        for (let i = 0; i < data.daily.time.length; i++) {
          days.push({
            date: data.daily.time[i],
            max: data.daily.temperature_2m_max[i],
            min: data.daily.temperature_2m_min[i],
            code: data.daily.weathercode[i],
          });
        }
        setForecast(days);
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

  // Função para formatar data (YYYY-MM-DD -> DD/MM)
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col gap-6 max-w-xl mx-auto">
      {/* Atual */}
      <div className="flex items-center justify-between gap-6 flex-col sm:flex-row">
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
              {loading ? "--" : weather?.humidity ?? "--"}%
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
      {/* Previsão 5 dias */}
      <div>
        <div className="font-semibold text-brand-blue mb-2">Próximos 5 dias</div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1 p-2 bg-gray-100 rounded animate-pulse h-24" />
              ))
            : forecast.map((day, i) => (
                <div key={day.date} className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded">
                  <span className="text-xs text-gray-500">{formatDate(day.date)}</span>
                  {getWeatherInfo(day.code).icon}
                  <span className="text-sm font-medium text-brand-blue">{Math.round(day.max)}° / {Math.round(day.min)}°</span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};
