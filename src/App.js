import React from "react";
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

// City List
const CityList = () => {
  const context = React.useContext(WeatherContext);

  return (
    <table className="city-list">
      <thead>
        <tr>
          <th>City</th>
          <th>Temperature</th>
        </tr>
      </thead>
      <tbody>
        {context.cities.map((city, i) => (
          <tr key={city.name}>
            <td>{city.name}</td>
            <td>{city.temperature}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const TemperatureAverage = (props) => {
  const context = React.useContext(WeatherContext);

  if (context.cities.length === 0) {
    return <div>Add some cities to view their average temperatures.</div>;
  }

  let total = 0;
  for (const city of context.cities) {
    total += city.temperature;
  }
  const avg = total / context.cities.length;

  return (
    <div>
      The average <b>{avg.toFixed(2)}</b> degress Fahrenheit.
    </div>
  );
};

const AddCityButton = (props) => {
  const context = React.useContext(WeatherContext);

  const [name, setName] = React.useState("");

  const submit = () => {
    const unit = "imperial";
    const mode = "json";
    const encodedName = encodeURIComponent(name);

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Host": "community-open-weather-map.p.rapidapi.com",
        "X-RapidAPI-Key": "40de412817msh85793b39f58a5e6p1cc670jsnca3120d080bd",
      },
    };

    fetch(
      "https://community-open-weather-map.p.rapidapi.com/weather?q=London%2Cuk&lat=0&lon=0&callback=test&id=2172797&lang=null&units=imperial&mode=xml",
      options
    )
      .then((response) => {
        console.log(response);
        if (response.status !== 200) throw new Error();
        return response.json();
      })
      .then((json) => {
        console.log(json);
        context.addCity(name, json.main.temp);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="add-city-form">
      <input
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="input">Add</button>
    </div>
  );
};

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
