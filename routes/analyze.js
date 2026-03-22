const express = require('express');
const multer = require('multer');
const { analyzeResumeController } = require('../controllers/resumeController');

const router = express.Router();

// Define multer storage in memory (we parse streams directly)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/msword'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'), false);
    }
  },
});

// POST /api/analyze-resume
router.post('/analyze-resume', upload.single('resume'), analyzeResumeController);

module.exports = router;
