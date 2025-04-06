import axios from 'axios';

export const analyzeFoodImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("http://127.0.0.1:8000/analyze-image/", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};
