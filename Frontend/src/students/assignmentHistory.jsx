export default function AssignmentHistory({ assignment }) {
  const events = [];

  /* ---------------- Build timeline events ---------------- */

  // Initial submission
  if (assignment.submittedAt) {
    events.push({
      label: "Submitted",
      type: "submitted",
      date: new Date(assignment.submittedAt)
    });
  }

  // Review actions (approved / rejected)
  assignment.reviewHistory?.forEach(h => {
    events.push({
      label: h.action === "rejected" ? "Rejected" : "Approved",
      type: h.action,
      date: new Date(h.actedAt),
      remarks: h.remarks,
      by: h.by // populated { name, role }
    });
  });

  // 🔥 Explicit resubmission (OPTION A – correct)
  if (assignment.resubmittedAt && assignment.submittedAt) {
    events.push({
      label: "Resubmitted",
      type: "resubmitted",
      date: new Date(assignment.resubmittedAt)
    });
  }

  // Sort everything chronologically
  events.sort((a, b) => a.date - b.date);

  /* ---------------- Render ---------------- */

  return (
    <div className="bg-black/30 backdrop-blur-xl border-t border-white/20 px-8 py-6 animate-slideDown">

      <h4 className="text-sm font-semibold text-gray-300 mb-4">
        Assignment History
      </h4>

      <div className="relative space-y-6 pl-6">

        {/* Vertical timeline line */}
        <div className="absolute left-3 top-2 bottom-2 w-px bg-white/20 animate-timeline-line" />

        {events.map((e, i) => {
          const isLatest = i === events.length - 1;

          return (
            <div key={i} className="flex gap-4 items-start">

              {/* Timeline dot */}
              <div
                style={{ animationDelay: `${i * 80}ms` }}
                className={`
                    relative z-10 mt-1 rounded-full flex-shrink-0
                    transition-all duration-300
                    animate-fadeIn
                    ${
                    isLatest
                        ? "w-3 h-3 ring-4 ring-white/20"
                        : "w-2.5 h-2.5 opacity-70"
                    }
                    ${
                    e.type === "approved"
                        ? "bg-green-400"
                        : e.type === "rejected"
                        ? "bg-red-400"
                        : e.type === "resubmitted"
                        ? "bg-purple-400"
                        : "bg-yellow-400"
                    }
                `}
                />


              {/* Content */}
              <div>
                <p
                  className={`text-sm font-medium ${
                    isLatest ? "text-white" : "text-gray-300"
                  }`}
                >
                  {e.label}
                  {e.by && (
                    <span className="text-xs text-gray-400 font-normal">
                      {" "}by {e.by.name} ({e.by.role})
                    </span>
                  )}
                </p>

                <p className="text-xs text-gray-400">
                  {e.date.toLocaleString()}
                </p>

                {e.remarks && (
                  <p className="mt-1 text-sm text-gray-300">
                    “{e.remarks}”
                  </p>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
