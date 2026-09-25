import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({ open, title, message, confirmLabel = "Confirm", danger = true, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
        <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${danger ? "bg-red-50" : "bg-blue-50"}`}>
          <AlertTriangle className={`w-5 h-5 ${danger ? "text-danger" : "text-primary"}`} />
        </div>
        <h3 className="text-navy font-semibold mb-1.5">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn-outline text-sm">Cancel</button>
          <button
            onClick={onConfirm}
            className={`text-sm font-medium px-4 py-2.5 rounded-lg text-white transition-colors ${danger ? "bg-danger hover:bg-red-700" : "bg-primary hover:bg-primary-hover"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
