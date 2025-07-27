const apiKey = "b55b04cf3a84bbf0160f5a46270a614c"; // 🔑 

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city");

  const weatherBox = document.getElementById("weatherInfo");
  const forecastBox = document.getElementById("forecast");

  try {
    // Fetch current weather
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200) throw new Error(weatherData.message);

    const { name, main, wind, weather } = weatherData;

    weatherBox.classList.remove("d-none");
    weatherBox.innerHTML = `
      <h3>${name}</h3>
      <p><b>Temperature:</b> ${main.temp}°C</p>
      <p><b>Humidity:</b> ${main.humidity}%</p>
      <p><b>Wind Speed:</b> ${wind.speed} m/s</p>
      <p><b>Condition:</b> ${weather[0].main} (${weather[0].description})</p>
    `;

    // Fetch 5-day forecast
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastRes.json();

    forecastBox.innerHTML = "<h4 class='mt-4'>5-Day Forecast:</h4>";

    const filtered = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
    filtered.forEach(day => {
      const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });

      forecastBox.innerHTML += `
        <div class="col-md-2">
          <div class="card p-2">
            <h6>${date}</h6>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
            <p>${day.main.temp}°C</p>
            <small>${day.weather[0].main}</small>
          </div>
        </div>
      `;
    });

  } catch (err) {
    weatherBox.classList.add("d-none");
    forecastBox.innerHTML = "";
    alert("Error: " + err.message);
  }
}
