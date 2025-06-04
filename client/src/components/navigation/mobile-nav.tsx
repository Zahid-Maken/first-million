import { 
  Home, 
  ArrowRightLeft, 
  LineChart, 
  Target, 
  PieChart,
  Grid3X3
} from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const navItems = [
    { id: "dashboard", icon: Home, label: "Home" },
    { id: "transactions", icon: ArrowRightLeft, label: "Transactions" },
    { id: "categories", icon: Grid3X3, label: "Categories" },
    { id: "investments", icon: LineChart, label: "Invest" },
    { id: "goals", icon: Target, label: "Goals" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-lg">
      <div className="flex justify-around items-center py-3 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive 
                  ? "text-primary bg-primary/10 transform scale-105" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className={`p-1 rounded-full ${isActive ? "bg-primary/20" : ""}`}>
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
              </div>
              <span className={`text-xs mt-1 font-medium truncate ${
                isActive ? "text-primary" : "text-gray-500"
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
