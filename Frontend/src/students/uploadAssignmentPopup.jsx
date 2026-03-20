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
          <h2 className="text-xl font-bold text-white">Upload Assignment</h2>
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
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="assignment" className="bg-gray-900">Assignment</option>
            <option value="thesis" className="bg-gray-900">Thesis</option>
            <option value="report" className="bg-gray-900">Report</option>
          </select>

          <div className="p-4 border-2 border-dashed border-white/20 rounded-xl bg-white/5 flex flex-col items-center">
             <input
               type="file"
               accept="application/pdf"
               onChange={(e) => setFile(e.target.files[0])}
               className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-200 hover:file:bg-blue-600/30"
             />
             <p className="mt-2 text-xs text-gray-500">PDF files only, max 10MB</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${loading
                ? "bg-blue-600/30 text-white/50 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95"
              }`}
          >
            {loading ? "Uploading..." : "Upload Assignment"}
          </button>

          {message && (
            <p className={`text-sm text-center font-medium ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
