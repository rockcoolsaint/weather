import React, {useState, useEffect} from "react";

const Searchweather = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [input, setInput] = useState("");
    const API_KEY = process.env.REACT_APP_API_KEY;

    const myIP = async (location) => {
      const {latitude, longitude} = location.coords
      console.log(location.coords)
      // get city name using reverse geocoding
      const geo_location = await (await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${API_KEY}`)).json();
      console.log(geo_location)
      setSearch(`${geo_location[0]?.state}`)
      console.log(location)
      // get weather
      const response = await (await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly&appid=${API_KEY}`)).json();
      console.log(response);
      setData(await response);
      console.log(data)
    }

    useEffect(() => {
        const fetchWeather = async () => {
            const location = await (await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${API_KEY}`)).json();
            console.log(location);
            const lon = location[0]?.lon;
            const lat = location[0]?.lat;

            const response = await (await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${API_KEY}`)).json();
            console.log(response);
            // setData
            setData(await response);
        }
        fetchWeather();
    }, [search]);

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(myIP);
      } else {
        alert("Geolocation is not enabled/supported by this browser")
      }
    }, []);

    let emoji = null;
    if(typeof data.current != "undefined"){
        if(data?.current?.weather[0]?.main === "Clouds"){
            emoji = "fa-cloud"
        }else if(data?.current?.weather[0]?.main === "Thunderstorm"){
            emoji = "fa-bolt"
        }else if(data?.current?.weather[0]?.main === "Drizzle"){
            emoji = "fa-cloud-rain"
        }else if(data?.current?.weather[0]?.main === "Rain"){
            emoji = "fa-cloud-shower-heavy"
        }else if(data?.current?.weather[0]?.main === "Snow"){
            emoji = "fa-snow-flake"
        }else {
            emoji = "fa-smog"
        }
    }else{
        return (
            <div>...Loading</div>
        )
    }

    let temp = (data?.current?.temp - 273.15).toFixed(2);
    let temp_min = (data?.daily[0]?.temp?.min - 273.15).toFixed(2);
    let temp_max = (data?.daily[0]?.temp?.max - 273.15).toFixed(2);

    // Date
    let d = new Date();
    let date = d.getDate();
    let year = d.getFullYear();
    let month = d.toLocaleString("default", {month:'long'});
    let day = d.toLocaleString("default", {weekday:'long'});

    // Time
    let time = d.toLocaleString([],{
        hour : '2-digit',
        minute: '2-digit',
        second:'2-digit'
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        setSearch(input);
    }

  return (
    <div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card text-white text-center border-0">
              <img
                src={`https://source.unsplash.com/600x900/?${data?.current?.weather[0]?.main}`}
                className="card-img"
                alt="..."
              />
              <div className="card-img-overlay">
                <form onSubmit={handleSubmit}>
                  <div className="input-group mb-4 w-75 mx-auto">
                    <input
                      type="search"
                      className="form-control"
                      list="datalistOptions"
                      id="exampleDataList"
                      placeholder="Search City"
                      aria-label="Search City"
                      aria-describedby="basic-addon2"
                      name="search"
                      value={input}
                      onChange={(e)=>setInput(e.target.value)}
                      required
                    />
                    <datalist id="datalistOptions">
                      <option value="Lagos"/>
                      <option value="Abuja"/>
                      <option value="London"/>
                      <option value="Los Angeles"/>
                      <option value="Paris"/>

                      <option value="San Francisco"/>
                      <option value="New York"/>
                      <option value="Seattle"/>
                      <option value="Chicago"/>
                    </datalist>
                    <button type="submit" className="input-group-text" id="basic-addon2">
                      <i className="fas fa-search"></i>
                    </button>
                    <i className="fa fa-map-marker-alt my-auto cursor-pointer p-3 text-white bg-dark" role="button" aria-hidden="true" onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(myIP)
                      } else {
                        alert("Geolocation is not enabled in this browser. enable geolocation to use this feature")
                      }
                    }}></i>
                  </div>
                </form>
                <div className="bg-dark bg-opacity-50 py-3">
                  <h2 className="card-title capitalize">{search}</h2>
                  <p className="card-text lead">
                    {day}, {month} {date}, {year}
                    <br />
                    {time}
                  </p>
                  <hr />
                  <i className={`fas ${emoji} fa-2x`}></i>
                  <h1 className="fw-bolder mb-3">{(data?.current?.temp - 273.15).toFixed(2)} &deg;C</h1>
                  <p className="lead fw-bolder mb-0">{data?.current?.weather[0]?.main}</p>
                  <p className="lead">{temp_min}&deg;C | {temp_max}&deg;C</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            {data.daily.slice(1,5).map((item, idx) => {
              let temp = (item?.temp?.day - 273.15).toFixed(2);
              let temp_min = (item?.temp?.min - 273.15).toFixed(2);
              let temp_max = (item?.temp?.max - 273.15).toFixed(2);

              let d = new Date(item.dt * 1000)
              let date = d.getDate();
              let year = d.getFullYear();
              let month = d.toLocaleString("default", {month:'long'});
              let day = d.toLocaleString("default", {weekday:'long'});

              return (
                <div key={idx} className="bg-dark bg-opacity-50 py-3 mb-3">
                  <p className="card-text lead">
                    {day}, {month} {date}, {year}
                  </p>
                  <hr />
                  <h1 className="fw-bolder mb-3">{temp} &deg;C</h1>
                  <p className="lead fw-bolder mb-0">{item?.weather[0]?.main}</p>
                  <p className="lead">{temp_min}&deg;C | {temp_max}&deg;C</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchweather;