// src/components/JobOpenings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { handleSuccess, handleError } from '../utils/utils';

const JobOpenings = ({ onCancel }) => {
  const [jobDetails, setJobDetails] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
  });

  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/jobs', jobDetails);
      handleSuccess('Job posted successfully!');
      setJobDetails({ title: '', description: '', company: '', location: '' });
      fetchJobs(); // Refresh list
      if (onCancel) onCancel();
    } catch (error) {
      handleError('Failed to post job. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 m-4">
      <h2 className="text-2xl font-bold mb-4 text-secondary">Post a Job</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700">Job Title</label>
          <input
            type="text"
            name="title"
            value={jobDetails.title}
            onChange={handleChange}
            required
            className="border rounded-lg w-full py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Company</label>
          <input
            type="text"
            name="company"
            value={jobDetails.company}
            onChange={handleChange}
            required
            className="border rounded-lg w-full py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={jobDetails.location}
            onChange={handleChange}
            required
            className="border rounded-lg w-full py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={jobDetails.description}
            onChange={handleChange}
            required
            className="border rounded-lg w-full py-2 px-3"
          />
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

      <h3 className="text-xl font-bold mb-4 text-secondary">Recent Job Openings</h3>
      {jobs.length > 0 ? (
        <ul>
          {jobs.map((job) => (
            <li key={job.id} className="mb-4 border border-gray-300 rounded-lg p-4 shadow-sm">
              <h4 className="text-lg font-semibold">{job.title}</h4>
              <p className="text-gray-600">{job.company} - {job.location}</p>
              <p className="text-gray-700 mt-2">{job.description}</p>
              <p className="text-xs text-gray-500 mt-2">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No job openings yet.</p>
      )}
    </div>
  );
};

export default JobOpenings;
