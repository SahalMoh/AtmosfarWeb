const weather = {
  apiKey: '3f7e6abb7a6c4e6ea9e195439241905',

  async fetchWeather(query) {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    loaderWrapper.style.display = 'flex';

    try {
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${query}&days=2&aqi=yes`
      );
      if (!weatherResponse.ok) {
        throw new Error("City Not Found");
      }
      const weatherData = await weatherResponse.json();
      this.displayWeather(weatherData);

      const astronomyResponse = await fetch(
        `https://api.weatherapi.com/v1/astronomy.json?key=${this.apiKey}&q=${query}`
      );
      if (!astronomyResponse.ok) {
        throw new Error("Failed to fetch astronomy data.");
      }
      const astronomyData = await astronomyResponse.json();
      this.displayAstronomy(astronomyData);
    } catch (error) {
      console.log(error);
      if (error.message === "City Not Found") {
        document.querySelector(".name").innerHTML = "City Not Found";
      } else if (!navigator.onLine) {
        alert(
          "No Internet Connection. Please check your internet connection and try again."
        );
      }
    } finally {
      setTimeout(() => {
        loaderWrapper.classList.add('hidden');
        setTimeout(() => {
          loaderWrapper.style.display = 'none';
        }, 1800);
      }, 3500);
    }
  },

  displayWeather(data) {
    const {
      location: { name, localtime, country },
      current: {
        condition: { icon, text, code },
        temp_c,
        temp_f,
        humidity,
        wind_kph,
        wind_mph,
        wind_degree,
        wind_dir,
        cloud,
        is_day,
        feelslike_c,
        feelslike_f,
        vis_km,
        vis_miles,
        uv,
        pressure_mb,
        pressure_in,
        gust_mph,
        gust_kph,
        precip_in,
        precip_mm,
        last_updated,
        air_quality: { co, o3, no2, so2, pm2_5, pm10 },
        air_quality: { "us-epa-index": usepaindex, "gb-defra-index": ukdefraindex },
      },
      forecast: { forecastday }
    } = data;

    const body = document.body;
    const submitButton = document.querySelector(".submit");
    const weatherIcon = document.getElementById("weatherIcon");

    const localIconPath = icon.replace(
      "//cdn.weatherapi.com/weather/64x64",
      "./assets/weather/64x64"
    );

    document.querySelector(".name").innerHTML = name;
    document.querySelector(".country").innerHTML = country;
    weatherIcon.src = localIconPath;
    document.querySelector(".datetime").innerHTML = localtime;
    document.querySelector(".condition").innerHTML = text;
    document.querySelector(".temp").innerHTML = `${temp_c}&#176;C / ${temp_f}&#176;F`;
    document.querySelector(".cloud").innerHTML = `${cloud}%`;
    document.querySelector(".humidity").innerHTML = `${humidity}%`;
    document.querySelector(".precip").innerHTML = `${precip_mm} MM / ${precip_in} IN`;
    document.querySelector(".wind").innerHTML = `${wind_kph} KMph / ${wind_mph} Mph`;
    document.querySelector(".gust").innerHTML = `${gust_kph} KMph / ${gust_mph} Mph`;
    document.querySelector(".winddeg").innerHTML = `${wind_degree}&#176;`;
    document.querySelector(".winddir").innerHTML = wind_dir;
    document.querySelector(".feelslike").innerHTML = `${feelslike_c}&#176;C / ${feelslike_f}&#176;F`;
    document.querySelector(".visib").innerHTML = `${vis_km} KM / ${vis_miles} Miles`;
    document.querySelector(".uvindex").innerHTML = uv;
    document.querySelector(".pressure").innerHTML = `${pressure_mb} MB / ${pressure_in} IN`;
    document.querySelector(".carbmonx").innerHTML = `${Math.trunc(co)} &#181;g/m3`;
    document.querySelector(".ozone").innerHTML = `${Math.trunc(o3)} &#181;g/m3`;
    document.querySelector(".nitrodiox").innerHTML = `${Math.trunc(no2)} &#181;g/m3`;
    document.querySelector(".sulphdiox").innerHTML = `${Math.trunc(so2)} &#181;g/m3`;
    document.querySelector(".pm25").innerHTML = `${Math.trunc(pm2_5)} &#181;g/m3`;
    document.querySelector(".pm10").innerHTML = `${Math.trunc(pm10)} &#181;g/m3`;
    document.querySelector(".usepaindex").innerHTML = usepaindex;
    document.querySelector(".ukdefraindex").innerHTML = ukdefraindex;
    document.querySelector(".lastupdated").innerHTML = `Last Updated At: ${last_updated}`;

    const setButtonBackground = (is_day, submitBackgroundDay, submitBackgroundNight) => {
      submitButton.style.background = is_day ? submitBackgroundDay : submitBackgroundNight;
    };

    const setBackgroundImage = (
      dayBackground,
      nightBackground,
      submitBackgroundDay,
      submitBackgroundNight
    ) => {
      body.style.backgroundImage = !is_day ? `url(${nightBackground})` : `url(${dayBackground})`;
      body.style.backgroundPosition = "center";
      body.style.backgroundSize = "cover";
      body.style.backgroundRepeat = "no-repeat";
      setButtonBackground(is_day, submitBackgroundDay, submitBackgroundNight);
      body.style.transition = "1.25s ease-in-out";
    };

    if (code === 1000) {
      setBackgroundImage(
        "./assets/day_bg/ClearDay.jpg",
        "./assets/night_bg/ClearNight.jpg",
        "#e5ba92",
        "#181e27"
      );
    } else if (
      [
        1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282,
      ].includes(code)
    ) {
      setBackgroundImage(
        "./assets/day_bg/CloudyDay.jpg",
        "./assets/night_bg/CloudyNight.jpg",
        "#fa6d1b",
        "#181e27"
      );
    } else if (
      [
        1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195,
        1204, 1207, 1240, 1243, 1246, 1249, 1252,
      ].includes(code)
    ) {
      setBackgroundImage(
        "./assets/day_bg/RainyDay.jpg",
        "./assets/night_bg/RainyNight.jpg",
        "#647d75",
        "#325c80"
      );
    } else {
      setBackgroundImage(
        "./assets/day_bg/SnowyDay.jpg",
        "./assets/night_bg/SnowyNight.jpg",
        "#1b1b1b",
        "#1b1b1b"
      );
    }

    for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
      const forecastHour = forecastday[0].hour[hourIndex];
      const weatherBox = document.querySelector(`.weather-box.hour${hourIndex + 1}`);
      const boxIcon = weatherBox.querySelector(".box-icon");
      const localForecastIconPath = forecastHour.condition.icon.replace(
        "//cdn.weatherapi.com/weather/64x64",
        "./assets/weather/64x64"
      );
      boxIcon.src = localForecastIconPath;
      weatherBox.querySelector(".box-title").innerText = `${forecastHour.temp_c}°C / ${forecastHour.temp_f}°F`;
      weatherBox.querySelector(".box-subtitle").innerText = forecastHour.time;
    }
    
  },

  displayAstronomy(data) {
    const {
      sunrise,
      sunset,
      moonrise,
      moonset,
      moon_phase,
      moon_illumination,
    } = data.astronomy.astro;

    document.querySelector(".sunrise").innerHTML = sunrise;
    document.querySelector(".sunset").innerHTML = sunset;
    document.querySelector(".moonrise").innerHTML = moonrise;
    document.querySelector(".moonset").innerHTML = moonset;
    document.querySelector(".moonphase").innerHTML = moon_phase;
    document.querySelector(".moonillum").innerHTML = moon_illumination;
  },

  search() {
    this.fetchWeather(document.querySelector(".search").value);
  },
};

document.querySelector(".submit").addEventListener("click", () => weather.search());

document.querySelector(".search").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    weather.search();
  }
});

async function getPublicIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    if (!response.ok) {
      throw new Error("Failed to get public IP");
    }
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching public IP:", error);
  }
}

async function getWeatherByIP() {
  try {
    const ip = await getPublicIP();
    if (!ip) {
      throw new Error("Failed to get IP");
    }
    await weather.fetchWeather(ip);
  } catch (error) {
    console.error("Error fetching weather by IP:", error);
  }
}

getWeatherByIP();

window.addEventListener("offline", () => {
  alert("No Internet Connection. Please check your internet connection and try again.");
});