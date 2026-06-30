const VALID_STATUSES = ['applied', 'interviewing', 'offered', 'rejected'];

// Check whether job status is valid
function validateJobCreate(req, res, next) {
  const { company, role, status, applied_date } = req.body;
  const errors = [];

  // Check if company is not null and is a string
  if (!company || typeof company !== 'string' || !company.trim()) {
    errors.push('company is required and must be a non-empty string.');
  }

  // Check if role is not null and is a string
  if (!role || typeof role !== 'string' || !role.trim()) {
    errors.push('role is required and must be a non-empty string.');
  }

  // Check if status is valid and not null
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  // Check if applied date is not null and in correct format
  if (!applied_date || isNaN(Date.parse(applied_date))) {
    errors.push('applied_date is required and must be a valid date (YYYY-MM-DD).');
  }

  // Continue if there are no errors
  if (errors.length > 0) return res.status(400).json({ error: errors.join(' ') });
  next();
}


// Check if job update is valid
function validateJobUpdate(req, res, next) {
  const { company, role, status, applied_date, notes } = req.body;

  // Check if all job update body values are not null 
  if ([company, role, status, applied_date, notes].every(value => value === undefined)) {
    return res.status(400).json({ error: 'Request body must include at least one field to update.' });
  }

  // Check if job update status is valid and not null
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  // Check if job updated company is not null and is a string
  if (company !== undefined && (typeof company !== 'string' || !company.trim())) {
    return res.status(400).json({ error: 'company must be a non-empty string.' });
  }

  // Check if job updated role is not null and is a string
  if (role !== undefined && (typeof role !== 'string' || !role.trim())) {
    return res.status(400).json({ error: 'role must be a non-empty string.' });
  }

  // Check if job updated applied date is not null and in correct format
  if (applied_date !== undefined && isNaN(Date.parse(applied_date))) {
    return res.status(400).json({ error: 'applied_date must be a valid date (YYYY-MM-DD).' });
  }
  next();
}

// Check if job id is positive integer
function validateIdParam(req, res, next) {
  // Use regular expression to check if id has one or more digit 
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({ error: 'id must be a positive integer.' });
  }
  next();
}

// Export valid job statuses and functions
module.exports = { VALID_STATUSES, validateJobCreate, validateJobUpdate, validateIdParam };