const Matches = ({matches, selectedCountries, toggleCountryView, weatherData}) => {

    if (!matches) {
        return null
    }
    if (matches.length === 0) {
        return <p>No matches found.</p>
    }
    if (matches.length === 1) {
        return (
            <CountryInfo 
                name={matches[0].name.common}
                capital={matches[0].capital}
                area={matches[0].area}
                languages={matches[0].languages}
                flag={matches[0].flags.png}
                weatherData={weatherData}
                onHide={null}
            />
        )
    }
    return (
        <div>
            {matches.map((country) => (
                <div key={country.cca3}>
                    {selectedCountries[country.cca3] ? (
                        <CountryInfo
                            name={country.name.common}
                            capital={country.capital}
                            area={country.area}
                            languages={country.languages}
                            flag={country.flags.png}
                            weatherData={weatherData}
                            onHide={() => toggleCountryView(country)}
                        />
                    ) : (
                        <Country
                            countryInfo={country}
                            onShow={() => toggleCountryView(country)}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}

const Country = ({countryInfo, onShow}) => {
    return (
        <p>
            {countryInfo.name.common} <button onClick={onShow}>show</button>
        </p>
    )
}

const WeatherData = ({data}) => {
    if (!data) {
        return
    }
    const tempCelsius = (data.main.temp - 273.15).toFixed(2)
    const weatherIconCode = data.weather[0].icon
    const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}.png`
    return (
        <div>
            <p> temperature {tempCelsius} Celcius </p>
            <img 
                src={weatherIconUrl} 
                alt={data.weather[0].description} 
                style={{
                    width: "50px", 
                    height: "50px", 
                    verticalAlign: "middle",  // Remove extra space
                    display: "inline-block",  // Ensure it doesn't have extra inline spacing
                    margin: "0"  // Remove any margins
                }} 
            />
            <p> wind {data.wind.speed} m/s </p>
        </div>
    )
}

const CountryInfo = ({name, capital, area, languages, flag, weatherData, onHide}) => {
    return (
        <div>
            <h2>{name} {onHide && <button onClick={onHide}>hide</button>}</h2>
            <p>
                capital {capital}<br/>
                area {area}
            </p>
            <h3>languages:</h3>
            <ul>
                {Object.values(languages).map((lang, index) => (
                    <li key={index}>{lang}</li>
                ))}
            </ul>
            <img src={flag} style={{width: "150px"}} />
            {weatherData && (
                <div>
                    <h3>Weather in {capital}</h3>
                    <WeatherData data={weatherData}/>
                </div>
            )}
        </div>
    )
}

export default Matches