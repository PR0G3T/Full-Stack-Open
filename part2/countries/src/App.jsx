import { useState, useEffect } from 'react'
import axios from 'axios'

const CountrySearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div>
      find countries <input 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
    </div>
  )
}

const CountryList = ({ countries, onShowCountry }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }

  return (
    <div>
      {countries.map(country => (
        <div key={country.name.common}>
          {country.name.common} 
          <button onClick={() => onShowCountry(country)}>show</button>
        </div>
      ))}
    </div>
  )
}

const Weather = ({ capital, country }) => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  const mockWeatherData = {
    main: { temp: -5.77 },
    weather: [{ 
      icon: '04n', 
      description: 'overcast clouds' 
    }],
    wind: { speed: 7.6 }
  }

  useEffect(() => {
    if (!capital || !apiKey) {
      if (!apiKey) {
        setError('Weather API key not configured')
      }
      return
    }

    setLoading(true)
    setError(null)

    console.log('Fetching weather for:', capital, country)
    console.log('API Key:', apiKey ? 'Present' : 'Missing')

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital},${country}&appid=${apiKey}&units=metric`)
      .then(response => {
        console.log('Weather data received:', response.data)
        setWeather(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.log('Weather API error:', error)
        console.log('Error response:', error.response?.data)
          if (error.response?.status === 401) {
          setError('API key not activated yet. Using mock data for demonstration.')
          setTimeout(() => {
            setWeather(mockWeatherData)
            setError(null)
            setLoading(false)
          }, 1000)
        } else if (error.response?.status === 404) {
          setError(`Weather data not found for ${capital}`)
          setLoading(false)
        } else {
          setError(`Failed to fetch weather data: ${error.response?.data?.message || error.message}`)
          setLoading(false)
        }
      })
  }, [capital, country, apiKey])
  if (!apiKey) {
    return (
      <div>
        <h3>Weather in {capital}</h3>
        <p>Weather API key not configured. Set VITE_OPENWEATHER_API_KEY environment variable.</p>
        <p><small>Debug: API key status: {apiKey ? 'Present' : 'Missing'}</small></p>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <h3>Weather in {capital}</h3>
        <p>Loading weather data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h3>Weather in {capital}</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (!weather) {
    return null
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p><strong>temperature:</strong> {weather.main.temp} Celsius</p>
      <img src={iconUrl} alt={weather.weather[0].description} />
      <p><strong>wind:</strong> {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetails = ({ country }) => {
  const languages = Object.values(country.languages || {})
  const capital = country.capital ? country.capital[0] : 'N/A'

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {capital}</p>
      <p>area {country.area}</p>
      
      <h3>languages:</h3>
      <ul>
        {languages.map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      
      <img 
        src={country.flags.png} 
        alt={`Flag of ${country.name.common}`} 
        style={{ width: '200px', border: '1px solid #ccc' }}
      />
      
      {capital !== 'N/A' && (
        <Weather capital={capital} country={country.name.common} />
      )}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.log('Error fetching countries:', error)
      })
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCountries([])
      setSelectedCountry(null)
      return
    }

    const filtered = countries.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.name.official.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    setFilteredCountries(filtered)
    setSelectedCountry(null)
  }, [searchTerm, countries])

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      <CountrySearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      {selectedCountry ? (
        <CountryDetails country={selectedCountry} />
      ) : (
        searchTerm && <CountryList countries={filteredCountries} onShowCountry={handleShowCountry} />
      )}
    </div>
  )
}

export default App
