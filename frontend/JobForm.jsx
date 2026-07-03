import { useState } from 'react'; // Store the input field value locally

const VALID_STATUSES = ['applied', 'interviewing', 'offered', 'rejected'];

// Handles new job application form on submit and on close
function JobForm({ onSubmit, onClose }) {
  // Each useState creates a local state of the input value in form
  // Current input value of company is set stored in setCompany
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('applied');
  const [appliedDate, setAppliedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Ensure all fields are added
  function validate() {
    if (!company.trim()) return 'Company is required.';
    if (!role.trim()) return 'Role is required.';
    if (!VALID_STATUSES.includes(status)) return 'Status must be one of: applied, interviewing, offered, rejected.';
    if (!appliedDate) return 'Applied date is required.';
    return '';
  }

  // Checks if field inputs are valid after submitting
  function handleSubmit(e) {
    // Prevents browser's default behavious of reloading page after submission
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    // No error in input fields
    setFormError('');
    // Submit new job application fields
    onSubmit({ company, role, status, applied_date: appliedDate, notes});
  }

  return (
    // Create Job form view
    <div className="overlay">
      <div className="modal">
        <h2>Add Job Application</h2>
        {/* Show form error if input fields are not valid */}
        {formError && <p className="form-error">{formError}</p>}

        {/* Handles submit on submit button click */}
        <form onSubmit={handleSubmit}>

          {/* Form Input fields */}
          <div className="field">
            <label>Company</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>

          <div className="field">
            <label>Role</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} />
          </div>

          <div className="field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {VALID_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Applied Date</label>
            <input type="date" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} />
          </div>

          <div className="field">
            <label>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {/* Submit or Cancel new job application */}
          <div className="form-actions">
            <button type="submit">Add Job</button>
            <button type="button" id="cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobForm;