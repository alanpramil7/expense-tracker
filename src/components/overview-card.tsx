import { Wallet, TrendingUp, TrendingDown, PiggyBank, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";

interface OverviewCardProps {
  title: string;
  value: number;
  index?: number;
}

const cardConfig: Record<string, { icon: LucideIcon; bgClass: string; textClass: string }> = {
  "Total Balance": {
    icon: Wallet,
    bgClass: "bg-primary/15",
    textClass: "text-primary",
  },
  "Income": {
    icon: TrendingUp,
    bgClass: "bg-chart-3/15",
    textClass: "text-chart-3",
  },
  "Expenses": {
    icon: TrendingDown,
    bgClass: "bg-destructive/15",
    textClass: "text-destructive",
  },
  "Savings Rate": {
    icon: PiggyBank,
    bgClass: "bg-chart-2/15",
    textClass: "text-chart-2",
  },
};

export const OverviewCard = ({ title, value, index = 0 }: OverviewCardProps) => {
  const isSavings = title === "Savings Rate";
  const animatedValue = useAnimatedCounter(value, 1200, isSavings ? 2 : 0);
  const config = cardConfig[title] ?? cardConfig["Total Balance"];
  const Icon = config.icon;

  const staggerClass = `stagger-${index + 1}`;

  const formattedValue = isSavings
    ? `${animatedValue}%`
    : `₹${animatedValue.toLocaleString("en-IN")}`;

  return (
    <Card className={`rounded-2xl border-0 shadow-md hover-lift animate-fade-in-up ${staggerClass}`}>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.bgClass}`}>
          <Icon className={`h-6 w-6 ${config.textClass}`} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{title}</span>
          <span className={`text-2xl font-bold ${config.textClass}`}>
            {formattedValue}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
