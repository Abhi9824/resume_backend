const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Normalizes extracted text: removes extra spaces, breaks, etc.
 */
const normalizeText = (text) => {
  return text
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
    .trim();
};

/**
 * Extracts text from a buffer (PDF or DOCX).
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - Mime type of the file
 * @returns {Promise<string>} - Extracted and normalized text
 */
const extractText = async (buffer, mimetype) => {
  try {
    let rawText = '';

    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      rawText = data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      const data = await mammoth.extractRawText({ buffer: buffer });
      rawText = data.value;
    } else {
      throw new Error('Unsupported file format. Please upload PDF or DOCX.');
    }

    return normalizeText(rawText);
  } catch (error) {
    if (error.message && error.message.includes('bad XRef entry')) {
      console.error('PDF Parsing Error: The file appears to have a malformed cross-reference table (bad XRef entry).');
      throw new Error('This PDF file is malformed or corrupted. Please try re-saving it or using a different PDF.');
    }
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from document. Please ensure the file is not corrupted.');
  }
};

module.exports = {
  extractText,
};
