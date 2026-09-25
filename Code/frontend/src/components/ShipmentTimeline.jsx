import { Check } from "lucide-react";

const STEPS = ["Booked", "Payment Verified", "Picked Up", "In Transit", "Delivered"];

const ShipmentTimeline = ({ currentStatus }) => {
  if (currentStatus === "Cancelled") {
    return (
      <div className="bg-red-50 border border-red-200 text-danger text-sm font-medium rounded-lg px-4 py-3">
        This shipment has been cancelled.
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(currentStatus);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-start min-w-[600px]">
        {STEPS.map((step, idx) => {
          const done = idx <= currentIndex;
          const isLast = idx === STEPS.length - 1;
          return (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              <div className="flex items-center w-full">
                <div className={`w-full h-0.5 ${idx === 0 ? "invisible" : done ? "bg-primary" : "bg-slate-200"}`} />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 z-10 ${
                    done
                      ? idx === currentIndex
                        ? "bg-primary border-primary text-white"
                        : "bg-success border-success text-white"
                      : "bg-white border-slate-300 text-slate-300"
                  }`}
                >
                  {done ? <Check size={16} /> : <span className="text-xs font-semibold">{idx + 1}</span>}
                </div>
                <div className={`w-full h-0.5 ${isLast ? "invisible" : done && idx < currentIndex ? "bg-primary" : "bg-slate-200"}`} />
              </div>
              <p className={`mt-2 text-xs font-medium text-center px-1 ${done ? "text-navy" : "text-slate-400"}`}>
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShipmentTimeline;
