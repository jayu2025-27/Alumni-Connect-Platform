// src/components/HostMentorship.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { handleSuccess, handleError } from '../utils/utils';

const HostMentorship = ({ onCancel }) => {
  const [mentorshipDetails, setMentorshipDetails] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
  });

  const [mentorships, setMentorships] = useState([]);

  const fetchMentorships = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/mentorships');
      setMentorships(response.data);
    } catch (error) {
      console.error('Error fetching mentorships:', error);
    }
  };

  useEffect(() => {
    fetchMentorships();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMentorshipDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/mentorships', mentorshipDetails);
      handleSuccess('Mentorship program hosted successfully!');
      setMentorshipDetails({ title: '', description: '', date: '', time: '' });
      fetchMentorships(); // Refresh list
      if (onCancel) onCancel();
    } catch (error) {
      handleError('Failed to host mentorship. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 m-4">
      <h2 className="text-2xl font-bold mb-4 text-secondary">Host a Mentorship</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700">Mentorship Title</label>
          <input
            type="text"
            name="title"
            value={mentorshipDetails.title}
            onChange={handleChange}
            required
            className="border rounded-lg w-full py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={mentorshipDetails.description}
            onChange={handleChange}
            required
            className="border rounded-lg w-full py-2 px-3"
          />
        </div>
        <div className="mb-4 flex space-x-2">
          <div className="flex-1">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={mentorshipDetails.date}
              onChange={handleChange}
              required
              className="border rounded-lg w-full py-2 px-3"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700">Time</label>
            <input
              type="time"
              name="time"
              value={mentorshipDetails.time}
              onChange={handleChange}
              required
              className="border rounded-lg w-full py-2 px-3"
            />
          </div>
        </div>
        <div className="flex justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="mr-2 px-4 py-2 bg-secondary text-white rounded-lg"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Submit
          </button>
        </div>
      </form>

      <h3 className="text-xl font-bold mb-4 text-secondary">Upcoming Mentorships</h3>
      {mentorships.length > 0 ? (
        <ul>
          {mentorships.map((m) => (
            <li key={m.id} className="mb-4 border border-gray-300 rounded-lg p-4 shadow-sm">
              <h4 className="text-lg font-semibold">{m.title}</h4>
              <p className="text-gray-600">{m.date} at {m.time}</p>
              <p className="text-gray-700 mt-2">{m.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No mentorship programs yet.</p>
      )}
    </div>
  );
};

export default HostMentorship;
