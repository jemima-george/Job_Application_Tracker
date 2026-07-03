// Connect to backend endpoints

const BASE_URL = 'http://localhost:3000';

// Checks fetch results from the 4 fetch functions
async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function fetchJobs() {
  const res = await fetch(`${BASE_URL}/jobs`);
  return handleResponse(res);
}

export async function createJob(job) {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
  return handleResponse(res);
}

export async function updateJobStatus(id, status) {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function deleteJob(id) {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}

// Add cover letter fetch function
export async function generateCoverLetter(id, tone) {
  const res = await fetch(`${BASE_URL}/jobs/${id}/cover-letter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tone }),
  });
  return handleResponse(res);
}