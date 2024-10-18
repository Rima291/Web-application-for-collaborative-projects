import React, { useState, useEffect } from 'react';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';

import { enUS } from 'date-fns/locale';
import DashboardRh from './dashboardRh';
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

const CalendrierRh = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/events');
        const eventData = await response.json();
        setEvents(eventData.map(event => ({
          ...event,
          color: getRandomColor() // Ajoute une couleur aléatoire à chaque événement
        })));
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchData();
  }, []);

  const handleSelectSlot = async ({ start, end }) => {
    const title = prompt('Entrez un nouveau titre d\'événement');
    if (title) {
      try {
        const response = await fetch('http://localhost:5000/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, start, end }),
        });
        const eventData = await response.json();
        setEvents([...events, { ...eventData, color: getRandomColor() }]);
      } catch (err) {
        console.error('Error creating event:', err);
      }
    }
  };

  const handleSelectEvent = async (event) => {
    const confirmDelete = window.confirm('Voulez-vous vraiment supprimer cet événement ?');
    if (confirmDelete) {
      try {
        await fetch(`http://localhost:5000/events/delete/${event._id}`, {
          method: 'DELETE',
        });
        // Filter out the deleted event from the events state
        setEvents(prevEvents => prevEvents.filter((e) => e._id !== event._id)); // Utilisation de la fonction de mise à jour fonctionnelle pour garantir la cohérence de l'état
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <>
         <DashboardRh/>
      <div style={{ height: '500px', width: '1000px', marginLeft: '400px' }}>
      <Typography variant="h4" style={{ marginTop: '-30px',marginBottom:'30px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#3C91E6', marginLeft: '200px' }}>
        Planifier des  Evénements
        </Typography>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor={(event) => new Date(event.start)}
          endAccessor={(event) => new Date(event.end)}
          defaultView={Views.WEEK}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => ({ style: { backgroundColor: event.color } })} // Définir la couleur de fond de l'événement
          resizable
          selectable
        />
      </div>
    </>
  );
};

export default CalendrierRh;

