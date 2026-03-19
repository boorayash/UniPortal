import { useState } from "react";
import API_URL from '../config/api';

export default function UploadAssignmentPopup({ onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("assignment");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please upload a PDF file");
      return;
    }

    setLoading(true);
    setMessage(""); // Clear old messages

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("file", file);

    try {
      const res = await fetch(
        `${API_URL}/student/assignments/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: formData
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Assignment uploaded successfully");
        onSuccess?.();
        setTimeout(() => onClose(), 1500); // Close after showing success
      } else {
        setMessage(data.message || "Upload failed");
      }
    } catch (err) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-full max-w-lg rounded-2xl p-6 border border-white/10">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload Assignment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded bg-white/10"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded bg-white/10"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded bg-white/10"
          >
            <option value="assignment">Assignment</option>
            <option value="thesis">Thesis</option>
            <option value="report">Report</option>
          </select>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl transition ${loading
                ? "bg-blue-600/50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

          {message && (
            <p className="text-sm text-green-400 text-center">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
