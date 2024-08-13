// useFetchCityDistrict.js
import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { CHECKOUT_CITY_GET, CHECKOUT_DISTRICT_GET } from '@/configs/api-path'

const useFetchCityDistrict = () => {
  const [cities, setCities] = useState([])
  const [districts, setDistricts] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const [districtOptions, setDistrictOptions] = useState([])

  const fetchCities = async () => {
    try {
      const response = await axios.get(CHECKOUT_CITY_GET)
      if (response.data.success) {
        const options = response.data.rows.map((v, i) => ({
          value: v.id,
          text: v.city_name,
        }))

        setCities(response.data.rows)
        setCityOptions(options)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const fetchDistricts = async () => {
    try {
      const response = await axios.get(CHECKOUT_DISTRICT_GET)
      if (response.data.success) {
        const options = response.data.rows.map((v, i) => ({
          value: v.id,
          text: v.district_name,
          city_id: v.city_id,
        }))

        setDistricts(response.data.rows)
        // setDistrictOptions(options)
      }
    } catch (error) {
      console.error('Error fetching districts:', error)
    }
  }

  const filteredDistrictOptions = useCallback((selectedCityId) => {
    const filteredDistrictOptions = districts
      .filter((v) => v.city_id === selectedCityId)
      .map((v) => ({
        value: v.id,
        text: v.district_name,
      }))
    setDistrictOptions(filteredDistrictOptions)
  }, [districts])
  

  useEffect(() => {
    fetchCities()
    fetchDistricts()
  }, [])

  return {
    cities,
    districts,
    cityOptions,
    districtOptions,
    filteredDistrictOptions,
    fetchCities,
    fetchDistricts,
  }
}

export default useFetchCityDistrict
