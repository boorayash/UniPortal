import { useState } from "react";

export default function EditResubmitPopup({ assignment, onClose, onSuccess }) {
  const [description, setDescription] = useState(assignment.description);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    const res = await fetch(
      `http://localhost:5000/student/assignments/${assignment._id}/resubmit`,
      {
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify({ description })
      }
    );

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Assignment updated. Please submit again.");
      onSuccess();
      onClose();
    } else {
      alert(data.message || "Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-lg text-white">

        <h2 className="text-xl font-bold mb-4">
          Edit Rejected Assignment
        </h2>

        <textarea
          rows={5}
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-xl p-3 mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 rounded"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
