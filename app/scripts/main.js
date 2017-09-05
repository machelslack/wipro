(function() { 'use strict';

    const app = {
    todaysDate: new Date(),
    isLoading: true,
    forcastData:{},
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    daysOfWeek: [ 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  };

    app.updateForecastCard = (data) => {

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
    for (let i = 0; i < 5; i++) {
      let nextDay = nextDays[i];
      let daily = data.channel.item.forecast[i];
      if (daily && nextDay) {
        nextDay.querySelector('.date').textContent =
          app.daysOfWeek[(i + today)];
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

app.getIconClass = (weatherCode) =>  {

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


app.getForcast = (city) =>{


let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&mode=json&appid=2bd757f23ca948f1953dc3f99d6b3c57`;

let xhr = new XMLHttpRequest();
  xhr.onload = function () { 
   
    app.forcastData = JSON.parse(this.responseText);
    app.decontructData(app.forcastData);

  };

  xhr.open('GET', url, true);
  xhr.send();




}



app.decontructData =  (data) =>{ const fiveDays = data.list ;

let days = [] ;


for ( let counter = 0; counter < 5 ; counter++ ) {
    
  let marker = app.todaysDate.getDate() + counter;

  days.push(fiveDays.filter(function(element){
 
  let date = new Date(element.dt_txt).getDate();
  
  return  date === marker ;
    
  }));
      
};

app.updateForecastCard(app.initialiseForecast(days));

}



app.initialiseForecast =  (days) => {



  let forecast = [];

  days.forEach((element,index) => {

  let min = 0, max = 0 , item = "" , compare = -1, current = {},weather =[] ,counts = {};

  const dayArray = element;

  dayArray.forEach((innerElement,index) =>{

  let marker = index+1;
  
  marker < dayArray.length ? app.todaysDate <= new Date(innerElement.dt_txt) || 

  (app.todaysDate >= new Date(innerElement.dt_txt) && app.todaysDate <= new Date(dayArray[marker].dt_txt))

  ?  current = innerElement : null : null;

  index === 0 ? min = innerElement.main.temp_min :  
  min = innerElement.main.temp_min <= min ? min : innerElement.main.temp_min ;

  index === 0 ? max = innerElement.main.temp_max :
  max = innerElement.main.temp_max >= max ? max : innerElement.main.temp_max ;

  let code = innerElement.weather[0].icon;

  counts[code] = counts[code] === undefined ?  1 :  counts[code] + 1 ;

  counts[code] > compare ? (compare = counts[code] , 

  item = {current:current, code: innerElement.weather[0].icon.replace(/[a-z]/,'') , 

  high: (( max - 273.15) * 9/5) + 32 , 

  low: (( min - 273.15) * 9/5) + 32 } ) : null ;

  });
   
  forecast.push(item);

  });


  const initialWeatherForecast = {
  
  key: app.forcastData.city.id,
    label: app.forcastData.city.name,
    created: new Date(),
    channel: {
      astronomy: {
        sunrise: "",
        sunset: ""
      },
      item: {
        condition: {
          text: forecast[0].current.weather[0].main,
          date: new Date(forecast[0].current.dt_txt),
          temp: (( forecast[0].current.main.temp - 273.15) * 9/5) + 32,
          code: forecast[0].current.weather[0].icon.replace(/[a-z]/,'')
        },
      forecast:forecast
    },
    atmosphere: {
        humidity: forecast[0].current.main.humidity
      },
      wind: {
        speed: forecast[0].current.wind.speed,
        direction: ""
      }
    }
  }

return initialWeatherForecast;

}


app.getForcast('London');


})();
