import React, { useState, useEffect } from "react";
import axios from "axios";
import {API_ENDPOINT} from "./constant";

function Events() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registrationError, setRegistrationError] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(API_ENDPOINT + "/events");
            setEvents(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchEventById = async (eventId) => {
        try {
            const response = await axios.get(
                API_ENDPOINT + `/events/${eventId}`
            );
            setSelectedEvent(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createEvent = async (eventData) => {
        try {
            const response = await axios.post(
                API_ENDPOINT + "/events",
                eventData
            );
            setEvents((prevEvents) => [...prevEvents, response.data]);
        } catch (error) {
            console.error(error);
        }
    };

    const updateEvent = async (eventId, eventData) => {
        try {
            const response = await axios.put(
                API_ENDPOINT + `/events/${eventId}`,
                eventData
            );
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event._id === response.data._id ? response.data : event
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            await axios.delete(API_ENDPOINT + `/events/${eventId}`);
            setEvents((prevEvents) =>
                prevEvents.filter((event) => event._id !== eventId)
            );
            setSelectedEvent(null);
        } catch (error) {
            console.error(error);
        }
    };

    const registerForEvent = async (eventId) => {
        try {
            await axios.post(API_ENDPOINT + `/events/registration/${eventId}`);
            fetchEventById(eventId);
        } catch (error) {
            console.error(error);
            setRegistrationError("Failed to register for the event.");
        }
    };

    const removeRegistration = async (eventId) => {
        try {
            await axios.put(API_ENDPOINT + `/events/registration/${eventId}`);
            fetchEventById(eventId);
        } catch (error) {
            console.error(error);
            setRegistrationError(
                "Failed to remove registration from the event."
            );
        }
    };

    return (
        <div>
            <h2>Events</h2>
            <ul>
                {events.map((event) => (
                    <li key={event._id}>
                        <h3>{event.name}</h3>
                        <p>{event.description}</p>
                        <button onClick={() => fetchEventById(event._id)}>
                            View Details
                        </button>
                        {selectedEvent && selectedEvent._id === event._id && (
                            <div>
                                <p>Event Details:</p>
                                <p>Date: {selectedEvent.date}</p>
                                <p>Location: {selectedEvent.location}</p>
                                {registrationError && (
                                    <p style={{ color: "red" }}>
                                        {registrationError}
                                    </p>
                                )}
                                {selectedEvent.registrationClosed ? (
                                    <p>Registration Closed</p>
                                ) : (
                                    <>
                                        {!selectedEvent.registeredStudents.includes(
                                            "<user_id>"
                                        ) ? (
                                            <button
                                                onClick={() =>
                                                    registerForEvent(event._id)
                                                }>
                                                Register
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    removeRegistration(
                                                        event._id
                                                    )
                                                }>
                                                Remove Registration
                                            </button>
                                        )}
                                        {/* Additional JSX for event registration */}
                                    </>
                                )}
                                <button onClick={() => deleteEvent(event._id)}>
                                    Delete Event
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <h3>Create Event</h3>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const eventData = {
                        name: e.target.name.value,
                        description: e.target.description.value,
                        date: e.target.date.value,
                        location: e.target.location.value,
                    };
                    createEvent(eventData);
                    e.target.reset();
                }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Event Name"
                    required
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Event Description"
                    required
                />
                <input type="date" name="date" required />
                <input
                    type="text"
                    name="location"
                    placeholder="Event Location"
                    required
                />
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
}

export default Events;
