const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data'); // <-- ADD THIS

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/scan-food', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;

    // ✅ Convert to multipart/form-data for FastAPI
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const fastapiResponse = await axios.post(
      'http://localhost:8001/analyze-food',
      formData,
      {
        headers: {
          ...formData.getHeaders(), // required to set proper Content-Type with boundary
        },
      }
    );

    res.json(fastapiResponse.data);
  } catch (err) {
    console.error('Error forwarding image to FastAPI:', err.message);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

module.exports = router;
