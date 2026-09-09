import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

interface XPToastProps {
  amount: number;
  visible: boolean;
}

export function XPToast({ amount, visible }: XPToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-2xl font-bold text-lg"
      style={{
        backgroundColor: "#fbbf24",
        color: "#0f0f12",
        animation: "xpToastIn 0.3s ease",
      }}
    >
      <Zap size={22} />
      +{amount} XP
      <style>{`
        @keyframes xpToastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-16px) scale(0.85); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}
