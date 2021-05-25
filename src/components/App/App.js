import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [forecast, setForecast] = useState([])
  const [today, setDate] = useState(new Date())
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);
  const locale = 'en';

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer); 
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const dataResponse = await fetch('https://api.thingspeak.com/channels/1254631/feeds.json?api_key=API_KEY&results=1');
        const jsonData = await dataResponse.json()
        setTemp(parseFloat(jsonData.feeds[0].field1).toFixed(1))
        setHum(parseFloat(jsonData.feeds[0].field2).toFixed(1))
      } catch (error) {
        console.log(error)
      }
    }
    getData()
    const measurement = setInterval(getData, 300*1000);
    return () => {
      clearInterval(measurement); 
    }
  }, []);

  useEffect(() => {
    const getForecast = async () => {
      try {
        const forecastResponse = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat=14.5678&lon=121.1394&exclude=minutely,hourly,alerts&appid=API_KEY');
        const jsonForecast = await forecastResponse.json();
        setForecast(jsonForecast.daily);
      } catch (error) {
        console.log(error);
      }
    }
    getForecast();
  }, [])

  const day = today.toLocaleDateString(locale, { weekday: 'long' });
  const month = today.toLocaleDateString(locale, { month: 'long' });
  const year = today.toLocaleDateString(locale, { year: 'numeric' });
  const date = `${day}, ${today.getDate()} ${month} ${year}\n\n`;
  const hour = today.getHours();
  const greeting = `Good ${(hour < 12 && 'Morning') || (hour < 18 && 'Afternoon') || 'Evening'}`;
  const time = today.toLocaleTimeString(locale, { hour: 'numeric', hour12: true, minute: 'numeric' });

  const forecastArray = forecast.slice(1);

  return (
    <div>
      <div>{greeting}!</div>
      <div>Today is {date} and the time is {time}</div>
      <div>Temperature: {temp}°C</div>
      <div>Humidity: {hum}%</div>
      <div>
        <div>7-Day Forecast</div>
        <ul>
          {forecastArray.map((item, index) => {
            const itemDate = new Date(item.dt*1000);
            return (
              <li key={index}>Date: {itemDate.toLocaleDateString()} Min: {(parseFloat(item.temp.min)/10).toFixed(1)}°C Max: {(parseFloat(item.temp.max)/10).toFixed(1)}°C</li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
