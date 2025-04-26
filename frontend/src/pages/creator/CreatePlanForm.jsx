// components/CreatePlanForm.jsx
import { useState } from "react";

const CreatePlanForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    planName: "",
    goal: "",
    description: "",
    difficulty: "",
    totalDuration: "7 days",
    tags: [],
    image: null,
    videoPreview: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    const res = await fetch("/api/workoutPlans/create", {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      const plan = await res.json();
      onNext(plan._id); // go to stage 2
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <input name="planName" placeholder="Plan Name" onChange={handleChange} />
      <select name="goal" onChange={handleChange}>
        <option>Weight Loss</option>
        <option>Weight Gain</option>
        <option>Maintenance</option>
      </select>
      <textarea name="description" placeholder="Description" onChange={handleChange} />
      <select name="difficulty" onChange={handleChange}>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <input name="videoPreview" placeholder="Intro Video Link" onChange={handleChange} />
      <button onClick={handleSubmit}>Next →</button>
    </div>
  );
};

export default CreatePlanForm;
