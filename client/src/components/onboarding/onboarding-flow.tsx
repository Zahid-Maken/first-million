import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  PiggyBank,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  Building
} from "lucide-react";

interface OnboardingData {
  userName: string;
  monthlyIncome: string;
  investmentGoal: string;
  targetAmount: string;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    userName: "",
    monthlyIncome: "",
    investmentGoal: "",
    targetAmount: "1000000"
  });

  const totalSteps = 5;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const slides = [
    {
      title: "Welcome to First Million",
      subtitle: "Your journey to financial freedom starts here",
      icon: <Sparkles className="w-16 h-16 text-white" />,
      gradient: "bg-gradient-primary",
      content: (
        <div className="text-center space-y-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">Track. Invest. Grow.</h3>
            <p className="text-white/90 leading-relaxed">
              Transform your financial habits with our intelligent tracking system. 
              Monitor income, manage expenses, and build wealth through smart investments.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Smart Investment Rules",
      subtitle: "Build wealth with discipline",
      icon: <Target className="w-16 h-16 text-white" />,
      gradient: "bg-gradient-success",
      content: (
        <div className="space-y-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white">Golden Rule #1</h4>
                <p className="text-white/80 text-sm">Only invest money you can afford to lose</p>
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white">Golden Rule #2</h4>
                <p className="text-white/80 text-sm">Track every dollar - income minus expenses equals investment power</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Your Personal Details",
      subtitle: "Let's get to know you",
      icon: <Building className="w-16 h-16 text-white" />,
      gradient: "bg-gradient-warning",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="userName" className="text-white font-semibold">What should we call you?</Label>
              <Input
                id="userName"
                value={data.userName}
                onChange={(e) => setData(prev => ({ ...prev, userName: e.target.value }))}
                placeholder="Enter your name"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 mt-2"
              />
            </div>
            <div>
              <Label htmlFor="monthlyIncome" className="text-white font-semibold">Monthly Income ($)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={data.monthlyIncome}
                onChange={(e) => setData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                placeholder="5000"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 mt-2"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Set Your Million Dollar Goal",
      subtitle: "Every empire starts with a dream",
      icon: <Trophy className="w-16 h-16 text-white" />,
      gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
      content: (
        <div className="space-y-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">$1,000,000</h3>
            <p className="text-white/90">Your First Million Target</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="investmentGoal" className="text-white font-semibold">What's your investment focus?</Label>
              <Input
                id="investmentGoal"
                value={data.investmentGoal}
                onChange={(e) => setData(prev => ({ ...prev, investmentGoal: e.target.value }))}
                placeholder="Real estate, stocks, crypto, business..."
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 mt-2"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Begin!",
      subtitle: "Your financial journey starts now",
      icon: <TrendingUp className="w-16 h-16 text-white" />,
      gradient: "bg-gradient-primary",
      content: (
        <div className="text-center space-y-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Welcome aboard, {data.userName || "Future Millionaire"}!
            </h3>
            <p className="text-white/90 leading-relaxed mb-6">
              You're all set to start tracking your path to financial freedom. 
              Remember: discipline today creates wealth tomorrow.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-white/70">Monthly Income</p>
                <p className="font-bold text-white">${data.monthlyIncome || "0"}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-white/70">Target Goal</p>
                <p className="font-bold text-white">$1,000,000</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSlide = slides[currentStep];
  const canProceed = currentStep < 2 || 
    (currentStep === 2 && data.userName && data.monthlyIncome) ||
    (currentStep === 3 && data.investmentGoal) ||
    currentStep === 4;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(data);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <Card className={`w-full max-w-md border-0 shadow-glow ${currentSlide.gradient} text-white overflow-hidden relative`}>
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
          
          <CardContent className="p-8 relative z-10">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                {currentSlide.icon}
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">{currentSlide.title}</h1>
              <p className="text-white/80">{currentSlide.subtitle}</p>
            </div>

            {/* Content */}
            {currentSlide.content}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-gradient-primary text-white shadow-glow disabled:opacity-50"
        >
          {currentStep === totalSteps - 1 ? "Get Started" : "Next"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}