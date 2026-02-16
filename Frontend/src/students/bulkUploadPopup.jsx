import { useState } from "react";

export default function BulkUploadPopup({ onClose, onSuccess }) {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("assignment");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setMessage("Please select at least one PDF");
      return;
    }

    if (files.length > 5) {
      setMessage("You can upload maximum 5 files");
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    formData.append("category", category);
    formData.append("description", description);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/student/assignments/bulk-upload",
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSummary(data.assignments);
        onSuccess?.();
      } else {
        setMessage(data.message || "Bulk upload failed");
      }
    } catch {
      setMessage("Server error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-full max-w-xl rounded-2xl p-6 border border-white/10">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Bulk Upload Assignments</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {!summary ? (
          <form onSubmit={handleSubmit} className="space-y-4">

            <textarea
              placeholder="Common description"
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
              multiple
              onChange={(e) => setFiles([...e.target.files])}
              className="text-sm"
            />

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Upload {files.length > 0 && `(${files.length})`}
            </button>

            {message && (
              <p className="text-sm text-red-400 text-center">
                {message}
              </p>
            )}
          </form>
        ) : (
          /* Summary */
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Upload Summary
            </h3>

            <ul className="space-y-2">
              {summary.map((a) => (
                <li
                  key={a.id}
                  className="p-3 rounded-lg bg-black/30 border border-white/10"
                >
                  {a.title}
                </li>
              ))}
            </ul>

            <button
              onClick={onClose}
              className="mt-4 w-full py-2 bg-emerald-600 rounded-xl"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
