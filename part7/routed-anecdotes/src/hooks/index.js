import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (name === '') {
      setCountry(null)
      return
    }

    const fetchCountry = async () => {
      try {
        const response = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        setCountry({ found: true, data: response.data })
      } catch (error) {
        setCountry({ found: false })
      }
    }

    fetchCountry()
  }, [name])

  return country
}

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(baseUrl)
        setResources(response.data)
      } catch (error) {
        console.error('Error fetching resources:', error)
      }
    }

    fetchResources()
  }, [baseUrl])

  const service = {
    create: async (resource) => {
      try {
        const response = await axios.post(baseUrl, resource)
        setResources(resources.concat(response.data))
        return response.data
      } catch (error) {
        console.error('Error creating resource:', error)
        throw error
      }
    }
  }

  return [resources, service]
}
