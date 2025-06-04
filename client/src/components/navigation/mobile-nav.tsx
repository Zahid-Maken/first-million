import { 
  Home, 
  ArrowRightLeft, 
  LineChart, 
  Target, 
  PieChart,
  Grid3X3,
  TrendingUp
} from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const navItems = [
    { id: "dashboard", icon: Home, label: "Home" },
    { id: "transactions", icon: ArrowRightLeft, label: "Activity" },
    { id: "investments", icon: TrendingUp, label: "Invest" },
    { id: "goals", icon: Target, label: "Goals" },
    { id: "reports", icon: PieChart, label: "Reports" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background with glass effect */}
      <div className="bg-card/80 nav-blur border-t border-border shadow-lg">
        <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ease-out min-w-0 flex-1 group ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                {/* Active indicator background */}
                <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ease-out ${
                  isActive 
                    ? "bg-primary/10 scale-100 opacity-100" 
                    : "bg-transparent scale-95 opacity-0 group-hover:bg-muted/50 group-hover:scale-100 group-hover:opacity-100"
                }`} />
                
                {/* Icon container */}
                <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ease-out ${
                  isActive 
                    ? "bg-primary/20 shadow-glow transform scale-110" 
                    : "bg-transparent group-hover:bg-muted/30"
                }`}>
                  <Icon className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? "text-primary drop-shadow-sm" : ""
                  }`} />
                </div>
                
                {/* Label */}
                <span className={`relative z-10 text-xs font-semibold mt-1 transition-all duration-300 ${
                  isActive 
                    ? "text-primary opacity-100 transform translate-y-0" 
                    : "text-muted-foreground opacity-80 transform translate-y-0.5"
                }`}>
                  {item.label}
                </span>
                
                {/* Active dot indicator */}
                <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${
                  isActive 
                    ? "bg-primary opacity-100 scale-100" 
                    : "bg-transparent opacity-0 scale-50"
                }`} />
              </button>
            );
          })}
        </div>
        
        {/* iPhone home indicator */}
        <div className="flex justify-center pb-1">
          <div className="w-32 h-1 bg-muted-foreground/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
