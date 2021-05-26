import './App.css';
import { useState, useEffect } from 'react';
import { servicePiData, serviceWeather } from '../../services/services';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const OneWeekForecast = props => {
  return (
    <div>
      <div>7-Day Forecast {props.label}</div>
      <ul>
        {props.forecast.map((item, index) => {
          const itemDate = new Date(item.dt*1000);
            return (
              <li key={index}>Date: {itemDate.toLocaleDateString()} Min: {parseFloat(item.temp.min).toFixed(1)}°C Max: {parseFloat(item.temp.max).toFixed(1)}°C</li>
            );
        })}
      </ul>
    </div>
  );
}

function App() {
  // State variables needed for OpenWeatherMap and Google Places Autocomplete APIs
  const [location, setLocation] = useState('');
  const [label, setLabel] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [forecast, setForecast] = useState([]);
  const [cityForecast, setCityForecast] = useState([]);
  const [citySearch, setCitySearch] = useState(false);

  // State variables needed for Thingspeak API
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  
  // State variables for time and date
  const [today, setDate] = useState(new Date());
  const locale = 'en-PH';

  // FOR TIME DISPLAY
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer); 
    }
  }, []);

  // FOR RASPBERRY PI API
  useEffect(() => {
    const getPiData = async () => {
      const jsonData = await servicePiData();
      setTemperature(parseFloat(jsonData.feeds[0].field1).toFixed(1));
      setHumidity(parseFloat(jsonData.feeds[0].field2).toFixed(1));
    }
    getPiData()
    const measurement = setInterval(getPiData, 300*1000);
    return () => {
      clearInterval(measurement); 
    }
  }, []);

  // FOR MY LOCAL FORECAST
  useEffect(() => {
    const getForecast = async () => {
      const jsonForecast = await serviceWeather("14.5585549", "121.1360819");
      setForecast(jsonForecast.daily.slice(1));
    }
    getForecast();
  }, [])

  // FOR CITY FORECAST
  const getCityForecast = async () => {
    const jsonCityForecast = await serviceWeather(latitude, longitude);
    setCityForecast(jsonCityForecast.daily.slice(1));
  }

  const handleChange = address => {
    setLocation(address);
  };
 
  const handleSelect = address => {
    setLocation(address);
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setLatitude(lat);
        setLongitude(lng);
      })
      .catch(error => console.error('Error', error));
  };

  const search = () => {
    if (location === '') {
      setLabel('')
      setCitySearch(false)
      return;
    }
    setLabel(`for ${location}`)
    setCitySearch(true)
    getCityForecast();
  }

  const day = today.toLocaleDateString(locale, { weekday: 'long' });
  const month = today.toLocaleDateString(locale, { month: 'long' });
  const year = today.toLocaleDateString(locale, { year: 'numeric' });
  const date = `${day}, ${today.getDate()} ${month} ${year}\n\n`;
  const hour = today.getHours();
  const greeting = `Good ${(hour < 12 && 'Morning') || (hour < 18 && 'Afternoon') || 'Evening'}`;
  const time = today.toLocaleTimeString(locale, { hour: 'numeric', hour12: true, minute: 'numeric' });

  const searchOptions = {
    types: ['(cities)']
  }

  let results;
  
  if (citySearch) {
    // if (location === '') {
    //   results = <div/>;
    //   setCitySearch(false);
    // } else {
    //   results = <OneWeekForecast forecast={cityForecast} label={label}/>
    // }
    results = <OneWeekForecast forecast={cityForecast} label={label}/>
  } else {
    results = <div/>;
  }

  return (
    <div>
      <div>{greeting}!</div>
      <div>Today is {date} and the time is {time}</div>
      <div>Temperature: {temperature}°C</div>
      <div>Humidity: {humidity}%</div>
      <OneWeekForecast forecast={forecast} label="in My Area"/>
      <div>
        <label>Check your city's forecast: </label>
        <PlacesAutocomplete
          value={location}
          onChange={handleChange}
          onSelect={handleSelect}
          searchOptions={searchOptions}>
          {
            ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: 'Enter a location',
                    className: 'location-search-input'
                  })} /> <button onClick={search}>Search</button>
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map(suggestion => {
                    const className = suggestion.active
                      ? 'suggestion-item--active'
                      : 'suggestion-item';
                    const style = suggestion.active
                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                      : { backgroundColor: '#ffffff', cursor: 'pointer' };
                    return (
                      <div key={suggestion.placeId}
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}>
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          }
        </PlacesAutocomplete>
      </div>
      <div>{results}</div>
    </div>
  );
}

export default App;
