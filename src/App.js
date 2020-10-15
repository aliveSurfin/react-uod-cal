import React, { Component } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import './sass/styles.scss'
const localizer = momentLocalizer(moment)


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  openUrl() {
    if (this.state.matric === undefined) {
      return
    }
    window.open("https://alivesurfin.github.io/react-uod-cal/?s=" + this.state.matric, "_self")
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
    return (
      <div>
        <p>{this.state.calendar == null ? "Enter Matric" : ""}</p>
        <Calendar
          localizer={localizer}
          events={this.state.calendar == null ? [] : this.state.calendar}
          startAccessor="start"
          endAccessor="end"
          style={this.state.calendar == null ? { display: "none" } : { height: 700 }}
        />
        <div className="matric-input" style={this.state.calendar != null ? { display: "none" } : {}}>
          <input onChange={event => this._HandleChange(event.target.value)}
            onKeyDown={evnt => this._HandleInput(evnt)}
          ></input>
          <button onClick={() => this.openUrl()}>
            submit
        </button>
        </div>
      </div>
    )
  }
  tableToJson(table) {
    var data = [];

    // first row needs to be headers
    var headers = [];
    for (var i = 0; i < table.rows[0].cells.length; i++) {
      headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
    }

    // go through cells
    for (var i = 1; i < table.rows.length; i++) {

      var tableRow = table.rows[i];
      var rowData = {};

      for (var j = 0; j < tableRow.cells.length; j++) {

        rowData[headers[j]] = tableRow.cells[j].innerHTML;

      }

      data.push(rowData);
    }

    return data;
  }

  parseTimetable(days) {
    console.log(days)
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
        var returnArray = []
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
    var week1 = new Date(2020, 9, 5)
    for (let x = 0; x < days.length; x++) {
      let dayAdd = x
      for (let y = 0; y < days[x].length; y++) {
        var cur = days[x][y]

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
          var weeksSplit = cur.weeks.split(",")
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
          let curDate = addDays(week1, ((weeksForEvent[i] - 1) * 7))
          curDate = addDays(curDate, dayAdd)
          //curDate = week1
          var moduleName = cur.activity.includes("AC31008") ? "Networks and Data Communications" : cur.activity.includes("AC31012") ? "Information Security" : "Database Systems"
          var startHours = parseTime(cur.start)
          var start = addMinutes(curDate, startHours[0] * 60)
          start = addMinutes(start, startHours[1])
          var endHours = parseTime(cur.end)
          var end = addMinutes(curDate, endHours[0] * 60)
          end = addMinutes(end, endHours[1])
          var event = {
            title: cur.type + " | " + moduleName + " | " + cur.activity.split(" ")[0],
            start: start,
            end, end,
            allDay: false,
          };
          events.push(event)
        }

      }
    }
    console.log(events)
    return events
  }
  getTimetable(matric) {
    var hostname = 'https://timetable.dundee.ac.uk'
    var port = '8084'
    var path = '/reporting/textspreadsheet?objectclass=student+set&idtype=id&identifier='
    var path2 = "/1&t=SWSCUST+student+set+textspreadsheet&days=1-7&weeks=13-23&periods=1-28&template=SWSCUST+student+set+textspreadsheet"
    var cors = "https://cors-anywhere.herokuapp.com/"
    cors = "https://mysterious-everglades-22580.herokuapp.com/"
    cors = "https://cors-spooky.herokuapp.com/"
    cors = "https://secret-chamber-30285.herokuapp.com/"
    var fullURL = hostname + ':' + port + path + matric + path2
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", cors + fullURL, false); // false for synchronous request
    xmlHttp.send();
    //console.log(xmlHttp.responseText)
    var raw = xmlHttp.responseText
    raw = raw.split(`<p><span class='labelone'>Monday</span></p>`)[1]
    if (raw == undefined) {
      return
    }
    raw = raw.split(`<p><span class='labelone'>Saturday</span></p>`)[0]
    //console.log(raw)
    var days = raw.split('</span></p>')
    var daysJSON = []
    for (let x = 0; x < days.length; x++) {
      console.log(x + 1)
      //console.log(days[x])
      if (days[x].includes(`<p><span class='labelone'`)) {
        days[x] = days[x].split('</table>')[0]
      }
      //console.log(mapDOM(days[x],true))
      var parser = new DOMParser();
      var doc = parser.parseFromString(days[x], 'text/html');
      // console.log(doc.body.firstChild)
      // console.log(this.tableToJson(doc.body.firstChild))
      daysJSON.push(this.tableToJson(doc.body.firstChild))

    }
    console.log(daysJSON)
    let temp = this.parseTimetable(daysJSON)
    this.setState({ "calendar": temp })

  }
  componentDidMount() {
    console.log(window.location.search)
    this.getTimetable(window.location.search.split("=")[1])
  }
}
