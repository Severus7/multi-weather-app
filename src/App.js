import logo from "./logo.svg";
import "./App.css";

/* 
  This React Context stores two things:
  1. Array of cities 
  2. A function to add cities to this array
*/
const WeatherContext = React.createContext({
  cities: [],
  addCity: (name, temperature) => {},
});

function App() {
  /**
   * In this function...
   * React Hooks are used to keep track of the array cities and crate a setter setCities
   * The addCity function wraps the setCities which will be added into the Context
   * The root value in the hierarchy is provided using the WeatherContext.Provider
   * The child components such as CityList are used under this provider.
   */

  const [cities, setCities] = React.useState([]);

  const addCity = (name, temperature) => {
    const newCity = { name, temperature };
    setCities((prevCities) => [...prevCities, { name, temperature }]);
  };

  return (
    <WeatherContext.Provider value={{ cities, addCity }}>
      <div className="city-overview">
        <h2>Multi-Weather App</h2>
        <CityList />
        <AddCityButton />
        <TemperatureAverage />
      </div>
    </WeatherContext.Provider>
  );
}

export default App;
