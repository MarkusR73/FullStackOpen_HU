import { useState, useEffect } from 'react'
import axios from 'axios'
import FilterError from './components/Notifications'
import Matches from './components/Matches'

const App = () => {
  const [nameFilter, setNameFilter] = useState('')
  const [matches, setMatches] = useState(null)
  const [countries, setCountries] = useState(null)
  const [selectedCountries, setSelectedCountries] = useState({})
  const [lastSelectedCountry, setLastSelectedCountry] = useState(null)
  const [weatherDataByCountry, setWeatherDataByCountry] = useState({})
  const [filterErrorMessage, setFilterErrorMessage] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    console.log('Executing API call...')
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          setCountries(response.data)
        })
        .catch(error => {
          console.error('Error fetching countries:', error);
          setFilterErrorMessage('Failed to load country data');
        })
  }, [])

  useEffect(() => {
    if (countries) {
      console.log('Entered filtering effect... ')
      console.log('Filtering with: ', nameFilter)

      const filtered = countries.filter(country => country.name.common.toLowerCase().includes(nameFilter.toLowerCase()))

      console.log('Number of filtered matches: ', filtered.length)

      if (filtered.length > 10) {
        setMatches(null)
        setFilterErrorMessage('Too many matches, specify another filter.')
      }
      else {
        setMatches(filtered)
        setFilterErrorMessage(null)
      }
      if (filtered.length === 1) {
        setLastSelectedCountry(filtered[0]);
      }
    }
  }, [nameFilter, countries])

// Effect to handle weather API calls for the lastSelectedCountry
useEffect(() => {
  console.log("Entered weather API effect...")
  if (lastSelectedCountry && lastSelectedCountry.capitalInfo?.latlng && !weatherDataByCountry[lastSelectedCountry.cca3]) {
    const [lat, lon] = lastSelectedCountry.capitalInfo.latlng;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`

    axios
      .get(weatherApiUrl)
      .then((response) => {
        console.log(`Weather data for ${lastSelectedCountry.name.common}`)
        setWeatherDataByCountry(prevState => ({
          ...prevState,
          [lastSelectedCountry.cca3]: response.data
        }))
      })
      .catch((error) => {
        console.log(`Failed to fetch weather data for ${lastSelectedCountry.name.common}:`, error)
        setWeatherDataByCountry(prevState => ({
          ...prevState,
          [lastSelectedCountry.cca3]: null
        }))
      })
  }
}, [lastSelectedCountry])  

  const updateNameFilter = (event) => {
    setNameFilter(event.target.value)
  }

  const toggleCountryView = (country) => {
    setSelectedCountries((prevState) => ({
      ...prevState,
      [country.cca3]: !prevState[country.cca3],
    }))
     // Set lastSelectedCountry to trigger weather API call only when country info is shown
     if (!selectedCountries[country.cca3]) {
      setLastSelectedCountry(country)
    }
  }

  return (
    <div>
      find countries <input value={nameFilter} onChange={updateNameFilter} />
      <FilterError message={filterErrorMessage}/>
      <Matches 
        matches={matches} 
        selectedCountries={selectedCountries} 
        toggleCountryView={toggleCountryView}
        weatherDataByCountry={weatherDataByCountry} 
      />
    </div>
  )
}

export default App