const buildAnalyzerPrompt = (jobRole, jobDescription, resumeText) => {
  return `You are an expert technical recruiter and ATS system.
Analyze the following resume for a specific job role.
Your task is to evaluate the resume exclusively using the job description provided.

Job Role:
${jobRole}

Job Description:
${jobDescription}

Resume Text:
${resumeText}

Perform a full analysis and return a structured JSON response. Valid, parseable JSON only. Do not wrap in markdown tags like \`\`\`json. 

Return data in the EXACT following JSON format:

{
  "ats_score": 0,
  "match_score": 0,
  "detected_skills": ["skill1", "skill2"],
  "missing_skills": ["skill3"],
  "keyword_analysis": {
    "present_keywords": ["keyword1"],
    "missing_keywords": ["keyword2"]
  },
  "section_feedback": {
    "summary": "Feedback on summary",
    "experience": "Feedback on experience",
    "projects": "Feedback on projects",
    "skills": "Feedback on skills"
  },
  "resume_issues": [
    "Issue 1",
    "Issue 2"
  ],
  "bullet_point_improvements": [
    {
      "original": "Original bullet from resume",
      "improved": "Improved bullet with metrics and impact"
    }
  ],
  "suggested_resume_summary": "A suggested professional summary...",
  "recruiter_feedback": "Overall feedback as a recruiter...",
  "overall_recommendations": [
    "Recommendation 1"
  ]
}

Important rules:
- Evaluate like a real ATS.
- Penalize resumes missing measurable achievements.
- Check if bullet points show impact.
- Identify missing technical keywords.
- Suggest improved bullet points with metrics if possible.
- Output MUST be valid JSON.
`;
};

module.exports = {
  buildAnalyzerPrompt,
};
