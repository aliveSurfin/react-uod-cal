(this["webpackJsonpreact-uod-cal"]=this["webpackJsonpreact-uod-cal"]||[]).push([[0],{24:function(e,t,a){e.exports=a(42)},29:function(e,t,a){},33:function(e,t,a){},42:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(3),s=a.n(o),i=(a(29),a(17)),l=a(18),c=a(23),u=a(22),p=a(13),d=a(7),m=a.n(d);a(33);m.a.locale("en",{week:{dow:1,doy:1}});var h=Object(p.b)(m.a),v=a(34)({domain:"github.com/aliveSurfin/react-uod-cal",name:"react-uod-cal",prodId:{company:"github.com/aliveSurfin",product:"react-uod-cal"}}),f=!1;function w(e){for(var t=e.event,a="https://www.dundee.ac.uk/module/"+t.modcode,n=[],o=0;o<t.staff.length;o++)n.push(r.a.createElement("a",{href:t.staff[o].url}," ",t.staff[o].name," "));return r.a.createElement("div",{className:"event-wrapper"},r.a.createElement("div",{className:"event-type"},t.type),r.a.createElement("div",{className:"event-module"},r.a.createElement("a",{href:a},t.modcode," ",t.moduleName)),r.a.createElement("div",{className:"event-room"},"&nbsp;"===t.room?"n/a":t.room),r.a.createElement("div",{className:"event-staff"},n))}var g=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;Object(i.a)(this,a),n=t.call(this,e);var r=new Date;r.setHours(8,0,0);var o=new Date;return o.setHours(20,0,0),n.state={minTime:r,maxTime:o},n}return Object(l.a)(a,[{key:"openUrl",value:function(){void 0!==this.state.matric&&window.open(window.location.origin+window.location.pathname+"/?s="+this.state.matric,"_self")}},{key:"_HandleInput",value:function(e){"Enter"===e.key&&(console.log("hit"),this.openUrl())}},{key:"_HandleChange",value:function(e){console.log(e),this.setState({matric:e})}},{key:"render",value:function(){var e=this,t={agenda:{event:w}};return r.a.createElement("div",{id:"container"},f&&r.a.createElement("a",{download:"cal.ics",href:f},"Download iCal"),r.a.createElement("p",null,null==this.state.calendar?"Enter Matric":""),r.a.createElement(p.a,{components:t,localizer:h,events:null==this.state.calendar?[]:this.state.calendar,startAccessor:"start",endAccessor:"end",style:null==this.state.calendar?{display:"none"}:{height:700},defaultView:"agenda",min:this.state.minTime,max:this.state.maxTime,formats:{agendaHeaderFormat:function(e){var t=e.start,a=e.end;return m.a.utc(t).format("DD/MM/YYYY")+" - "+m.a.utc(a).format("DD/MM/YYYY")}}}),r.a.createElement("div",{className:"matric-input",style:null!=this.state.calendar?{display:"none"}:{}},r.a.createElement("form",null,r.a.createElement("input",{onChange:function(t){return e._HandleChange(t.target.value)},onKeyDown:function(t){return e._HandleInput(t)},name:"matriculation"}),r.a.createElement("button",{onClick:function(){return e.openUrl()},type:"submit"},"submit"))))}},{key:"tableToJson",value:function(e){var t=[];console.log(JSON.stringify(e));for(var a=[],n=0;n<e.rows[0].cells.length;n++)a[n]=e.rows[0].cells[n].innerHTML.toLowerCase().replace(/ /gi,"");for(var r=1;r<e.rows.length;r++){for(var o=e.rows[r],s={},i=0;i<o.cells.length;i++)s[a[i]]=o.cells[i].innerHTML;t.push(s)}return t}},{key:"parseTimetable",value:function(e){var t=[];function a(e,t){return new Date(e.getTime()+6e4*t)}function n(e){if(e.includes("-")){for(var t=e.split("-"),a=[],n=parseInt(t[0].trim());n<=parseInt(t[1].trim());n++)a.push(parseInt(n));return a}var r=[];return r.push(parseInt(e.trim())),r}function r(e){var t=e.split(":"),a=[];return a.push(parseInt(t[0].trim())),a.push(parseInt(t[1].trim())),a}function o(e,t){var a=new Date(e);return a.setDate(a.getDate()+t),a}for(var s=new Date(2020,9,5),i=new Date(2021,0,18),l={},c=0;c<e.length;c++)for(var u=c,p=0;p<e[c].length;p++){var d=e[c][p],m=d.activity.split(" ")[0];m.includes("/")?m=m.split("/")[0]:m.includes("-")&&(m=m.split("-")[0]);(m=m.replace(/[^0-9a-z]/gi,""))in l||(l[m]=this.getModuleInfo("https://www.dundee.ac.uk/module/"+m));var h=l[m],w=[];if(d.weeks.includes("-")&&d.weeks.includes(","))for(var g=d.weeks.split(","),y=0;y<g.length;y++)w=w.concat(n(g[y]));else if(d.weeks.includes(","))for(var k=d.weeks.split(","),b=0;b<k.length;b++)w=w.concat(n(k[b]));else w=(d.weeks.includes("-"),w.concat(n(d.weeks)));for(var E=0;E<w.length;E++){var T=void 0;w[E]>=12?(w[E]=w[E]-12,T=o(i,7*w[E])):T=o(s,7*(w[E]-1)),T=o(T,u);var D=r(d.start),M=a(T,60*D[0]);M=a(M,D[1]);var S=r(d.end),I=a(T,60*S[0]);I=a(I,S[1]);for(var H=d.staff.split(","),x=[],C=0;C<H.length;C+=2)x.push({name:H[C+1].trim()+" "+H[C].trim(),url:"https://www.dundee.ac.uk/people/"+H[C+1].trim()+"-"+H[C].trim()});var N={title:d.type+" | "+h,type:d.type,start:M,end:I,allDay:!1,moduleName:h,modcode:m,room:d.room,activity:d.activity,staff:x,duration:d.duration},Y={start:M,end:I,summary:N.type+" : "+h,description:N.activity,location:N.room};v.createEvent(Y),t.push(N)}}return f=v.toURL(),t}},{key:"getModuleInfo",value:function(e){var t=new XMLHttpRequest;return t.open("GET","https://secret-chamber-30285.herokuapp.com/"+e,!1),t.send(),t.responseText.split("<title>")[1].split("module")[0].trim()}},{key:"getTimetable",value:function(e){if(""!==e&&void 0!==e&&null!==e){"https://mysterious-everglades-22580.herokuapp.com/","https://cors-spooky.herokuapp.com/","https://secret-chamber-30285.herokuapp.com/";var t="https://timetable.dundee.ac.uk:8085/reporting/textspreadsheet?objectclass=student+set&idtype=id&identifier="+e+"/1&t=SWSCUST+student+set+textspreadsheet&days=1-7&weeks=1-52&periods=1-28&template=SWSCUST+student+set+textspreadsheet",a=new XMLHttpRequest;a.open("GET","https://secret-chamber-30285.herokuapp.com/"+t,!1),a.send();var n=a.responseText;if(void 0!==(n=n.split("<p><span class='labelone'>Monday</span></p>")[1])){for(var r=(n=n.split("<p><span class='labelone'>Saturday</span></p>")[0]).split("</span></p>"),o=[],s=0;s<r.length;s++){r[s].includes("<p><span class='labelone'")&&(r[s]=r[s].split("</table>")[0]);var i=(new DOMParser).parseFromString(r[s],"text/html");o.push(this.tableToJson(i.body.firstChild))}var l=this.parseTimetable(o);this.setState({calendar:l})}}}},{key:"componentDidMount",value:function(){console.log(window.location.search),this.getTimetable(window.location.search.split("=")[1])}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(g,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[24,1,2]]]);
//# sourceMappingURL=main.15f32603.chunk.js.map