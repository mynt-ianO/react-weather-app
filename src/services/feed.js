export function getList() {
    return fetch('https://api.thingspeak.com/channels/1254631/feeds.json?api_key=502179E6TAJ6QG5O&results=1')
      .then(data => data.json())
}