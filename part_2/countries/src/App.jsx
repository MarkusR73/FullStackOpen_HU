import { useState, useEffect } from 'react'
import axios from 'axios'
import FilterError from './components/Notifications'
import Matches from './components/Matches'

const App = () => {
  const [nameFilter, setNameFilter] = useState('')
  const [matches, setMatches] = useState(null)
  const [countries, setCountries] = useState(null)
  const [filterErrorMessage, setFilterErrorMessage] = useState(null)

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
  }
  }, [nameFilter], [countries])

  const updateNameFilter = (event) => {
    setNameFilter(event.target.value)
  }

  return (
    <div>
      find countries <input value={nameFilter} onChange={updateNameFilter} />
      <FilterError message={filterErrorMessage}/>
      <Matches matches={matches}/>
    </div>
  )
}

export default App