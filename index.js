const chapterpage = require('chapter-page')

const colors = {
  color0: '#43409a', // darkBlue,
  color1: '#3022bb', // blue,
  color2: '#6f68ae', // lightBlue,
  color3: '#f989ff', // lightPink,
  color4: '#730d61', // darkPink,
  color5: '#080707', // black,
  color6: '#2e3f41', // grey,
  color7: '#f7da8b', // skinYellow,
  color8: '#ffffff', // white,
  color9: 'rgba(0, 0, 0, 1)',
}
const theme = { colors }
const data = {
  title: 'Lagos',
  logo: 'assets/wizard3.png',
  home: 'http://wizardamigos.com/',
  tabs: [{
    title: 'meetups',
    url: 'https://www.meetup.com/WizardAmigos/events/calendar/'
  },{
    title: 'hangout',
    url: 'https://meet.jit.si/wizardamigos-lagos'
  },{
    title: 'about',
    url: 'https://wizardamigos.com'
  }],
  chat: 'https://gitter.im/wizardamigosinstitute/program/~embed',
  chapters: [{
    title: 'Berlin',
    url: 'http://wizardamigos.com/chapter-berlin/',
  },{
    title: 'Nashville',
    url: 'http://wizardamigos.com/chapter-nashville/',
  },{
    title: 'Taipei',
    url: 'http://wizardamigos.com/chapter-taipei/',
  }]
}
const { title, logo, home, tabs, chat, chapters } = data
const meetup_api = 'https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=WizardAmigos&photo-host=public&page=20&fields=&order=time&desc=false&status=upcoming'
const url = 'https://cors-anywhere.herokuapp.com/' + meetup_api

document.body.innerHTML = `<h1> Loading data - please wait ... </h1>`
try {
  var { place, time, event } = JSON.parse(localStorage[`${location.href}#lastEvent`])
  var old = new Date(time)
  var now = new Date()
  var timeDiff = now.getTime() - old.getTime()
  var diffDays = timeDiff / (1000 * 3600 * 24)
  if (diffDays < 0) throw new Error('cached event is over')
  data.place = place
  data.time = time
  data.event = event
  data.tabs[0].url = event
  init(data)
} catch (e) {
  fetch(url)
  .then(response => response.json())
  .then(res => {
    for (var i = 0; i < res.results.length; i++) {
      var place = res.results[i].venue.city
      if (place === title) {
        var event = res.results[i].event_url
        var number = res.results[i].time
        var time = new Date(number).toString()
        break
      }
    }
    localStorage[`${location.href}#lastEvent`] = JSON.stringify({ place, event, time })
    data.place = place
    data.time = time
    data.event = event
    data.tabs[0].url = event
    init(data)
  })
}
function init (data) {
  const {
    head,
    body,
  } = chapterpage({ data, theme })
  document.head.innerHTML = head
  document.body.innerHTML = body
}
