// Display Jobs as a Table

import { useState } from 'react';

// Import cover letter.jsx
import CoverLetter from './CoverLetter.jsx';

const VALID_STATUSES = ['applied', 'interviewing', 'offered', 'rejected'];

// Handles status changes or job deletetion or cover letter generation in row
function JobRow({ job, onStatusChange, onDelete, onCoverLetter }) {
  // Changes status dropdown in row
  function handleStatusChange(e) {
    onStatusChange(job.id, e.target.value);
  }

  // Deletes job row on click
  function handleDeleteClick() {
    // Confirmation window to delete a job
    const confirmed = window.confirm(`Delete job application for ${job.role} at ${job.company}?`);
    if (confirmed) onDelete(job.id);
  }

  return (
    // Create Table row
    <tr>
      <td>{job.company}</td>
      <td>{job.role}</td>
      <td>
        <select value={job.status} onChange={handleStatusChange}>
          {VALID_STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </td>
      <td>{new Date(job.applied_date).toLocaleDateString()}</td>
      <td>
          <button className="cover-letter-btn" onClick={() => onCoverLetter(job)}>Cover Letter   
          <i class="fas fa-envelope"></i>
          </button>
      </td>
      <td>
          <button className="delete-btn" onClick={handleDeleteClick}><i class="fas fa-trash-alt"></i></button>
      </td>
    </tr>
  );
}

// All jobs from database
function JobList({ jobs, onStatusChange, onDelete }) {
  // Check if job's cover letter modal is open.
  // null means cover letter modal for specific job is not open.
  const [coverLetterJob, setCoverLetterJob] = useState(null);

  // No Job applications added to list
  if (jobs.length === 0) {
    return <p className="empty-state">No job applications yet. Click "Add Job" to get started.</p>;
  }

  return (
    // Create Table view
    <>
      <table className="job-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Applied Date</th>
            <th>Generate Cover Letter</th>
            <th>Delete</th>
          </tr>
        </thead>

        {/* Map each Job to JobRow with key as job id */}
        <tbody>
          {jobs.map((job) => (
            <JobRow key={job.id} job={job} onStatusChange={onStatusChange} onDelete={onDelete} onCoverLetter={(job) => setCoverLetterJob(job)}/>
          ))}
        </tbody>
      </table>

      {/* Render the cover letter modal when a job is selected from CoverLetter.jsx  */}
      {coverLetterJob && (
        <CoverLetter
          job={coverLetterJob}
          onClose={() => setCoverLetterJob(null)}
        />
      )}
    </>
  );
}

// Export JobList table format
export default JobList;