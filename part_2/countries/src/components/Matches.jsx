const Matches = ({matches}) => {
    if (!matches) {
        return null
    }
    else if (matches.length === 0) {
        return <p>No matches found.</p>
    }
    else if (matches.length === 1) {
        return (
            <CountryInfo 
                name={matches[0].name.common}
                capital={matches[0].capital}
                area={matches[0].area}
                languages={matches[0].languages}
                flag={matches[0].flags.png}
            />
        )
    }
    else {
        return (
            <p>{matches.map(country => <Country key={country.cca3} name={country.name.common}/>)}</p>
        )
    }
}

const Country = ({name}) => {
    return (
        <p>
            {name}
        </p>
    )
}

const CountryInfo = ({name, capital, area, languages, flag}) => {
    return (
        <div>
            <h2>{name}</h2>
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