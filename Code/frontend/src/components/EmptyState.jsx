import { PackageOpen } from "lucide-react";

const EmptyState = ({ icon: Icon = PackageOpen, title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4">
    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
      <Icon className="w-7 h-7 text-slate-400" />
    </div>
    <h3 className="text-navy font-semibold mb-1">{title}</h3>
    {subtitle && <p className="text-sm text-slate-500 max-w-sm mb-4">{subtitle}</p>}
    {action}
  </div>
);

export default EmptyState;
