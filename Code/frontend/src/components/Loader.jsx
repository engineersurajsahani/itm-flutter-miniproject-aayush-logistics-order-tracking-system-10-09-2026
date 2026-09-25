const Loader = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
    <div className="w-5 h-5 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
    <span className="text-sm">{label}</span>
  </div>
);

export default Loader;
