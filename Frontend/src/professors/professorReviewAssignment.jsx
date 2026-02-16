import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfessorReuse from "./professorReuse";
import AuthUserBadge from "../components/AuthUserBadge";

export default function ReviewAssignment() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [signature, setSignature] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/professor/assignments/${id}/review`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setData(await res.json());
  };

  /* ---------------- Approve ---------------- */
  const approve = async () => {
    if (!signature.trim()) {
      alert("Please enter your digital signature");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/professor/assignments/${id}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ remarks, signature })
      }
    );

    const result = await res.json();

    if (res.ok) {
      alert("Assignment approved successfully");
      window.location.href = "/professor/dashboard";
    } else {
      alert(result.message || "Approval failed");
    }
  };

  /* ---------------- Reject ---------------- */
  const reject = async () => {
    if (!remarks || remarks.trim().length < 10) {
      alert("Please enter at least 10 characters of feedback");
      return;
    }

    const confirmReject = window.confirm(
      "Are you sure you want to reject this assignment?"
    );
    if (!confirmReject) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/professor/assignments/${id}/reject`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ remarks })
      }
    );

    const result = await res.json();

    if (res.ok) {
      alert("Assignment rejected and feedback sent to student");
      window.location.href = "/professor/dashboard";
    } else {
      alert(result.message || "Rejection failed");
    }
  };

  if (!data) return <p className="text-white p-10">Loading...</p>;

  /* ✅ FIX: derive filename correctly */
  // const filename = data.filePath.split("/").pop();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <ProfessorReuse />

      <div className="flex-1 p-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Review Assignment</h1>
          <AuthUserBadge />
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Info label="Student" value={data.studentName} />
          <Info label="Assignment" value={data.title} />
          <Info label="Status" value={data.status} badge />
          <Info
            label="Submitted On"
            value={new Date(data.submittedAt).toLocaleDateString()}
          />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left */}
          <div className="lg:col-span-1 space-y-6">
            <Card title="Description">
              <p className="text-gray-300 text-sm leading-relaxed">
                {data.description}
              </p>
            </Card>

            <Card title="Remarks">
              <textarea
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter remarks for student..."
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
              />
            </Card>

            <Card title="Digital Signature">
              <input
                placeholder="Type your full name"
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3"
                value={signature}
                onChange={e => setSignature(e.target.value)}
              />
            </Card>
          </div>

          {/* Right */}
          <div className="lg:col-span-2">
            <Card title="Assignment File Preview">
              <iframe
                src={`http://localhost:5000/files/${data.filename}`}
                className="w-full h-[520px] rounded-xl border border-white/20 bg-black"
                title="Assignment Preview"
              />
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={approve}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold"
          >
            ✓ Approve Assignment
          </button>

          <button
            onClick={reject}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold"
          >
            ✕ Reject Assignment
          </button>
        </div>

      </div>
    </div>
  );
}

/* ---------- UI Helpers ---------- */

function Card({ title, children }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Info({ label, value, badge }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
      <p className="text-xs text-gray-400 uppercase">{label}</p>
      {badge ? (
        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm capitalize">
          {value}
        </span>
      ) : (
        <p className="mt-2 font-semibold text-white">{value}</p>
      )}
    </div>
  );
}



// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import ProfessorReuse from "./professorReuse";
// import AuthUserBadge from "../components/AuthUserBadge";

// export default function ReviewAssignment() {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [remarks, setRemarks] = useState("");
//   const [signature, setSignature] = useState("");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const token = localStorage.getItem("token");
//     const res = await fetch(
//       `http://localhost:5000/professor/assignments/${id}/review`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setData(await res.json());
//   };

//   /* ---------------- Approve ---------------- */
//   const approve = async () => {
//     if (!signature.trim()) {
//       alert("Please enter your digital signature");
//       return;
//     }

//     const token = localStorage.getItem("token");

//     const res = await fetch(
//       `http://localhost:5000/professor/assignments/${id}/approve`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ remarks, signature })
//       }
//     );

//     const result = await res.json();

//     if (res.ok) {
//       alert("Assignment approved successfully");
//       window.location.href = "/professor/dashboard";
//     } else {
//       alert(result.message || "Approval failed");
//     }
//   };

//   /* ---------------- Reject ---------------- */
//   const reject = async () => {
//     if (!remarks || remarks.trim().length < 10) {
//       alert("Please enter at least 10 characters of feedback");
//       return;
//     }

//     const confirmReject = window.confirm(
//       "Are you sure you want to reject this assignment?"
//     );
//     if (!confirmReject) return;

//     const token = localStorage.getItem("token");

//     const res = await fetch(
//       `http://localhost:5000/professor/assignments/${id}/reject`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ remarks })
//       }
//     );

//     const result = await res.json();

//     if (res.ok) {
//       alert("Assignment rejected and feedback sent to student");
//       window.location.href = "/professor/dashboard";
//     } else {
//       alert(result.message || "Rejection failed");
//     }
//   };

//   if (!data) return <p className="text-white p-10">Loading...</p>;

//   const filename = data.filePath.split("/").pop();

//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
//       <ProfessorReuse />

//       <div className="flex-1 p-10">

//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">Review Assignment</h1>
//           <AuthUserBadge />
//         </div>

//         {/* Info cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <Info label="Student" value={data.studentName} />
//           <Info label="Assignment" value={data.title} />
//           <Info label="Status" value={data.status} badge />
//           <Info
//             label="Submitted On"
//             value={new Date(data.submittedAt).toLocaleDateString()}
//           />
//         </div>

//         {/* Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* Left */}
//           <div className="lg:col-span-1 space-y-6">

//             <Card title="Description">
//               <p className="text-gray-300 text-sm leading-relaxed">
//                 {data.description}
//               </p>
//             </Card>

//             <Card title="Remarks">
//               <textarea
//                 rows={4}
//                 className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 placeholder="Enter remarks for student..."
//                 value={remarks}
//                 onChange={e => setRemarks(e.target.value)}
//               />
//             </Card>

//             <Card title="Digital Signature">
//               <input
//                 placeholder="Type your full name"
//                 className="w-full bg-white/10 border border-white/20 rounded-xl p-3"
//                 value={signature}
//                 onChange={e => setSignature(e.target.value)}
//               />
//             </Card>
//           </div>

//           {/* Right */}
//           <div className="lg:col-span-2">
//             <Card title="Assignment File Preview">
//               <iframe
//                 src={`http://localhost:5000/files/${filename}`}
//                 className="w-full h-[520px] rounded-xl border border-white/20 bg-black"
//                 title="Assignment Preview"
//               />
//             </Card>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="mt-8 flex gap-4">
//           <button
//             onClick={approve}
//             className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold"
//           >
//             ✓ Approve Assignment
//           </button>

//           <button
//             onClick={reject}
//             className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold"
//           >
//             ✕ Reject Assignment
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// /* ---------- UI Helpers ---------- */

// function Card({ title, children }) {
//   return (
//     <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
//       <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase">
//         {title}
//       </h3>
//       {children}
//     </div>
//   );
// }

// function Info({ label, value, badge }) {
//   return (
//     <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
//       <p className="text-xs text-gray-400 uppercase">{label}</p>
//       {badge ? (
//         <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm capitalize">
//           {value}
//         </span>
//       ) : (
//         <p className="mt-2 font-semibold text-white">
//           {value}
//         </p>
//       )}
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import ProfessorReuse from "./professorReuse";
// import AuthUserBadge from "../components/AuthUserBadge";

// export default function ReviewAssignment() {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [remarks, setRemarks] = useState("");
//   const [signature, setSignature] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState("review");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const token = localStorage.getItem("token");
//     const res = await fetch(
//       `http://localhost:5000/professor/assignments/${id}/review`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setData(await res.json());
//   };

//   const requestOtp = async () => {
//     const token = localStorage.getItem("token");
//     await fetch(
//       `http://localhost:5000/professor/assignments/${id}/request-otp`,
//       { method: "POST", headers: { Authorization: `Bearer ${token}` } }
//     );
//     setStep("otp");
//   };

//   const approve = async () => {
//     const token = localStorage.getItem("token");
//     await fetch(
//       `http://localhost:5000/professor/assignments/${id}/approve`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ remarks, signature, otp })
//       }
//     );
//     alert("Assignment approved");
//   };

//   const reject = async () => {
//   if (!remarks || remarks.trim().length < 10) {
//     alert("Please enter at least 10 characters of feedback");
//     return;
//   }

//   const confirmReject = window.confirm(
//     "Are you sure you want to reject this assignment?"
//   );
//   if (!confirmReject) return;

//   const token = localStorage.getItem("token");

//   const res = await fetch(
//     `http://localhost:5000/professor/assignments/${id}/reject`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ remarks })
//     }
//   );

//   const data = await res.json();

//   if (res.ok) {
//     alert("Assignment rejected and feedback sent to student");
//     window.location.href = "/professor/dashboard";
//   } else {
//     alert(data.message || "Rejection failed");
//   }
// };


//   if (!data) return <p className="text-white p-10">Loading...</p>;

//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      
//       <ProfessorReuse />

//       <div className="flex-1 p-10">

//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">
//             Review Assignment
//           </h1>
//           <AuthUserBadge />
//         </div>

//         {/* Info cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <Info label="Student" value={data.studentName} />
//           <Info label="Assignment" value={data.title} />
//           <Info label="Status" value={data.status} badge />
//           <Info
//             label="Submitted On"
//             value={new Date(data.submittedAt).toLocaleDateString()}
//           />
//         </div>

//         {/* Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* Left */}
//           <div className="lg:col-span-1 space-y-6">

//             <Card title="Description">
//               <p className="text-gray-300 text-sm leading-relaxed">
//                 {data.description}
//               </p>
//             </Card>

//             <Card title="Remarks">
//               <textarea
//                 rows={4}
//                 className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 placeholder="Enter remarks for student..."
//                 value={remarks}
//                 onChange={e => setRemarks(e.target.value)}
//               />
//             </Card>

//             {step === "otp" && (
//               <Card title="Verification">
//                 <input
//                   placeholder="Digital Signature (type your name)"
//                   className="w-full bg-white/10 border border-white/20 rounded-xl p-2 mb-3"
//                   value={signature}
//                   onChange={e => setSignature(e.target.value)}
//                 />
//                 <input
//                   placeholder="Enter OTP"
//                   className="w-full bg-white/10 border border-white/20 rounded-xl p-2"
//                   value={otp}
//                   onChange={e => setOtp(e.target.value)}
//                 />
//               </Card>
//             )}
//           </div>

//           {/* Right */}
//           <div className="lg:col-span-2">
//             <Card title="Assignment File Preview">
//               <iframe
//                 src={`http://localhost:5000/${data.filePath}`}
//                 className="w-full h-[520px] rounded-xl border border-white/20 bg-black"
//                 title="Assignment Preview"
//               />
//             </Card>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="mt-8 flex gap-4">
//           {step === "review" ? (
//             <button
//               onClick={requestOtp}
//               className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold"
//             >
//               ✓ Approve Assignment
//             </button>
//           ) : (
//             <button
//               onClick={approve}
//               className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold"
//             >
//               Confirm Approval
//             </button>
//           )}

//           <button
//            onClick={reject}
//            className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold">
//             ✕ Reject Assignment
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// /* ---------- UI Helpers ---------- */

// function Card({ title, children }) {
//   return (
//     <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
//       <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase">
//         {title}
//       </h3>
//       {children}
//     </div>
//   );
// }

// function Info({ label, value, badge }) {
//   return (
//     <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
//       <p className="text-xs text-gray-400 uppercase">{label}</p>
//       {badge ? (
//         <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm capitalize">
//           {value}
//         </span>
//       ) : (
//         <p className="mt-2 font-semibold text-white">
//           {value}
//         </p>
//       )}
//     </div>
//   );
// }
