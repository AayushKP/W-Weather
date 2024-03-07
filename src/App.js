import coldBg from "./assets/cold.png";

import hazeBg from "./assets/haze.png";
import Description from "./components/Description";


import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./weatherService";

function App() {
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [city, setCity] = useState("Kolkata");
  const [bg, setBg] = useState("hazeBg");

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getFormattedWeatherData(city, units);
        setWeather(data);
        const threshold = units === "metric" ? 10 : 60;
        if (data.temp <= threshold) setBg(coldBg);
        else setBg(hazeBg);
      } catch (err) {
        alert("Please Enter a valid location");
      }
    };

    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);
    console.log(button.innerText);

    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };
  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      //cursor doesn't point anymore to the search bar
      e.currentTarget.blur();
    }
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {/* render only if weather is available */}
        {weather && (
          <div className="container">
            <div className="section section_inputs">
              <input
                onKeyDown={enterKeyPressed}
                type="text"
                name="city"
                placeholder="Enter city"
              />
              <button
                onClick={(e) => {
                  handleUnitsClick(e);
                }}
              >
                °F
              </button>
            </div>
            <div className="section section_temp">
              <div className="icon">
                <h3>{`${weather.name},${weather.country}`}</h3>
                <img
                  src={weather.iconURL}
                  width="50px"
                  height="50px"
                  alt="weather icon"
                />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${
                  units === "metric" ? "C" : "F"
                }`}</h1>
              </div>
            </div>
            {/* bottom drescription */}
            <Description weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
