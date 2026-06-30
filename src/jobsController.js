// Database connection pool
const pool = require('./dbPool');

// Insert Job application into Jobs table  
async function createJob(req, res) {
  const { company, role, status, applied_date, notes } = req.body;
  try {
    // Wait for database to process query
    // Add job body into jobs table based on index 
    // Coalesce function returns first agrument that is not null
    const result = await pool.query(
      `INSERT INTO jobs (company, role, status, applied_date, notes)
       VALUES ($1, $2, COALESCE($3::job_status, 'applied'), $4, $5)
       RETURNING *`,
      [company, role, status, applied_date, notes || null]
    ); 
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating job:', err.message);
    return res.status(500).json({ error: 'Failed to create job application.' });
  }
}

// Get applied jobs from Jobs Table
async function getJobs(req, res) {
  const { status } = req.query;
  try {
    // Either fetch jobs by specific job status or fetch all jobs
    const result = status
      ? await pool.query('SELECT * FROM jobs WHERE status = $1::job_status ORDER BY applied_date DESC, id DESC', [status])
      : await pool.query('SELECT * FROM jobs ORDER BY applied_date DESC, id DESC');
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    return res.status(500).json({ error: 'Failed to fetch job applications.' });
  }
}

// Get jobs by ID
async function getJobById(req, res) {
  // Get id as parameter from URL  
  const { id } = req.params;
  try {
    // Fetch all data from columns for the job where id matches 
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: `Job with id ${id} not found.` });
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching job:', err.message);
    return res.status(500).json({ error: 'Failed to fetch job application.' });
  }
}

// Update job application by ID
async function updateJob(req, res) {
  const { id } = req.params;
  const { company, role, status, applied_date, notes } = req.body;
  const fields = []; // Store SQL syntax strings like company = $1
  const values = []; //Store actual data updates
  let i = 1;  // Counter for SQL placeholders
  
  // Update job if request body is not null
  if (company !== undefined) { fields.push(`company = $${i++}`); values.push(company); }
  if (role !== undefined) { fields.push(`role = $${i++}`); values.push(role); }
  if (status !== undefined) { fields.push(`status = $${i++}::job_status`); values.push(status); }
  if (applied_date !== undefined) { fields.push(`applied_date = $${i++}`); values.push(applied_date); }
  if (notes !== undefined) { fields.push(`notes = $${i++}`); values.push(notes); }
  values.push(id);

  try {
    // Update only data of the fields that are updated 
    const result = await pool.query(
      `UPDATE jobs SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    // Job ID is not found
    if (result.rows.length === 0) return res.status(404).json({ error: `Job with id ${id} not found.` });
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating job:', err.message);
    return res.status(500).json({ error: 'Failed to update job application.' });
  }
}

// Delete job application by ID
async function deleteJob(req, res) {
  const { id } = req.params;
  try {
    // Delete the job where the id matches
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING id', [id]);
    // Job ID is not found
    if (result.rows.length === 0) return res.status(404).json({ error: `Job with id ${id} not found.` });
    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting job:', err.message);
    return res.status(500).json({ error: 'Failed to delete job application.' });
  }
}

// Export job application functions
module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };