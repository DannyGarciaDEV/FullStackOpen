const useCountry = (name) => {
    const [country, setCountry] = useState(null)
  
    useEffect(() => {
      const fetchCountry = async () => {
        try {
          const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`)
          const data = response.data[0] // Assuming the first item in the array is the correct country
          setCountry({ data, found: true })
        } catch (error) {
          // If no country is found or an error occurs, set country to null
          setCountry({ found: false })
        }
      }
  
      // Only fetch country details if a name is provided
      if (name) {
        fetchCountry()
      }
    }, [name]) // Use name as the dependency for useEffect
  
    return country
  }
export default useCountry;  