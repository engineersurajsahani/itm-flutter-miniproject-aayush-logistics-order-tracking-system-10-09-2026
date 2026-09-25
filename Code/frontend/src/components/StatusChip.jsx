const styles = {
  Booked: "bg-slate-100 text-slate-600 border-slate-200",
  "Payment Verified": "bg-blue-50 text-blue-600 border-blue-200",
  "Picked Up": "bg-purple-50 text-purple-600 border-purple-200",
  "In Transit": "bg-amber-50 text-amber-600 border-amber-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-600 border-red-200",
  "Pending Verification": "bg-slate-100 text-slate-600 border-slate-200",
  Verified: "bg-blue-50 text-blue-600 border-blue-200",
  Rejected: "bg-red-50 text-red-600 border-red-200",
};

const dot = {
  Booked: "bg-slate-400",
  "Payment Verified": "bg-blue-500",
  "Picked Up": "bg-purple-500",
  "In Transit": "bg-amber-500",
  Delivered: "bg-green-600",
  Cancelled: "bg-red-500",
  "Pending Verification": "bg-slate-400",
  Verified: "bg-blue-500",
  Rejected: "bg-red-500",
};

const StatusChip = ({ status }) => {
  const style = styles[status] || "bg-slate-100 text-slate-600 border-slate-200";
  const dotColor = dot[status] || "bg-slate-400";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};

export default StatusChip;
