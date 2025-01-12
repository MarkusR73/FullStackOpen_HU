import {useState} from "react"

const Matches = ({matches, selectedCountries, toggleCountryView}) => {

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

const CountryInfo = ({name, capital, area, languages, flag, onHide}) => {
    return (
        <div>
            <h2>{name} {onHide && <button onClick={onHide}>hide</button>}</h2>
            <p>
                capital {capital}<br/>
                area {area}
            </p>
            <h3>languages:</h3>
            <ul>
                {Object.values(languages).map((lang) => (
                    <li>{lang}</li>
                ))}
            </ul>
            <img src={flag} style={{width: "150px"}} />
        </div>
    )
}

export default Matches