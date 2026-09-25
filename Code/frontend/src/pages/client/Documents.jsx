import { useEffect, useState } from "react";
import { FileText, Download, Eye } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import api from "../../api/axios";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace("/api", "");

const ClientDocuments = () => {
  const [orders, setOrders] = useState([]);
  const [docsByOrder, setDocsByOrder] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/orders", { params: { status: "Delivered" } });
        const delivered = res.data.orders;
        setOrders(delivered);
        const docsEntries = await Promise.all(
          delivered.map(async (o) => {
            const d = await api.get(`/documents/${o._id}`);
            return [o._id, d.data.documents];
          })
        );
        setDocsByOrder(Object.fromEntries(docsEntries));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const allDocs = orders.flatMap((o) => (docsByOrder[o._id] || []).map((d) => ({ ...d, order: o })));

  return (
    <DashboardLayout>
      <Header title="Documents" subtitle="Delivery Documents" />
      <div className="card">
        {loading ? (
          <Loader />
        ) : allDocs.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No documents available"
            subtitle="Documents such as invoices and delivery receipts will appear here once your orders are delivered and admin uploads them."
          />
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100">
                  <th className="px-5 py-2 font-medium">LR Number</th>
                  <th className="px-5 py-2 font-medium">Document</th>
                  <th className="px-5 py-2 font-medium">Uploaded</th>
                  <th className="px-5 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {allDocs.map((d) => (
                  <tr key={d._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-navy">{d.order.lrNumber}</td>
                    <td className="px-5 py-3 text-slate-600 flex items-center gap-2">
                      <FileText size={15} className="text-primary" /> {d.documentType}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{new Date(d.uploadedAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-3">
                        <a href={`${API_ORIGIN}${d.fileUrl}`} target="_blank" rel="noreferrer" className="text-primary text-sm font-medium flex items-center gap-1"><Eye size={14} /> View</a>
                        <a href={`${API_ORIGIN}${d.fileUrl}`} download className="text-slate-500 text-sm font-medium flex items-center gap-1"><Download size={14} /> Download</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientDocuments;
