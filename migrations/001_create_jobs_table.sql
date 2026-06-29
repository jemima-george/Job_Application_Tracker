-- Jobs Table Format

-- Job status set based on the list: 'applied', 'interviewing', 'offered', 'rejected'
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status') THEN
    CREATE TYPE job_status AS ENUM ('applied', 'interviewing', 'offered', 'rejected');
  END IF;
END$$;

-- Create Job Table with fields and default status as applied
CREATE TABLE IF NOT EXISTS jobs (
  id            SERIAL PRIMARY KEY,
  company       VARCHAR(255) NOT NULL,
  role          VARCHAR(255) NOT NULL,
  status        job_status NOT NULL DEFAULT 'applied',
  applied_date  DATE NOT NULL,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for job status and jobs applied data
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_applied_date ON jobs (applied_date);