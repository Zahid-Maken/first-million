import { 
  Home, 
  ArrowRightLeft, 
  LineChart, 
  Target, 
  PieChart 
} from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const navItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "transactions", icon: ArrowRightLeft, label: "Transactions" },
    { id: "investments", icon: LineChart, label: "Investments" },
    { id: "goals", icon: Target, label: "Goals" },
    { id: "reports", icon: PieChart, label: "Reports" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`flex flex-col items-center p-2 ${
                activeTab === item.id ? "text-primary" : "text-gray-400"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
