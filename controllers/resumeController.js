const { extractText } = require('../utils/parser');
const aiService = require('../services/aiService');

const analyzeResumeController = async (req, res) => {
  try {
    // 1. Validate Input
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }

    const { jobRole, jobDescription } = req.body;
    if (!jobRole || !jobDescription) {
      return res.status(400).json({ error: 'Job role and description are required.' });
    }

    const fileBuffer = req.file.buffer;
    const mimetype = req.file.mimetype;

    // 2. Extract Text
    const resumeText = await extractText(fileBuffer, mimetype);

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({ error: 'Could not extract sufficient text from the resume.' });
    }

    // 3. Call AI Service
    const analysisReport = await aiService.analyzeResume(jobRole, jobDescription, resumeText);

    // 4. Return Response
    return res.status(200).json({
      success: true,
      data: analysisReport,
    });
  } catch (error) {
    console.error('Error in analyzeResumeController:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while analyzing the resume.',
    });
  }
};

module.exports = {
  analyzeResumeController,
};
