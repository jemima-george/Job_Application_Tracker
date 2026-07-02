const express = require('express');
const router = express.Router();

// Import job application functions
const { createJob, getJobs, getJobById, updateJob, deleteJob } = require('./jobsController');
const { validateJobCreate, validateJobUpdate, validateIdParam } = require('./validateJob');

// Import generateCoverLetter function from coverLetter.js
const { generateCoverLetter } = require('./coverLetter');

// Routes

//Post Job application
router.post('/', validateJobCreate, createJob);

// Get Job applications
router.get('/', getJobs);

// Get Job application by ID
router.get('/:id', validateIdParam, getJobById);

// Update Job application by ID
router.patch('/:id', validateIdParam, validateJobUpdate, updateJob);

// Delete Job application by ID
router.delete('/:id', validateIdParam, deleteJob);

// Generate AI Cover Letter
router.post('/:id/cover-letter', generateCoverLetter);

// Export router
module.exports = router;