const pool = require('./dbPool');

// Optional tone parameter to adjust prompt
const VALID_TONES = ['formal', 'friendly', 'concise'];

// System prompt as a seperate constant instead of inside the API call makes it easier to review, edit or test
// It was structured based on non-generic proper cover letters written for actual job applications tailored based on company name, job role, notes. 
const SYSTEM_PROMPT = `You are an expert career coach and professional writer 
specialising in job applications. Your task is to write a tailored cover letter 
based on the specific job details provided.

Rules you must follow:
- Use the company name, role title and any notes naturally throughout the letter.
- Never write a generic letter - every sentence should feel specific to this application.
- Do not include placeholder text like [Your Name] or [Date] - write the body paragraphs only.
- Structure: opening hook that references the specific role and company, 
  one paragraph on relevant skills/experience, one paragraph on why this 
  company specifically, closing paragraph with a call to action.
- Keep it to 3-4 paragraphs maximum.`;

// Adjust tone of the cover letter as either formal, friendly or concise 
// Each tone gives a different output based on sentence length and structure.
function getToneInstruction(tone) {
  switch (tone) {
    case 'formal':
      return `Tone: Write in a formal, professional register. Use full sentences, 
avoid contractions (use "I am" not "I'm") and maintain a structured, 
measured voice throughout. Prioritise clarity and professionalism.`;

    case 'friendly':
      return `Tone: Write in a warm, friendly and conversational tone. 
Use natural language and contractions. Genuine enthusiasm for the role 
and company should come through. Sound like a real person, not a template.`;

    case 'concise':
      return `Tone: Write as concisely as possible. Maximum 3 short paragraphs. 
Cut every word that does not add meaning. No filler phrases. 
Respect the reader's time - make every sentence earn its place.`;

    default:
      return `Tone: Write in a clear, professional tone suitable for a job application.`;
  }
}

// Generate cover letter function
async function generateCoverLetter(req, res) {
  const { id } = req.params;
  const { tone } = req.body;

  // Check if tone is valid
  if (tone !== undefined && !VALID_TONES.includes(tone)) {
    return res.status(400).json({
      error: `Invalid tone. Must be one of: ${VALID_TONES.join(', ')}`,
    });
  }

  // Fetch job from the database for the prompt to use
  let job;
  try {
    // Get job based on ID
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
    // No job found that matches id 
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Job with id ${id} not found.` });
    }
    // Get job application data
    job = result.rows[0];
  } catch (err) {
    console.error('Database error fetching job for cover letter:', err.message);
    return res.status(500).json({ error: 'Failed to fetch job details.' });
  }

  // Build prompt using actual job fields and tone
  const toneInstruction = getToneInstruction(tone || 'formal');
  const userPrompt = `Please write a cover letter for the following job application:

Company: ${job.company}
Role: ${job.role}
${job.notes ? `Additional notes: ${job.notes}` : ''}

${toneInstruction}`;

  // Fetch Groq API through groq api key - use try/catch to handle API errors
  // Groq exposes an OpenAI-compatible REST API
  try {
    // Send json data message to Groq's server address
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        // Sends Groq message/request by converting json data to string that can travel across the internet
        body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        // message passes conversation history to AI
        // System sets behavious of AI as SYSTEM_PROMPT
        // User sets the user's question as userPrompt
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        // max_toxens sets the maximum length of AI's outputs
        max_tokens: 600,
        // temperature sets AI's creativity to 0.7 which is balanced
        temperature: 0.7,
      }),
    });

    // Return error without crashing the server when api is not available
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      console.error('Groq API error response:', errBody);

      if (response.status === 401) {
        return res.status(500).json({ error: 'AI API key is invalid or missing.' });
      }

      if (response.status === 429) {
        return res.status(429).json({ error: 'AI rate limit reached. Please try again shortly.' });
      }

      return res.status(503).json({
        error: 'Cover letter generation is currently unavailable. Please try again later.',
      });
    }

    // Get generated cover letter result
    const data = await response.json(); // Converts AI data into javascript object (json) - easier to read 
    // Get cover letter from the nested folder structure that most AI's use to send back response
    // Data - AI's entire response object
    // Choices[0] - Selects first answer from list of alternative answers generated by AI 
    // Gets the message part from choices, content gets the only the text string response - no extra AI response and trim any extra empty spaces or blank lines 
    const coverLetter = data.choices[0].message.content.trim();
    return res.status(200).json({ coverLetter }); // Returns cover letter as json to be displayed

  } catch (err) {
    // Unable to reach Groq 
    console.error('Failed to reach Groq API:', err.message);
    return res.status(503).json({
      error: 'AI Cover letter generation is currently unavailable. Please try again later.',
    });
  }
}

// Export generateCoverLetter function
module.exports = { generateCoverLetter };