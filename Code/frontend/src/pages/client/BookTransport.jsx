import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Upload, CheckCircle2 } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import Header from "../../components/Header";
import api from "../../api/axios";

const RATE_PER_KG = { "Mini Truck": 8, "Pickup": 7, "Tempo": 6, "Truck": 5, "Container": 4 };
const BASE_FARE = { "Mini Truck": 500, "Pickup": 600, "Tempo": 800, "Truck": 1500, "Container": 3000 };

const initialState = {
  pickupAddress: "", pickupCity: "", contactName: "", contactNumber: "", pickupDate: "",
  deliveryAddress: "", deliveryCity: "", receiverName: "", receiverPhone: "",
  category: "Electronics", description: "", weightKg: "", numPackages: "1",
  vehicleType: "Mini Truck", estimatedValue: "",
  paymentMode: "UPI", paymentReference: "",
};

const BookTransport = () => {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const estimatedCharge = useMemo(() => {
    const weight = Number(form.weightKg) || 0;
    const base = BASE_FARE[form.vehicleType] || 500;
    const rate = RATE_PER_KG[form.vehicleType] || 8;
    return Math.round(base + weight * rate);
  }, [form.weightKg, form.vehicleType]);

  const validate = () => {
    const required = ["pickupAddress", "pickupCity", "contactName", "contactNumber", "pickupDate", "deliveryAddress", "deliveryCity", "receiverName", "receiverPhone", "weightKg"];
    for (const f of required) {
      if (!form[f]) {
        toast.error("Please fill in all required fields");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("pickupDetails", JSON.stringify({
        address: form.pickupAddress, city: form.pickupCity, contactName: form.contactName,
        contactNumber: form.contactNumber, pickupDate: form.pickupDate,
      }));
      fd.append("deliveryDetails", JSON.stringify({
        address: form.deliveryAddress, city: form.deliveryCity, receiverName: form.receiverName, receiverPhone: form.receiverPhone,
      }));
      fd.append("goodsDetails", JSON.stringify({
        category: form.category, description: form.description, weightKg: Number(form.weightKg),
        numPackages: Number(form.numPackages) || 1, estimatedValue: Number(form.estimatedValue) || 0,
      }));
      fd.append("vehicleType", form.vehicleType);
      fd.append("paymentMethod", form.paymentMode);
      fd.append("paymentReference", form.paymentReference);
      if (file) fd.append("paymentScreenshot", file);

      // Note: since JSON fields are stringified inside FormData, backend should parse them.
      await api.post("/orders", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: (data) => data,
      });

      setSuccess(true);
      toast.success("Booking request submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout>
        <Header title="Book Transport" subtitle="New Booking" />
        <div className="card max-w-lg mx-auto text-center py-12">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-success" />
          </div>
          <h2 className="text-lg font-semibold text-navy mb-2">Booking request submitted!</h2>
          <p className="text-sm text-slate-500 mb-6">
            Your booking will receive an LR Number after admin payment verification. You can track its status from My Orders.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={() => navigate("/client/my-orders")} className="btn-primary text-sm">View My Orders</button>
            <button onClick={() => { setSuccess(false); setForm(initialState); setFile(null); }} className="btn-outline text-sm">Book Another</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header title="Book Transport" subtitle="New Booking" />

      <form onSubmit={handleSubmit} className="card space-y-8 max-w-4xl">
        <section>
          <h3 className="section-title">Sender / Pickup Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label-text">Pickup Address</label>
              <input className="input-field" value={form.pickupAddress} onChange={update("pickupAddress")} placeholder="Street, area" />
            </div>
            <div>
              <label className="label-text">Pickup City</label>
              <input className="input-field" value={form.pickupCity} onChange={update("pickupCity")} placeholder="e.g. Pune" />
            </div>
            <div>
              <label className="label-text">Pickup Date</label>
              <input type="date" className="input-field" value={form.pickupDate} onChange={update("pickupDate")} />
            </div>
            <div>
              <label className="label-text">Contact Person Name</label>
              <input className="input-field" value={form.contactName} onChange={update("contactName")} />
            </div>
            <div>
              <label className="label-text">Contact Number</label>
              <input className="input-field" value={form.contactNumber} onChange={update("contactNumber")} placeholder="10-digit number" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="section-title">Receiver / Delivery Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label-text">Delivery Address</label>
              <input className="input-field" value={form.deliveryAddress} onChange={update("deliveryAddress")} placeholder="Street, area" />
            </div>
            <div>
              <label className="label-text">Delivery City</label>
              <input className="input-field" value={form.deliveryCity} onChange={update("deliveryCity")} placeholder="e.g. Mumbai" />
            </div>
            <div>
              <label className="label-text">Receiver Name</label>
              <input className="input-field" value={form.receiverName} onChange={update("receiverName")} />
            </div>
            <div>
              <label className="label-text">Receiver Phone Number</label>
              <input className="input-field" value={form.receiverPhone} onChange={update("receiverPhone")} placeholder="10-digit number" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="section-title">Goods Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Goods Category</label>
              <select className="input-field" value={form.category} onChange={update("category")}>
                {["Electronics", "Furniture", "Clothing", "Food", "Machinery", "Other"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">Vehicle Type</label>
              <select className="input-field" value={form.vehicleType} onChange={update("vehicleType")}>
                {Object.keys(BASE_FARE).map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label-text">Goods Description</label>
              <textarea rows={2} className="input-field" value={form.description} onChange={update("description")} placeholder="Brief description of goods" />
            </div>
            <div>
              <label className="label-text">Weight (kg)</label>
              <input type="number" min="0" className="input-field" value={form.weightKg} onChange={update("weightKg")} />
            </div>
            <div>
              <label className="label-text">Number of Packages</label>
              <input type="number" min="1" className="input-field" value={form.numPackages} onChange={update("numPackages")} />
            </div>
            <div>
              <label className="label-text">Estimated Value (₹)</label>
              <input type="number" min="0" className="input-field" value={form.estimatedValue} onChange={update("estimatedValue")} />
            </div>
          </div>
        </section>

        <section>
          <h3 className="section-title">Payment</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Payment Mode</label>
              <select className="input-field" value={form.paymentMode} onChange={update("paymentMode")}>
                {["Cash", "UPI", "Bank Transfer"].map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">Payment Reference / Transaction ID</label>
              <input className="input-field" value={form.paymentReference} onChange={update("paymentReference")} placeholder="Optional" />
            </div>
            <div className="sm:col-span-2">
              <label className="label-text">Upload Payment Screenshot (optional)</label>
              <label className="flex items-center gap-3 border border-dashed border-slate-300 rounded-lg px-4 py-4 cursor-pointer hover:bg-slate-50">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-500">{file ? file.name : "Click to upload an image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              </label>
            </div>
          </div>
        </section>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-sm text-slate-500">Estimated Transport Charge</p>
            <p className="text-2xl font-bold text-navy">₹ {estimatedCharge.toLocaleString("en-IN")}</p>
          </div>
          <p className="text-xs text-slate-500 max-w-xs">Based on vehicle type and weight. Final amount may be confirmed by admin.</p>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate("/client/dashboard")} className="btn-outline">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Submitting..." : "Submit Booking Request"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default BookTransport;
