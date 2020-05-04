const express = require('express');
const Sequelize = require('sequelize');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
const router = express.Router();
const sequelize = new Sequelize('sqlite::memory:');

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}


const Special_Days = sequelize.define('SpecialDays', {
  // Model attributes are defined here
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  miliseconds: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false
  }
}, {
  // Other model options go here
});

Special_Days.sync()
function add_special_day(date_year, date_month, date_day, date_name) {
  let event = new Date(date_year, date_month - 1, date_day).getTime()
  const event_build = Special_Days.create({ miliseconds: event, name: date_name })
  return event_build.miliseconds
}

// =================== Liste des jours =================== 
let sunday_rameaux = add_special_day(2020, 4, 5, "Sunday of Rameaux")
let easter = add_special_day(2020, 4, 12, "Easter")
let may_1 = add_special_day(2020, 5, 1, "1st may")
let ascension = add_special_day(2020, 5, 21, "Ascension")
let pentecost = add_special_day(2020, 5, 31, "Pentecost")
let mothers_day = add_special_day(2020, 6, 7, "Mothers_day")
let fathers_day = add_special_day(2020, 6, 7, "Fathers_day")
let summer = add_special_day(2020, 6, 21, "Summer")
let kiss_day = add_special_day(2020, 7, 6, "Kiss_day")
let love_day = add_special_day(2020, 8, 9, "Love_day")
let assomption = add_special_day(2020, 8, 15, "Assomption")
let halloween = add_special_day(2020, 10, 31, "Halloween")
let toussaint = add_special_day(2020, 11, 1, "Toussaint")
let armistice = add_special_day(2020, 11, 11, "Armistice")
let winter = add_special_day(2020, 12, 11, "Winter")
let December_25 = add_special_day(2020, 12, 25, "Christmas")

router.get('/', function (req, res, next) {

  //  =================== Aujourd'hui =================== 
  let today = new Date();
  let today_mili = today.getTime();
  let day = today.getDate();
  let min = ("0" + (today.getMinutes())).slice(-2);
  let month = ("0" + (today.getMonth() + 1)).slice(-2);
  let year = today.getFullYear();


  //  =================== Tests =================== 
  let number_day = 0
  if (day == 1) {
    number_day = day + 'st'
  } else if (day == 2) {
    number_day = day + 'nd'
  } else if (day == 3) {
    number_day = day + 'rd'
  } else {
    number_day = day + 'th'
  }
  var mydate = new Date(today_mili);
  var mois = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"][mydate.getMonth()];
  var jour = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][mydate.getDay()];

  console.log('Day: ', jour);

  console.log('Month: ', mois);

  console.log('Year: ', mydate.getFullYear());

  console.log("Hours: ", mydate.getHours());

  console.log("Mitutes: ", mydate.getMinutes());

  console.log(mydate.toString("MMMM yyyy"));

  let date = jour + ', ' + mois + ' ' + number_day + ', ' + mydate.getFullYear() + ' at ' + mydate.getHours() + 'H' + min

  // =================== Affichage =================== 
  function affichage(time_left, name_of_day, date_event) {
    res.render('index', { title: 'Special Days', time: time_left, date: date, name_of_day: name_of_day, date_event_format: date_event }, function (err, html) {
      res.send(html);
    });
  }

  //  =================== Calcul temps restant =================== 

  function searchAfterEvent(table) {
    let minimalTime = 99999999999999;
    let currentEvent = 0;
    table.forEach(element => {
      if (minimalTime > element.miliseconds && today_mili < element.miliseconds) {
        minimalTime = element.miliseconds
        currentEvent = element
      }
    });
    return currentEvent
  }

  function getDateEvent(date_event) {
    let date_day = new Date(date_event).getDate();
    let date_month = new Date(date_event).getMonth();
    let date_month_with_0 = ("0" + (date_month + 1)).slice(-2);
    let date_year = new Date(date_event).getFullYear();
    let date_event_format = `${date_month_with_0}/${date_day}/${date_year}`
    return date_event_format
  }

  function searchSelectedEvent(table) {
    let currentEvent = 0;
    table.forEach(element => {
      if (req.param("event_selected") == (element.name).toLowerCase()) {
        currentEvent = element;
      }
    })
    return currentEvent;
  }

  async function showAfterEvent() {
    const table = await Special_Days.findAll({
      where: {

      }
    })
    const days = JSON.parse(JSON.stringify(table, null, 2))

    let eventTest = req.param("event_selected")


    let event = eventTest ? searchSelectedEvent(days) : searchAfterEvent(days);


    let date_event_format = getDateEvent(event.miliseconds)
    affichage(event.miliseconds - today_mili, event.name, date_event_format) // Si je met time_left ça me met une erreur
    setTimeout(function () { }, event.miliseconds);
  }

  showAfterEvent()
});

module.exports = router;