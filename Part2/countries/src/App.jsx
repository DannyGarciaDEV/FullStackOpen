import React, { useState, useEffect } from 'react';

const CountryInfo = ({ country, weather, onFetchWeather }) => {
  return (
    <div>
      <img src={country.flags.png} alt={`${country.name.common} flag`} />
      <p><strong>Capital:</strong> {country.capital}</p>
      <p><strong>Area:</strong> {country.area} square kilometers</p>
      <p><strong>Languages:</strong> {Object.values(country.languages).join(', ')}</p>
      <p><strong>Population:</strong> {country.population}</p>
      <p><strong>Region:</strong> {country.region}</p>

      {/* Accessing currencies dynamically */}
      {country.currencies && Object.keys(country.currencies).map(currencyCode => (
        <p key={currencyCode}>
          <strong>Currency:</strong> {country.currencies[currencyCode].name} ({country.currencies[currencyCode].symbol})
        </p>
      ))}

      {weather ? (
        <div>
          <h2>Weather in {country.capital}</h2>
          <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
          <p><strong>Weather:</strong> {weather.weather[0].description}</p>
          {weather.weather[0].icon && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather Icon"
            />
          )}
        </div>
      ) : (
        <button onClick={() => onFetchWeather(country.capital)}>Fetch Weather</button>
      )}
    </div>
  );
};
const CountryList = ({ countries, onShowDetails }) => {
  return (
    <ul>
      {countries.map(country => (
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={() => onShowDetails(country)}>Show</button>
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);

  const searchCountries = async () => {
    setLoading(true);
    setError(null);

    const apiUrl = `https://restcountries.com/v3.1/name/${searchQuery}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch country data');
      }

      const countriesData = await response.json();

      if (countriesData.length > 10) {
        setError('Too many matches. Please make your query more specific.');
        setCountries([]);
        setSelectedCountry(null);
      } else {
        setCountries(countriesData);
        setSelectedCountry(null);
      }
    } catch (error) {
      setError('Error fetching country data. Please try again.');
      console.error('Error fetching country data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (capital) => {
    const apiKey = import.meta.env.VITE_REACT_APP_OPENWEATHERMAP_API_KEY;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(weatherApiUrl);
  
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
  
      const weatherData = await response.json();
      setWeather(weatherData);
    } catch (error) {
      setError('Error fetching weather data. Please try again.');
      console.error('Error fetching weather data:', error);
    }
  };

  const showDetails = (country) => {
    setSelectedCountry(country);
    setWeather(null); // Reset weather when a new country is selected
  };

  return (
    <div>
      <h1>Country Information</h1>
      <label htmlFor="search-input">Search Country:</label>
      <input
        type="text"
        id="search-input"
        placeholder="Type country name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={searchCountries}>Search</button>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {countries.length > 0 && !selectedCountry && (
        <CountryList countries={countries} onShowDetails={showDetails} />
      )}

      {selectedCountry && (
        <CountryInfo country={selectedCountry} weather={weather} onFetchWeather={fetchWeather} />
      )}
    </div>
  );
};

export default App;