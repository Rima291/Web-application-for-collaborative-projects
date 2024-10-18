import React, { useState, useEffect } from 'react';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import DashboardResponsable from './dashboardResponsable';
import { enUS } from 'date-fns/locale';
import { Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

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

const CalendrierRes = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/events');
        const eventData = await response.json();
        setEvents(eventData.map(event => ({
          ...event,
          color: getRandomColor()
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

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        await fetch(`http://localhost:5000/events/delete/${selectedEvent._id}`, {
          method: 'DELETE',
        });
        setEvents(prevEvents => prevEvents.filter((e) => e._id !== selectedEvent._id));
        handleCloseDialog();
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
      <DashboardResponsable />
      <div style={{ height: '500px', width: '1000px', marginLeft: '400px' }}>
        <Typography variant="h4" style={{ marginTop: '-30px', marginBottom: '30px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#3C91E6', marginLeft: '200px' }}>
          Planifier des Evénements
        </Typography>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor={(event) => new Date(event.start)}
          endAccessor={(event) => new Date(event.end)}
          defaultView={Views.WEEK}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => ({ style: { backgroundColor: event.color } })}
          resizable
          selectable
        />
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Supprimer l'événement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer cet événement ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteEvent} color="secondary">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CalendrierRes;
