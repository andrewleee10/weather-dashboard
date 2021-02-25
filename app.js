
  
document.getElementById('search-btn').addEventListener('click', event => {
  event.preventDefault()

  let newCity = document.createElement('li')
  newCity.className = 'list-group-item'
  newCity.textContent = document.getElementById('search').value
  document.getElementById('city-list').append(newCity)

  weatherOutput()
  forecast()

  document.getElementById('search').value = ''
})

// Display current weather
var weatherOutput = () => {

  // calling both apis to display current weather
  let cityName = document.getElementById('search').value

  // General weather api
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&cnt=6&appid=448a90213224f04dcb80c11dcc27c423`)
    .then(res => {
      let weatherElem = res.data
      let currentDate = moment().format('l')

      // UV Index API
      axios.get(`https://api.openweathermap.org/data/2.5/uvi?lat=${weatherElem.coord.lat}&lon=${weatherElem.coord.lon}&appid=448a90213224f04dcb80c11dcc27c423`)
        .then(res => {
          let uvi = res.data.value
          document.getElementById('current-weather').innerHTML = `
          <h5 id="name-date"> ${weatherElem.name} (${currentDate}) <img src="http://openweathermap.org/img/wn/${weatherElem.weather[0].icon}.png" alt="weather icon"></h5>
          <p>Temperature: ${weatherElem.main.temp} F</p>   
          <p>Humidity: ${weatherElem.main.humidity} %</p>   
          <p>Wind Speed: ${weatherElem.wind.speed} MPH</p>
          <p id="color">UV Index: ${uvi}</p>
        `
          if (uvi <= 2) {
            let safe = document.getElementById('color')
            safe.classList.add('green')
          } else if (uvi > 2 && uvi <= 5) {
              let moderate = document.getElementById('color')
              moderate.classList.add('orange')
          } else {
              let unsafe = document.getElementById('color')
              unsafe.classList.add('red')
          }
        })
    })
    .catch(err => console.error(err))
}

// Display a five day forecast
var forecast = () => {
  let cityName = document.getElementById('search').value

  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&cnt=6&appid=448a90213224f04dcb80c11dcc27c423`)
    .then(res => {
      let weatherElem = res.data

      // Daily Forecast API
      axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${weatherElem.coord.lat}&lon=${weatherElem.coord.lon}&exclude=current,hourly,minutely,alert&units=imperial&appid=448a90213224f04dcb80c11dcc27c423`)
        .then(res => {
          let element = res.data.daily
          console.log(element)
          let day = [moment(moment().utcOffset(1440)).format('l'), moment(moment().utcOffset(2880)).format('l'), moment(moment().utcOffset(4320)).format('l'), moment(moment().utcOffset(5760)).format('l'), moment(moment().utcOffset(7200)).format('l')]
          
          for(let i=0; i<4; i++) {
            document.getElementById('forecast').innerHTML = `
              <div class="col fiveDay">
              <p>${day[i]}</p>
              <img src="http://openweathermap.org/img/wn/${element[i].weather[0].icon}.png" alt="weather icon">
              <p>Temp: ${element[i].temp.day} F</p>
              <p>Humidity: ${element[i].humidity}%</p>
            `
          }
        })
    })
    .catch(err => console.error(err))




}