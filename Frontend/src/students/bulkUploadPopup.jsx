import { useState } from "react";
import API_URL from '../config/api';

export default function BulkUploadPopup({ onClose, onSuccess }) {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("assignment");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    formData.append("category", category);
    formData.append("description", description);

    try {
      const res = await fetch(
        `${API_URL}/student/assignments/bulk-upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-full max-w-xl rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-md">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Bulk Upload</h2>
            <p className="text-sm text-gray-400">Upload multiple assignments at once</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition">
            ✕
          </button>
        </div>

        {!summary ? (
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Common Description</label>
              <textarea
                rows={3}
                placeholder="Briefly describe these submissions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  >
                    <option value="assignment" className="bg-gray-900">Assignment</option>
                    <option value="thesis" className="bg-gray-900">Thesis</option>
                    <option value="report" className="bg-gray-900">Report</option>
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Files ({files.length}/5)</label>
                  <div className="relative h-[48px]">
                    <input
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={(e) => setFiles([...e.target.files])}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute inset-0 flex items-center px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                       {files.length > 0 ? `${files.length} files selected` : "Choose PDF files..."}
                    </div>
                  </div>
               </div>
            </div>

            <button
              type="submit"
              disabled={loading || files.length === 0}
              className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${loading || files.length === 0
                  ? "bg-purple-600/30 text-white/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:scale-95"
                }`}
            >
              {loading
                ? `Uploading ${files.length} assignments...`
                : `Upload ${files.length > 0 ? `(${files.length})` : ""}`
              }
            </button>

            {message && (
              <p className="text-sm text-red-400 text-center font-medium">
                {message}
              </p>
            )}
          </form>
        ) : (
          /* Summary */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-emerald-400 text-xl font-bold">✓</span>
               </div>
               <h3 className="text-xl font-bold text-white">
                  Success!
               </h3>
            </div>

            <p className="text-gray-400 mb-4">Successfully uploaded {summary.length} assignments.</p>

            <ul className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {summary.map((a, idx) => (
                <li
                  key={idx}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center"
                >
                  <span className="text-sm font-medium text-gray-200">{a.title}</span>
                  <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">Ready</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onClose}
              className="mt-6 w-full py-4 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
