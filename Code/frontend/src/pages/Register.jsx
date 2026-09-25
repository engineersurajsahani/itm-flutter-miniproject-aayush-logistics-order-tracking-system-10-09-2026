import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, User, Mail, Phone, Lock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", role: "client" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!/^\d{10}$/.test(form.phone)) errs.phone = "Enter a valid 10-digit phone number";
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.token, res.data.user);
      toast.success("Account created successfully!");
      navigate(res.data.user.role === "admin" ? "/admin/dashboard" : "/client/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">Aayush Logistics</p>
            <p className="text-slate-400 text-xs">Move Today. A Better Tomorrow.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-xl font-bold text-navy mb-1">Create your account</h1>
          <p className="text-sm text-slate-500 mb-6">Book, manage and track shipments with ease</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input className="input-field pl-10" placeholder="Full name" value={form.name} onChange={update("name")} />
              </div>
              {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="label-text">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="email" className="input-field pl-10" placeholder="you@example.com" value={form.email} onChange={update("email")} />
              </div>
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label-text">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input className="input-field pl-10" placeholder="10-digit mobile number" value={form.phone} onChange={update("phone")} />
              </div>
              {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-text">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="password" className="input-field pl-10" placeholder="••••••••" value={form.password} onChange={update("password")} />
                </div>
                {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="label-text">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="password" className="input-field pl-10" placeholder="••••••••" value={form.confirmPassword} onChange={update("confirmPassword")} />
                </div>
                {errors.confirmPassword && <p className="text-xs text-danger mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div>
              <label className="label-text">Register as</label>
              <div className="grid grid-cols-2 gap-3">
                {["client", "admin"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setForm({ ...form, role: r })}
                    className={`py-2.5 rounded-lg border text-sm font-medium capitalize transition-colors ${
                      form.role === r ? "bg-primary text-white border-primary" : "border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Already have an account? <Link to="/login" className="text-primary font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
