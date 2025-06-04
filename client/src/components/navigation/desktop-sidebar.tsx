import { Button } from "@/components/ui/button";
import { 
  Home, 
  ArrowRightLeft, 
  LineChart, 
  Target, 
  PieChart,
  Crown,
  LogOut,
  Grid3X3
} from "lucide-react";
import type { User } from "@shared/schema";

interface DesktopSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
}

export default function DesktopSidebar({ activeTab, setActiveTab, user }: DesktopSidebarProps) {
  const navItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "transactions", icon: ArrowRightLeft, label: "Transactions" },
    { id: "categories", icon: Grid3X3, label: "Categories" },
    { id: "investments", icon: LineChart, label: "Investments" },
    { id: "goals", icon: Target, label: "Goals" },
    { id: "reports", icon: PieChart, label: "Reports" },
  ];

  return (
    <div className="hidden md:flex md:fixed md:left-0 md:top-0 md:bottom-0 md:w-64 bg-dark text-white flex-col">
      {/* Header */}
      <div className="p-6 border-b border-dark-light">
        <h1 className="text-2xl font-bold text-secondary">First Million</h1>
        <p className="text-gray-400 text-sm mt-2">Your path to wealth</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-primary/20 text-primary"
                    : "text-gray-300 hover:bg-dark-light"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-dark-light">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-semibold">
              {(user.firstName || user.email || "U")[0].toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium">
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user.firstName || user.email?.split('@')[0] || "User"
              }
            </p>
            <p className="text-gray-400 text-sm">
              {user.isProUser ? "Pro Member" : "Free Member"}
            </p>
          </div>
        </div>
        
        {!user.isProUser && (
          <Button className="w-full bg-accent text-white mb-3 hover:bg-accent/90">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        )}
        
        <Button 
          variant="outline" 
          className="w-full text-gray-300 border-gray-600 hover:bg-dark-light"
          onClick={() => window.location.href = "/api/logout"}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
