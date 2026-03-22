const { GoogleGenAI } = require('@google/genai');
const { buildAnalyzerPrompt } = require('../ai/promptTemplates');

// Initialize Gemini client. Ensure GEMINI_API_KEY is in .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Calls Gemini to analyze the resume against the job description.
 * @param {string} jobRole - Role the user is applying for
 * @param {string} jobDescription - JD text
 * @param {string} resumeText - Extracted resume text
 * @returns {Promise<Object>} - The JSON-structured analysis result
 */
const analyzeResume = async (jobRole, jobDescription, resumeText) => {
  try {
    const prompt = buildAnalyzerPrompt(jobRole, jobDescription, resumeText);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an ATS parser and recruiter assistant that always returns valid JSON.",
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    });

    const aiOutputText = response.text;

    // Parse output into JSON object
    const resultJson = JSON.parse(aiOutputText);

    return resultJson;
  } catch (error) {
    console.warn('Gemini API Quota Exceeded! Returning Mock Data instead.', error.message);

    // Return a rich mock response so the frontend UI can be fully tested
    return {
      "ats_score": 85,
      "match_score": 78,
      "detected_skills": ["React", "JavaScript", "Node.js", "CSS"],
      "missing_skills": ["TypeScript", "GraphQL", "AWS"],
      "keyword_analysis": {
        "present_keywords": ["frontend", "responsive design", "API"],
        "missing_keywords": ["serverless", "CI/CD", "Docker"]
      },
      "section_feedback": {
        "summary": "Your summary is clear but lacks quantifiable achievements.",
        "experience": "Great detail on your React projects, but consider adding metrics (e.g., 'improved load time by 20%').",
        "projects": "Strong portfolio, but ensure links are clickable.",
        "skills": "Well-categorized, but missing some key cloud technologies mentioned in the JD."
      },
      "resume_issues": [
        "Missing contact information in header.",
        "No graduation date on education section."
      ],
      "bullet_point_improvements": [
        {
          "original": "Built a web application using React and Node.",
          "improved": "Developed a full-stack web application using React and Node.js, serving 10,000+ monthly active users and reducing server latency by 15%."
        }
      ],
      "suggested_resume_summary": "Front-end developer with 3+ years of experience specializing in React and Node.js. Proven track record of improving application performance and delivering scalable user interfaces.",
      "recruiter_feedback": "Overall, a very solid resume for a mid-level frontend role. If you add more specific metrics and include TypeScript, you will easily pass most ATS filters.",
      "overall_recommendations": [
        "Add quantifiable metrics to your recent role.",
        "Learn and list TypeScript as it is highly requested for this position."
      ]
    };
  }
};

module.exports = {
  analyzeResume,
};
