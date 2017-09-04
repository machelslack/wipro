(function() {
  'use strict';

    const app = {
    isLoading: true,
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

    app.updateForecastCard = function(data) {

    let dataLastUpdated = new Date(data.created);
    let sunrise = data.channel.astronomy.sunrise;
    let sunset = data.channel.astronomy.sunset;
    let current = data.channel.item.condition;
    let humidity = data.channel.atmosphere.humidity;
    let wind = data.channel.wind;
    app.cardTemplate.querySelector('.description').textContent = current.text;
    app.cardTemplate.querySelector('.date').textContent = current.date;
    app.cardTemplate.querySelector('.current .icon').classList.add(app.getIconClass(current.code));
    app.cardTemplate.querySelector('.current .temperature .value').textContent =
      Math.round(current.temp);
    app.cardTemplate.querySelector('.current .sunrise').textContent = sunrise;
    app.cardTemplate.querySelector('.current .sunset').textContent = sunset;
    app.cardTemplate.querySelector('.current .humidity').textContent =
      Math.round(humidity) + '%';
    app.cardTemplate.querySelector('.current .wind .value').textContent =
      Math.round(wind.speed);
    app.cardTemplate.querySelector('.current .wind .direction').textContent = wind.direction;
    let nextDays = cardTemplate.querySelectorAll('.future .oneday');
    let today = new Date();
    today = today.getDay();
    for (let i = 0; i < 7; i++) {
      var nextDay = nextDays[i];
      var daily = data.channel.item.forecast[i];
      if (daily && nextDay) {
        nextDay.querySelector('.date').textContent =
          app.daysOfWeek[(i + today) % 7];
        nextDay.querySelector('.icon').classList.add(app.getIconClass(daily.code));
        nextDay.querySelector('.temp-high .value').textContent =
          Math.round(daily.high);
        nextDay.querySelector('.temp-low .value').textContent =
          Math.round(daily.low);
      }
    }
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };

app.getIconClass = function(weatherCode) {
    // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
    weatherCode = parseInt(weatherCode);
    switch (weatherCode) {
      case 25: 
      case 32: 
      case 33: 
      case 34: 
      case 36: 
      case 3200: 
        return 'clear-day';
      case 0: 
      case 1: 
      case 2: 
      case 6: 
      case 8: 
      case 9: 
      case 10: 
      case 11: 
      case 12: 
      case 17: 
      case 35: 
      case 40: 
        return 'rain';
      case 3:
      case 4:
      case 37: 
      case 38: 
      case 39: 
      case 45: 
      case 47:
        return 'thunderstorms';
      case 5: 
      case 7: 
      case 13: 
      case 14: 
      case 16: 
      case 18: 
      case 41: 
      case 42: 
      case 43: 
      case 46: 
        return 'snow';
      case 15: 
      case 19: 
      case 20: 
      case 21: 
      case 22: 
        return 'fog';
      case 24: 
      case 23: 
        return 'windy';
      case 26: 
      case 27: 
      case 28: 
      case 31: 
        return 'cloudy';
      case 29: 
      case 30: 
      case 44: 
        return 'partly-cloudy-day';
    }
  };



  var initialWeatherForecast = {
    key: '2459115',
    label: 'New York, NY',
    created: '2016-07-22T01:00:00Z',
    channel: {
      astronomy: {
        sunrise: "5:43 am",
        sunset: "8:21 pm"
      },
      item: {
        condition: {
          text: "Windy",
          date: "Thu, 21 Jul 2016 09:00 PM EDT",
          temp: 56,
          code: 24
        },
        forecast: [
          {code: 44, high: 86, low: 70},
          {code: 44, high: 94, low: 73},
          {code: 4, high: 95, low: 78},
          {code: 24, high: 75, low: 89},
          {code: 24, high: 89, low: 77},
          {code: 44, high: 92, low: 79},
          {code: 44, high: 89, low: 77}
        ]
      },
      atmosphere: {
        humidity: 56
      },
      wind: {
        speed: 25,
        direction: 195
      }
    }
  };


app.updateForecastCard(initialWeatherForecast);

})();
