import React, { Component } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import './sass/styles.scss'
import './App.css'
import Spinner from './spinner/spinner'
moment.locale('en', {
  week: {
    dow: 1,
    doy: 1,
  },
});
const localizer = momentLocalizer(moment)


const ical = require('ical-generator');
const cal = ical({ domain: "github.com/aliveSurfin/react-uod-cal", name: "react-uod-cal", prodId: { company: "github.com/aliveSurfin", product: "react-uod-cal" } });
var filedownloadlink = false

function Event({ event }) {
  let url = "https://www.dundee.ac.uk/module/" + event.modcode
  let staff = []
  for (let x = 0; x < event.staff.length; x++) {
    staff.push(<a href={event.staff[x].url}> {event.staff[x].name} </a>)
  }

  return (
    <div className="event-wrapper">
      <div className="event-type">
        {event.type}
      </div>
      <div className="event-module">
        <a href={url}>{event.modcode} {event.moduleName}</a>
      </div>
      <div className="event-room">
        {event.room === "&nbsp;" ? "n/a" : event.room}
      </div>
      <div className="event-staff">
        {staff}
      </div>
    </div>
  )

}
export default class App extends Component {
  constructor(props) {
    super(props);
    const minTime = new Date();
    minTime.setHours(8, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(20, 0, 0);
    this.state = {
      minTime: minTime,
      maxTime: maxTime,
      loading: false,
      events: [],
      modules: [],

    }

  }
  openUrl() {
    if (this.state.matric === "" || this.state.matric === undefined || this.state.matric === null) {
      return false
    }
    window.open(window.location.origin + window.location.pathname + "/?s=" + this.state.matric, "_self")
  }
  _HandleInput(e) {
    if (e.key === 'Enter') {
      console.log("hit")
      this.openUrl()
    }
  }
  _HandleChange(e) {
    console.log(e)
    this.setState({ matric: e })
  }

  render() {
    let components = {
      agenda: {
        event: Event
      }
    }
    return (
      <div id="container">
        {filedownloadlink && <a className = "ical-dl" download="cal.ics" href={filedownloadlink}>Download iCal</a>}



        {this.state.loading && <Spinner></Spinner>}

        <Calendar
          components={components}
          localizer={localizer}
          events={this.state.calendar == null ? [] : this.state.calendar}
          startAccessor="start"
          endAccessor="end"
          style={this.state.calendar == null ? { display: "none" } : { height:  700}}
          defaultView={'agenda'}
          min={this.state.minTime}
          max={this.state.maxTime}
          formats={{
            agendaHeaderFormat: ({ start, end }) => {
              return (moment.utc(start).format('DD/MM/YYYY') + ' - ' + moment.utc(end).format('DD/MM/YYYY'));
            }
          }}
        />
        {(this.state.calendar == null && !this.state.loading) &&
          <div className="matric-input">
            <form>
              <label> Enter Matriculation Number </label>
              <input onChange={event => this._HandleChange(event.target.value)}
                onKeyDown={evnt => this._HandleInput(evnt)}
                name="matriculation"
              ></input>
              <select>
                <option value={1}> 
                  /1
                </option>
                <option value={2}>
                  /2
                </option>
              </select>
              <button onClick={() => this.openUrl()} type="submit">
                Go
              </button>
            </form>
          </div>
        }


      </div>
    )
  }
  tableToJson(table) {
    var data = [];
    if (table.rows[0] == undefined) {
      return {}
    }
    // first row needs to be headers
    var headers = [];
    for (let i = 0; i < table.rows[0].cells.length; i++) {
      headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
    }

    // go through cells
    for (let i = 1; i < table.rows.length; i++) {

      var tableRow = table.rows[i];
      var rowData = {};

      for (var j = 0; j < tableRow.cells.length; j++) {

        rowData[headers[j]] = tableRow.cells[j].innerHTML;

      }

      data.push(rowData);
    }
    return data;
  }

  async parseTimetable(days) {
    var events = []
    function addMinutes(date, minutes) {
      return new Date(date.getTime() + minutes * 60000);
    }
    function parseWeeks(weeks) {
      if (weeks.includes("-")) {
        var test = weeks.split("-")
        var returnArray = []
        for (let x = parseInt(test[0].trim()); x <= parseInt(test[1].trim()); x++) {
          returnArray.push(parseInt(x))
        }
        return returnArray
      } else {
        let returnArray = []
        returnArray.push(parseInt(weeks.trim()))
        return returnArray
      }
    }
    function parseTime(time) {
      var split = time.split(":")
      var returnArray = []
      returnArray.push(parseInt(split[0].trim()))
      returnArray.push(parseInt(split[1].trim()))
      return returnArray
    }
    function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
    var week1 = new Date(2021, 8, 27)
    var week12 = new Date(2022, 0, 17)

    var moduleDict = {};

    for (let x = 0; x < days.length; x++) {
      let dayAdd = x
      for (let y = 0; y < days[x].length; y++) {
        var cur = days[x][y]
        var modcode = cur.activity.split(" ")[0]
        if (modcode.includes("/")) {
          modcode = modcode.split("/")[0]
        } else if (modcode.includes("-")) {
          modcode = modcode.split("-")[0]
        }
        modcode = modcode.replace(/[^0-9a-z]/gi, '')
        var moduleBaseURL = "https://www.dundee.ac.uk/module/"

        if (!(modcode in moduleDict)) {
          moduleDict[modcode] =
            this.getModuleInfo(moduleBaseURL + modcode)
        }
        var moduleName = moduleDict[modcode]
        var weeksForEvent = []
        if (cur.weeks.includes("-") && cur.weeks.includes(",")) {
          // multiple week spans
          var weeksSplit = cur.weeks.split(",")
          for (let z = 0; z < weeksSplit.length; z++) {
            weeksForEvent = weeksForEvent.concat(parseWeeks(weeksSplit[z]))
          }

        }
        else if (cur.weeks.includes(",")) {
          // multiple weeks
          let weeksSplit = cur.weeks.split(",")
          for (let z = 0; z < weeksSplit.length; z++) {
            weeksForEvent = weeksForEvent.concat(parseWeeks(weeksSplit[z]))
          }
        } else if (cur.weeks.includes("-")) {
          //week span

          weeksForEvent = weeksForEvent.concat(parseWeeks(cur.weeks))
        } else {
          weeksForEvent = weeksForEvent.concat(parseWeeks(cur.weeks))
          //single week
        }
        for (let i = 0; i < weeksForEvent.length; i++) {
          let curDate
          if (weeksForEvent[i] >= 12) {
            console.log(weeksForEvent[i]);
            weeksForEvent[i] = weeksForEvent[i] - 12
            curDate = addDays(week12, ((weeksForEvent[i] -1 ) * 7))
          } else {
            curDate = addDays(week1, ((weeksForEvent[i] - 1) * 7))
          }
          curDate = addDays(curDate, dayAdd)
          var startHours = parseTime(cur.start)
          var start = addMinutes(curDate, startHours[0] * 60)
          start = addMinutes(start, startHours[1])
          var endHours = parseTime(cur.end)
          var end = addMinutes(curDate, endHours[0] * 60)
          end = addMinutes(end, endHours[1])

          let staffurl = "https://www.dundee.ac.uk/people/"
          let staffsplit = cur.staff.split(",")
          if (staffsplit.length % 2 !== 0) {
            staffsplit.shift()
          }
          let staffarray = []
          for (let x = 0; x < staffsplit.length; x += 2) {
            staffarray.push({
              name: staffsplit[x + 1].trim() + " " + staffsplit[x].trim(),
              url: staffurl + staffsplit[x + 1].trim() + "-" + staffsplit[x].trim(),
            })
          }
          var event = {
            title: cur.type + " | " + moduleName,
            type: cur.type,
            start: start,
            end: end,
            allDay: false,
            moduleName: moduleName,
            modcode: modcode,
            room: cur.room,
            activity: cur.activity,
            staff: staffarray,
            duration: cur.duration,
          };

          let icalevent = {
            start: start,
            end: end,
            summary: event.type + " : " + moduleName,
            description: event.activity,
            location: event.room,
          }
          cal.createEvent(icalevent)
          events.push(event)
        }

      }
    }
    filedownloadlink = cal.toURL()
    return events
  }
  getModuleInfo(url) {
    var cors = "https://cors-anywhere.herokuapp.com/"
    cors = "https://mysterious-everglades-22580.herokuapp.com/"
    cors = "https://cors-spooky.herokuapp.com/"
    cors = "https://secret-chamber-30285.herokuapp.com/"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", cors + url, false); // false for synchronous request
    xmlHttp.send();
    //console.log(xmlHttp.responseText)
    var raw = xmlHttp.responseText.split("<title>")[1].split("module")[0].trim()
    return raw
  }
  getTimetable(matric) {
    if (matric === "" || matric === undefined || matric === null) {
      return
    }
    var hostname = 'https://timetable.dundee.ac.uk'
    var port = '8085'
    var path = '/reporting/textspreadsheet?objectclass=student+set&idtype=id&identifier='
    var path2 = "/1&t=SWSCUST+student+set+textspreadsheet&days=1-7&weeks=1-52&periods=1-28&template=SWSCUST+student+set+textspreadsheet"
    var cors = "https://cors-anywhere.herokuapp.com/"
    cors = "https://mysterious-everglades-22580.herokuapp.com/"
    cors = "https://cors-spooky.herokuapp.com/"
    cors = "https://secret-chamber-30285.herokuapp.com/"
    var fullURL = hostname + ':' + port + path + matric + path2
    //console.log(fullURL);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", cors + fullURL, false); // false for synchronous request
    xmlHttp.send();
    var raw = xmlHttp.responseText
    raw = raw.split(`<p><span class='labelone'>Monday</span></p>`)[1]
    if (raw === undefined) {
      return
    }
    raw = raw.split(`<p><span class='labelone'>Saturday</span></p>`)[0]
    //console.log(raw)
    var days = raw.split('</span></p>')
    var daysJSON = []
    for (let x = 0; x < days.length; x++) {
      if (days[x].includes(`<p><span class='labelone'`)) {
        days[x] = days[x].split('</table>')[0]
      }
      var parser = new DOMParser();
      var doc = parser.parseFromString(days[x], 'text/html');
      daysJSON.push(this.tableToJson(doc.body.firstChild))

    }
    //console.log(daysJSON)
    let temp = this.parseTimetable(daysJSON)
    this.setState({ "calendar": temp })

  }

  getTimetableFromMatric(matric) {
    if (matric === "" || matric === undefined || matric === null) {
      return
    }

  }
  createURLFromMatric(matric) {
    var hostname = 'https://timetable.dundee.ac.uk'
    var port = '8085'
    var path = '/reporting/textspreadsheet?objectclass=student+set&idtype=id&identifier='
    var path2 = "/1&t=SWSCUST+student+set+textspreadsheet&days=1-7&weeks=1-52&periods=1-28&template=SWSCUST+student+set+textspreadsheet"
    var cors = "https://cors-anywhere.herokuapp.com/"
    cors = "https://mysterious-everglades-22580.herokuapp.com/"
    cors = "https://cors-spooky.herokuapp.com/"
    cors = "https://secret-chamber-30285.herokuapp.com/"
    var fullURL = cors + hostname + ':' + port + path + matric + path2
    return fullURL
  }
  async rawHtmlToJSON(raw) {
    raw = raw.split(`<p><span class='labelone'>Monday</span></p>`)[1]
    if (raw === undefined) {
      return
    }
    raw = raw.split(`<p><span class='labelone'>Saturday</span></p>`)[0]
    var days = raw.split('</span></p>')
    var daysJSON = []
    for (let x = 0; x < days.length; x++) {
      if (days[x].includes(`<p><span class='labelone'`)) {
        days[x] = days[x].split('</table>')[0]
      }
      var parser = new DOMParser();
      var doc = parser.parseFromString(days[x], 'text/html');
      daysJSON.push(this.tableToJson(doc.body.firstChild))

    }
    return daysJSON
  }
  componentDidMount() {
    console.log(window.location.search)
    //this.getTimetable(window.location.search.split("=")[1])
    let matric = window.location.search.split("=")[1];
    if (!/[0-9]{9}/.test(matric)) {
      this.setState({ loading: false })
      return
    }
    this.setState({ loading: true })
    //this.getTimetableRawFromMatric(window.location.search.split("=")[1]).then((e)=>{console.log(e);})
    // fetch(this.createURLFromMatric(matric)).then(res => console.log(res))
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", this.createURLFromMatric(matric));
    xmlHttp.send();
    xmlHttp.onload = () => {
      this.rawHtmlToJSON(xmlHttp.responseText).then((e) => {
        this.parseTimetable(e).then((f) => {
          this.setState({ "calendar": f, loading: false })
        })
      })
    }

  }

}
