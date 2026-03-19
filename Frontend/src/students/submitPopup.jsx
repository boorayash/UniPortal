import { useEffect, useState } from "react";
import API_URL from '../config/api';

export default function SubmitForReviewPopup({ assignmentId, onClose, onSuccess }) {
  const [professors, setProfessors] = useState([]);
  const [reviewer, setReviewer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    const res = await fetch(`${API_URL}/student/professors`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await res.json();
    setProfessors(data || []);
  };

  const handleSubmit = async () => {
    if (!reviewer) return alert("Please select a professor");

    setLoading(true);

    const res = await fetch(`${API_URL}/student/assignments/${assignmentId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ reviewerId: reviewer })
    }
    );

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      onSuccess();
      onClose();
    } else {
      alert(data.message || "Submission failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-white/10">

        <h2 className="text-xl font-bold mb-4">
          Submit for Review
        </h2>

        <select
          value={reviewer}
          onChange={(e) => setReviewer(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded bg-white/10"
        >
          <option value="">Select Professor</option>
          {professors.map(p => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.email})
            </option>
          ))}
        </select>

        <p className="text-sm text-gray-400 mb-4">
          Once submitted, you cannot edit this assignment.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 rounded"
          >
            {loading ? "Submitting..." : "Confirm Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
