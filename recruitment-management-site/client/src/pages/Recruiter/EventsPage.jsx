import React, { useEffect, useState } from 'react';
import './EventsPage.css';
import { eventsAPI } from '../../api/api';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [form, setForm] = useState({
        id: null,
        title: '',
        date: '',
        description: '',
    });

    // Fetch events from database
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await eventsAPI.getAll();
                if (response.success) {
                    setEvents(response.events);
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const resetForm = () => {
        setForm({ id: null, title: '', date: '', description: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const newForm = {
                ...prev,
                [name]: value,
            };
            // Ensure id is preserved
            if (name !== 'id') {
                newForm.id = prev.id;
            }
            return newForm;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!form.title || !form.date) {
            setMessage({ type: 'error', text: 'Please provide a title and date.' });
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            console.log('Submitting with form.id:', form.id);

            if (form.id) {
                // Update existing event
                const response = await eventsAPI.update(form.id, {
                    title: form.title,
                    date: form.date,
                    description: form.description,
                }, user.id);

                if (response.success) {
                    setEvents((prev) =>
                        prev.map((event) =>
                            event._id === form.id ? response.event : event
                        )
                    );
                    setMessage({ type: 'success', text: 'Event updated successfully!' });
                } else {
                    setMessage({ type: 'error', text: response.message || 'Failed to update event' });
                }
            } else {
                // Create new event
                const response = await eventsAPI.create({
                    title: form.title,
                    date: form.date,
                    description: form.description,
                    createdBy: user.id,
                });

                if (response.success) {
                    setEvents((prev) => [...prev, response.event]);
                    setMessage({ type: 'success', text: 'Event created successfully!' });
                }
            }

            resetForm();
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to save event' });
        }
    };

    const handleEdit = (eventData) => {
        // Format date for input field (YYYY-MM-DD)
        const dateStr = new Date(eventData.date).toISOString().split('T')[0];
        const eventId = eventData._id || eventData.id;

        console.log('Setting form.id to:', eventId);

        setForm({
            id: eventId,
            title: eventData.title,
            date: dateStr,
            description: eventData.description || '',
        });

        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (eventId) => {
        console.log('Deleting event with ID:', eventId);

        if (window.confirm('Delete this event?')) {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const response = await eventsAPI.delete(eventId, user.id);
                if (response.success) {
                    setEvents((prev) => prev.filter((event) => (event._id || event.id) !== eventId));
                    if (form.id === eventId) {
                        resetForm();
                    }
                    setMessage({ type: 'success', text: 'Event deleted successfully!' });
                } else {
                    setMessage({ type: 'error', text: response.message || 'Failed to delete event' });
                }
            } catch (error) {
                setMessage({ type: 'error', text: error.message || 'Failed to delete event' });
            }
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="events-page">
            <header>
                <div>
                    <p className="eyebrow">Recruiter control center</p>
                    <h1>Manage Events</h1>
                    <p className="subtitle">Create, update, and curate what candidates see in their dashboards.</p>
                </div>
                <a className="link-button" href="/dashboard">
                    View applicant view
                </a>
            </header>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="events-layout">
                <form className="event-form" onSubmit={handleSubmit}>
                    <h2>{form.id ? 'Update Event' : 'Create Event'}</h2>
                    <label>
                        <span>Event title</span>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g., Product Hiring Fair"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        <span>Event date</span>
                        <input type="date" name="date" value={form.date} onChange={handleChange} required />
                    </label>
                    <label>
                        <span>Description</span>
                        <textarea
                            name="description"
                            rows="4"
                            placeholder="Add context, agenda, or call-to-action"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </label>
                    <div className="form-actions">
                        {form.id && (
                            <button type="button" className="ghost-button" onClick={resetForm}>
                                Cancel edit
                            </button>
                        )}
                        <button type="submit" className="btn-primary">
                            {form.id ? 'Save changes' : 'Add event'}
                        </button>
                    </div>
                </form>

                <section className="event-list">
                    <div className="list-header">
                        <h2>Upcoming Events ({events.length})</h2>
                        <small>Events appear instantly on candidate dashboards.</small>
                    </div>
                    {isLoading ? (
                        <div className="empty-card">Loading events...</div>
                    ) : events.length === 0 ? (
                        <div className="empty-card">No events scheduled yet.</div>
                    ) : (
                        <ul>
                            {events
                                .slice()
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .map((event) => (
                                    <li key={event._id}>
                                        <div>
                                            <h3>{event.title}</h3>
                                            <p>{formatDate(event.date)}</p>
                                            {event.description && <small>{event.description}</small>}
                                        </div>
                                        <div className="event-actions">
                                            <button type="button" onClick={() => handleEdit(event)}>
                                                Edit
                                            </button>
                                            <button type="button" className="danger" onClick={() => handleDelete(event._id || event.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
};

export default EventsPage;
