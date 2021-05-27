export const servicePiData = async () => {
  try {
    const dataResponse = await fetch('https://api.thingspeak.com/channels/1254631/feeds.json?api_key=THINGSPEAK_API_KEY&results=1');
    const data = await dataResponse.json();
    return data
  } catch (error) {
    console.log(error)
  }
}

export const serviceWeather = async (latitude, longitude) => {
  try {
    const dataResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&appid=OWM_API_KEY`);
    const data = await dataResponse.json();
    return data
  } catch (error) {
    console.log(error)
  }
}