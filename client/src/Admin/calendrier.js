import React, { useEffect, useState } from 'react';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Dashboard from './dashboardAdmin';
import { Typography } from '@mui/material';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calendrier = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/events');
        const eventsData = await response.json();
        // Ajout d'une couleur aléatoire à chaque événement
        const eventsWithColors = eventsData.map(event => ({
          ...event,
          color: getRandomColor(),
        }));
        setEvents(eventsWithColors);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  const getRandomColor = () => {
    // Génère une couleur aléatoire en format hexadécimal
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: event.color,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style
    };
  };

  return (
    <>
      <Dashboard/>
      <div style={{ height: '500px', width: '1000px', marginLeft: '400px' }}>
      <Typography variant="h4" style={{ marginTop: '-30px',marginBottom:'30px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#3C91E6', marginLeft: '300px' }}>
         Les Evénements 
        </Typography>       
         <Calendar
          localizer={localizer}
          events={events}
          startAccessor={(event) => new Date(event.start)}
          endAccessor={(event) => new Date(event.end)}
          defaultView={Views.WEEK}
          // Disable selection to prevent new event creation
          selectable={false}
          // No event deletion handler
          resizable
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </>
  );
};

export default Calendrier;
