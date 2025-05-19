import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

// Mock data for the cards
const cardData = [
  {
    title: "Casino Royal",
    description: "Las Vegas, NV",
    metric: 45678.9,
    change: 12.5,
    status: "up",
    machines: 15,
  },
  {
    title: "Fortune Club",
    description: "Atlantic City, NJ",
    metric: 36789.12,
    change: 8.3,
    status: "up",
    machines: 12,
  },
  {
    title: "Lucky Star",
    description: "Reno, NV",
    metric: 29876.54,
    change: -2.1,
    status: "down",
    machines: 8,
  },
  {
    title: "Silver Moon",
    description: "Orlando, FL",
    metric: 18901.23,
    change: -5.4,
    status: "warning",
    machines: 6,
  },
];

export function DashboardCards() {
  return cardData.map((card, index) => (
    <Card key={index} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{card.title}</CardTitle>
          {card.status === "up" ? (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          ) : card.status === "down" ? (
            <TrendingDown className="h-4 w-4 text-rose-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
        </div>
        <CardDescription>{card.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(card.metric)}</div>
        <div className="flex items-center text-xs">
          <Badge variant={card.status === "up" ? "success" : card.status === "down" ? "destructive" : "outline"}>
            {card.change > 0 ? "+" : ""}{card.change}%
          </Badge>
          <span className="ml-1 text-muted-foreground">desde el mes pasado</span>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-2 text-xs text-muted-foreground">
        <div className="flex w-full justify-between">
          <span className="font-medium">Máquinas activas:</span>
          <span>{card.machines}</span>
        </div>
      </CardFooter>
    </Card>
  ));
}