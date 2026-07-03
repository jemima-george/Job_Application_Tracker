import { useState, useEffect } from 'react';

// Import JobList.jsx, JobForm.jsx 
import JobList from './JobList';
import JobForm from './JobForm';

// API call func from api.js
import { fetchJobs, createJob, updateJobStatus, deleteJob } from './api';

// Each useState creates a local state of the input value 
function App() {
  const [jobs, setJobs] = useState([]); // jobs array 
  const [loading, setLoading] = useState(true); // default state of loading is true
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false); // default state to show form is false

  // Use effect runs load jobs func when the page first loads 
  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    setError(''); // clear old errors
    try {
      // fetch jobs in database
      const data = await fetchJobs();
      setJobs(data); // set jobs that is already in the database
    } catch (err) {
      setError('Could not load job applications. Please try again.');
    } finally {
      setLoading(false); // set loading as false
    }
  }

  async function handleAddJob(newJob) {
    try {
      const created = await createJob(newJob);
      setJobs((prev) => [created, ...prev]); // add the new job created into previous job list
      setShowForm(false); // set show form as false after adding new job
    } catch (err) {
      setError('Could not add job application. Please try again.');
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      const updated = await updateJobStatus(id, newStatus);
      setJobs((prev) => prev.map((job) => (job.id === id ? updated : job))); // map prev list of jobs by id and update job status
    } catch (err) {
      setError('Could not update job status. Please try again.');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((job) => job.id !== id)); // filter to keep the prev list of jobs except for the deleted job id
    } catch (err) {
      setError('Could not delete job application. Please try again.');
    }
  }

  return (
    // Main Display Page
    <div className="app">
      <div className="app-header">
        <h1>Job Application Tracker</h1>
        <button onClick={() => setShowForm(true)}>+ Add Job</button>
      </div>

      {/* Show error found */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      {/* Display Job list on Page */}
      {loading ? (
        <p className="loading-state">Loading job applications...</p>
      ) : (
        <JobList jobs={jobs} onStatusChange={handleStatusChange} onDelete={handleDelete} />
      )}

      {/* Display Job form on Page on add job button click*/}
      {showForm && <JobForm onSubmit={handleAddJob} onClose={() => setShowForm(false)} />}
    </div>
  );
}

// Export app component for main.jsx
export default App;