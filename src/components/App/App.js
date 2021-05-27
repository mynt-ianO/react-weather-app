import './App.css';
import 'antd/dist/antd.css';

import { useState, useEffect } from 'react';

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Input } from 'antd';

import { servicePiData, serviceWeather } from '../../services/services';
import { OneWeekForecast } from './OneWeekForecast';
import { GreetingTime } from './GreetingTime';
import { RPiData } from './RPiData';
import { SectionLabel } from './SectionLabel';
import { AutocompleteDropdown } from './AutocompleteDropdown'

function App() {
  // State variables needed for OpenWeatherMap and Google Places Autocomplete APIs
  const [location, setLocation] = useState('');
  const [label, setLabel] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [forecast, setForecast] = useState([]);
  const [cityForecast, setCityForecast] = useState([]);
  const [citySearch, setCitySearch] = useState(false);
  const [localCondition, setLocalCondition] = useState('');

  // State variables needed for Thingspeak API
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  
  // State variables for time and date
  const [today, setDate] = useState(new Date());
  const locale = 'en-PH';

  const { Search } = Input;

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
    getPiData();
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
      setLocalCondition(jsonForecast.current.weather[0].main);
    }
    getForecast();
    const localForecast = setInterval(getForecast, 300*1000);
    return () => {
      clearInterval(localForecast); 
    }
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
  const date = `${day}, ${today.getDate()} ${month} ${year}`;
  const hour = today.getHours();
  const greeting = `Good ${(hour < 12 && 'Morning') || (hour < 18 && 'Afternoon') || 'Evening'}`;
  const time = today.toLocaleTimeString(locale, { hour: 'numeric', hour12: true, minute: 'numeric' }).toUpperCase();

  const searchOptions = {
    types: ['(cities)']
  }

  let results;
  
  if (citySearch) {
    results = <OneWeekForecast forecast={cityForecast} label={label} locale={locale}/>
  } else {
    results = <div/>;
  }

  let backgroundUrl = '';

  if (localCondition === 'Thunderstorm') {
    backgroundUrl = 'url(/img/thunderstorm.gif)';
  } else if (localCondition === 'Drizzle') {
    backgroundUrl = 'url(/img/drizzle.gif)';
  } else if (localCondition === 'Rain') {
    backgroundUrl = 'url(/img/rain.gif)';
  } else if (localCondition === 'Clear') {
    if (hour > 6 && hour < 18) {
      backgroundUrl = 'url(/img/clear.gif)';
    }
    backgroundUrl = 'url(/img/clear_night.gif)'; 
  } else if (localCondition === 'Clouds') {
    if (hour > 6 && hour < 18) {
      backgroundUrl = 'url(/img/clouds.gif)';
    }
    backgroundUrl = 'url(/img/clouds_night.gif)'; 
  } else {
    backgroundUrl = 'none';
  }

  return (
    <div 
      className='root-child'
      style={{ backgroundImage: `${backgroundUrl}`, backgroundSize: 'cover' }}>
      
      <GreetingTime greeting={greeting} date={date} time={time} />
      <RPiData temperature={temperature} humidity={humidity} />
      <OneWeekForecast forecast={forecast} label="in My Area" locale={locale}/>
      
      <div className='autocomplete-section'>
        <SectionLabel label="Check your city's forecast" />
        <div className='autocomplete-search'>
          <PlacesAutocomplete
            value={location}
            onChange={handleChange}
            onSelect={handleSelect}
            searchOptions={searchOptions}>
            {
              ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <Search
                    {...getInputProps({
                      placeholder: 'Enter a location',
                      className: 'location-search-input'
                    })}
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={search}
                    style={{ width: 500 }}/> 

                  <AutocompleteDropdown 
                    loading={loading} 
                    suggestions={suggestions}
                    getSuggestionItemProps={getSuggestionItemProps}/>
                </div>
              )
            }
          </PlacesAutocomplete>
        </div>
      </div>
      <div>{results}</div>
    </div>
  );
}

export default App;
