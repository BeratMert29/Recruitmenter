import React from 'react';
import './RecruiterDashboard.css';
import { jobs as mockJobs } from '../../data/mockJobs';
import { events as mockEvents } from '../../data/mockEvents';

const stats = [
    { label: 'Active Roles', value: mockJobs.length, trend: '+2 open this week' },
    { label: 'Applicants', value: '128', trend: '+18% vs last week' },
];

const actionItems = [
    { title: 'Review new CV submissions', due: 'Today, 14:00', type: 'priority' },
    { title: 'Send feedback to interview panel', due: 'Today, 17:30', type: 'normal' },
    { title: 'Publish Sales Lead role', due: 'Tomorrow, 10:00', type: 'normal' },
];

const RecruiterDashboard = () => {
    const upcomingEvents = mockEvents.slice(0, 3);
    const featuredRoles = mockJobs.slice(0, 4);

    return (
        <div className="recruiter-dashboard">
            <header className="recruiter-dashboard__header">
                <div>
                    <p className="eyebrow">Recruiter workspace</p>
                    <h1>Morning overview</h1>
                    <p className="subtitle">
                        Keep hiring momentum by tracking progress, applications, and events in one place.
                    </p>
                </div>
                <a className="cta-button" href="/recruiter/job-posting">+ Create Job</a>
            </header>

            <section className="stats-grid">
                {stats.map((stat) => (
                    <article key={stat.label} className="stat-card">
                        <p>{stat.label}</p>
                        <strong>{stat.value}</strong>
                        <span>{stat.trend}</span>
                    </article>
                ))}
            </section>

            <section className="recruiter-dashboard__grid">
                <article className="card events-card">
                    <div className="card-header">
                        <h2>Upcoming events</h2>
                        <a href="/recruiter/events">Manage</a>
                    </div>
                    <ul className="event-list">
                        {upcomingEvents.map((event) => (
                            <li key={event.id}>
                                <div>
                                    <h3>{event.title}</h3>
                                    <p>{new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
                                </div>
                                <p className="event-description">{event.description}</p>
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="card actions-card">
                    <div className="card-header">
                        <h2>Action items</h2>
                        <small>Stay focused on today’s priorities</small>
                    </div>
                    <ul className="action-list">
                        {actionItems.map((item) => (
                            <li key={item.title} className={item.type === 'priority' ? 'priority' : ''}>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.due}</p>
                                </div>
                                <button>Open</button>
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="card roles-card">
                    <div className="card-header">
                        <h2>Highlighted roles</h2>
                        <a href="/recruiter/job-posting">View all</a>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Deadline</th>
                            </tr>
                        </thead>
                        <tbody>
                            {featuredRoles.map((role) => (
                                <tr key={role.id}>
                                    <td>{role.title}</td>
                                    <td>{role.location}</td>
                                    <td>{role.type}</td>
                                    <td>{role.deadline || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </article>
            </section>
        </div>
    );
};

export default RecruiterDashboard;

