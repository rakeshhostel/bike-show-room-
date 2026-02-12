import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

interface EMICalculatorProps {
  price: number;
}

export function EMICalculator({ price }: EMICalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(price * 0.8); // Default 80% loan
  const [interestRate, setInterestRate] = useState(10.5); // Default 10.5%
  const [tenure, setTenure] = useState(36); // Default 3 years (36 months)
  const [emi, setEmi] = useState(0);

  useEffect(() => {
    // Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const r = interestRate / 12 / 100; // Monthly interest rate
    const n = tenure; // Months
    const calculatedEmi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi(Math.round(calculatedEmi));
  }, [loanAmount, interestRate, tenure]);

  const formattedLoanAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumSignificantDigits: 3
  }).format(loanAmount);

  const formattedEmi = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(emi);

  return (
    <Card className="bg-slate-50 border-border shadow-sm">
      <CardHeader className="pb-4 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          EMI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        
        {/* Loan Amount */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-muted-foreground">Loan Amount</Label>
            <div className="font-bold text-foreground">{formattedLoanAmount}</div>
          </div>
          <Slider 
            value={[loanAmount]} 
            max={price} 
            min={10000} 
            step={1000}
            onValueChange={(val) => setLoanAmount(val[0])}
            className="py-2"
          />
        </div>

        {/* Interest Rate */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-muted-foreground">Interest Rate (%)</Label>
            <div className="font-bold text-foreground bg-white px-3 py-1 rounded border border-input w-20 text-center">
              {interestRate}%
            </div>
          </div>
          <Slider 
            value={[interestRate]} 
            max={20} 
            min={5} 
            step={0.1}
            onValueChange={(val) => setInterestRate(val[0])}
          />
        </div>

        {/* Tenure */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-muted-foreground">Duration (Months)</Label>
            <div className="font-bold text-foreground">{tenure} Months</div>
          </div>
          <Slider 
            value={[tenure]} 
            max={60} 
            min={12} 
            step={6}
            onValueChange={(val) => setTenure(val[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>1 Year</span>
            <span>3 Years</span>
            <span>5 Years</span>
          </div>
        </div>

        {/* Result */}
        <div className="bg-primary/10 rounded-xl p-4 flex flex-col items-center justify-center text-center mt-6">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Monthly EMI</span>
          <span className="text-3xl font-display font-bold text-primary mt-1">{formattedEmi}</span>
        </div>

      </CardContent>
    </Card>
  );
}
