import { useEffect, useState } from "react";
import { UploadCloud, FileText, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/DashboardLayout";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";
import api from "../../api/axios";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace("/api", "");
const DOC_TYPES = ["Invoice", "Bill", "Delivery Receipt", "PDF Document"];

const AdminDocuments = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [docType, setDocType] = useState("Invoice");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    api.get("/orders", { params: { status: "Delivered" } })
      .then((res) => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedOrderId) { setDocuments([]); return; }
    api.get(`/documents/${selectedOrderId}`).then((res) => setDocuments(res.data.documents)).catch(console.error);
  }, [selectedOrderId]);

  const uploadFile = async (file) => {
    if (!selectedOrderId) return toast.error("Select a delivered order first");
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("documentType", docType);
      await api.post(`/documents/${selectedOrderId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Document uploaded");
      const res = await api.get(`/documents/${selectedOrderId}`);
      setDocuments(res.data.documents);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    uploadFile(e.dataTransfer.files[0]);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/documents/${deleteTarget}`);
      setDocuments(documents.filter((d) => d._id !== deleteTarget));
      toast.success("Document deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <DashboardLayout>
      <Header title="Document Management" subtitle="Upload Delivery Documents" />

      {loading ? (
        <Loader />
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card space-y-4">
            <h2 className="font-semibold text-navy">Select Delivered Order</h2>
            {orders.length === 0 ? (
              <EmptyState title="No delivered orders yet" subtitle="Documents can only be uploaded once an order is marked Delivered." />
            ) : (
              <>
                <select className="input-field" value={selectedOrderId} onChange={(e) => setSelectedOrderId(e.target.value)}>
                  <option value="">Choose an order</option>
                  {orders.map((o) => (
                    <option key={o._id} value={o._id}>{o.lrNumber} · {o.clientId?.name} · {o.pickupDetails.city} → {o.deliveryDetails.city}</option>
                  ))}
                </select>

                <div>
                  <label className="label-text">Document Type</label>
                  <select className="input-field" value={docType} onChange={(e) => setDocType(e.target.value)}>
                    {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <label
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg py-10 cursor-pointer transition-colors ${dragOver ? "border-primary bg-blue-50" : "border-slate-300 hover:bg-slate-50"}`}
                >
                  <UploadCloud className="w-7 h-7 text-slate-400" />
                  <p className="text-sm text-slate-500">{uploading ? "Uploading..." : "Drag & drop a file, or click to browse"}</p>
                  <p className="text-xs text-slate-400">PDF, JPG, PNG up to 10MB</p>
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => uploadFile(e.target.files[0])} />
                </label>
              </>
            )}
          </div>

          <div className="card">
            <h2 className="font-semibold text-navy mb-4">Uploaded Documents</h2>
            {!selectedOrderId ? (
              <p className="text-sm text-slate-400">Select an order to view its documents.</p>
            ) : documents.length === 0 ? (
              <EmptyState icon={FileText} title="No documents yet" subtitle="Upload invoices, bills, or receipts for this order." />
            ) : (
              <ul className="space-y-3">
                {documents.map((d) => (
                  <li key={d._id} className="flex items-center justify-between border border-slate-100 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <FileText className="w-4.5 h-4.5 text-primary" size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-navy truncate">{d.fileName}</p>
                        <p className="text-xs text-slate-400">{d.documentType} · {new Date(d.uploadedAt).toLocaleDateString("en-IN")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <a href={`${API_ORIGIN}${d.fileUrl}`} target="_blank" rel="noreferrer" className="text-primary"><Eye size={16} /></a>
                      <button onClick={() => setDeleteTarget(d._id)} className="text-danger"><Trash2 size={16} /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this document?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
};

export default AdminDocuments;
