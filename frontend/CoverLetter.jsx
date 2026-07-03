import { useState } from 'react';
import { generateCoverLetter } from './api';

// Optional tone parameter to adjust prompt
const TONES = ['formal', 'friendly', 'concise'];

// Generate cover letter based on job 
function CoverLetter({ job, onClose }) {
  const [tone, setTone] = useState('formal'); // set default tone as formal
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false); // set default loading state as false
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);  // set default copy state as false

  // Handle generating AI cover letter on click
  async function handleGenerate() {
    setLoading(true); // set loading state as true on Generate button click
    setError('');
    setCoverLetter(''); // clear previous cover letter result if any
    setCopied(false); 
    try {
      // Call on generateCoverLetter function from api.js
      const data = await generateCoverLetter(job.id, tone);
      // Set cover letter result from data
      setCoverLetter(data.coverLetter);
    } catch (err) {
      setError(err.message || 'Failed to generate cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Handle copy to clipboard action
  async function handleCopy() {
    try {
      // Gets value stored in cover letter and writes it into system clipboard
      // navigator.clipboard - browser's clipboard api 
      // writeText - sends raw text directly to clipboard
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true); // set copied state as true
      // Reset Copied back to Copy to clipboard after 2 seconds by setting copied state back to false
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard.');
    }
  }

  return (
    // Create Cover letter display on UI 
    <div className="overlay">
      <div className="modal cover-letter-modal">
        <div className="cover-letter-header">
          <div>
            <h2>Cover Letter</h2>
            {/* Show job role and company for the row */}
            <p className="cover-letter-job-info">
              {job.role} at {job.company}
            </p>
          </div>
          {/* Close cover letter display */}
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="cover-letter-controls">
          {/* Select Tone options */}
          <div className="tone-selector">
            <label>Tone : </label>
            <div className="tone-buttons">
              {/* Map each tone as a button and make it active when selected */}
              {/* Set tone on tone button click and set tone button as disable while loading  */}
              {TONES.map((t) => (
                <button
                  key={t}
                  className={`tone-btn ${tone === t ? 'tone-btn-active' : ''}`}
                  onClick={() => setTone(t)}
                  disabled={loading}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Generate cover letter on button click and disable button while loading */}
          {/* Show loading while waiting for AI response */}
          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : coverLetter ? 'Regenerate' : 'Generate'}
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError('')}>✕</button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="cover-letter-loading">
            <p>Writing your cover letter...</p>
          </div>
        )}

        {/* Display cover letter generated after loading */}
        {/* Split cover letter text string based on line break \n  */}
        {/* Map through the new array of lines based on paragraph and index */}
        {/* If it cointains text after paragraph.trim(), display on UI */}
        {coverLetter && !loading && (
          <div className="cover-letter-result">
            <div className="cover-letter-text">
              {coverLetter.split('\n').map((paragraph, i) =>
                paragraph.trim() ? <p key={i}>{paragraph}</p> : null
              )}
            </div>

            {/* Copy to Clipboard button on click */}
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        )}

        {/* Empty state before first generation - no cover letter, not loading, no error */}
        {!coverLetter && !loading && !error && (
          <div className="cover-letter-empty">
            <p>Select a tone and click Generate to create your cover letter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Export cover letter function
export default CoverLetter;