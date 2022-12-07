import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

function CalendarComponent() {
    // Start week on Monday
    moment.locale('ko', {
        week: {
            dow: 1,
            doy: 1,
        },
    });
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = () => {
    fetch("https://customerrest.herokuapp.com/gettrainings")
      .then((response) => response.json())
      .then((data) => {
        const fetchData = data;
        const trainings = [];
        // Käydään läpi jokainen
        for (let i = 0; i < fetchData.length; i++) {
          const training = {};
          training.title = `${fetchData[i].activity} / ${fetchData[i].customer.firstname} ${fetchData[i].customer.lastname}`;
          training.start = new Date(fetchData[i].date);
          // Lopetusaika saadaan lisäämällä kesto aloitusaikaan
          training.end = new Date(
            moment(fetchData[i].date)
              .add(fetchData[i].duration, "minutes")
              .format()
          );
          // Lisätään käsitelty data taulukkoon.
          trainings.push(training);
        }
        // Asetetaan tapahtumiin taulukko
        setEvents(trainings);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ marginTop: 10 }}>
      <Calendar
        localizer={localizer}
        events={events}
        style={{ height: 800, width: "99%", margin: "auto" }}
      />
    </div>
  );
}

export default CalendarComponent;
