import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name.split(" ")[0]}!`);
      navigate(res.data.user.role === "admin" ? "/admin/dashboard" : "/client/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
          <h1 className="text-xl font-bold text-navy mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-6">Sign in to manage and track your shipments</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label-text">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type={showPass ? "text" : "password"}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Don't have an account? <Link to="/register" className="text-primary font-medium">Register</Link>
          </p>
        </div>

        <div className="mt-5 bg-navy-light/40 border border-navy-light rounded-lg p-3 text-xs text-slate-300">
          <p className="font-semibold text-slate-200 mb-1">Demo credentials</p>
          <p>Admin: admin@aayushlogistics.com / admin123</p>
          <p>Client: kshitija@example.com / client123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
