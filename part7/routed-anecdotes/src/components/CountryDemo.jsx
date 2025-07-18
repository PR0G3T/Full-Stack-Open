import { useState } from 'react'
import { useCountry } from '../hooks'

const CountryDemo = () => {
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(e.target.country.value)
  }

  return (
    <div>
      <h2>Country Hook Demo (Exercise 7.7)</h2>
      <form onSubmit={fetch}>
        <input name="country" />
        <button>find</button>
      </form>

      {country && country.found ? (
        <div>
          <h3>{country.data.name.common}</h3>
          <div>capital {country.data.capital?.[0]}</div>
          <div>population {country.data.population}</div>
          <img 
            src={country.data.flags.png} 
            height='100' 
            alt={`flag of ${country.data.name.common}`}
          />
        </div>
      ) : country === null ? (
        <div></div>
      ) : (
        <div>not found...</div>
      )}
    </div>
  )
}

export default CountryDemo
