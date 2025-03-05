import axios from 'axios'

export const getCountry = async (name) => {
  const response = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
  const countryData = response.data
  return {
    found: true,
    data: {
      name: countryData.name.common,
      capital: countryData.capital[0],
      population: countryData.population,
      flag: countryData.flags.png,
    }
  }
}