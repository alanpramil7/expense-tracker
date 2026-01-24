import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from './ui/input';
import {
  Plus, IndianRupee, ChevronLeft, ChevronRight,
  Briefcase, Laptop, TrendingUp, Store, Gift, PlusCircle,
  Utensils, ShoppingCart, Car, Home, Zap, Heart, Film,
  ShoppingBag, GraduationCap, Shield, Scissors, Plane,
  CreditCard, MoreHorizontal, type LucideIcon,
} from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from '@convex-dev/react-query';
import { api } from 'convex/_generated/api';
import { useState } from 'react';
import { Id } from 'convex/_generated/dataModel';

type TransactionType = 'income' | 'expense';

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Laptop,
  TrendingUp,
  Store,
  Gift,
  PlusCircle,
  Utensils,
  ShoppingCart,
  Car,
  Home,
  Zap,
  Heart,
  Film,
  ShoppingBag,
  GraduationCap,
  Shield,
  Scissors,
  Plane,
  CreditCard,
  MoreHorizontal,
};

export const AddTranscationForm = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Id<"categories">>();
  const [categoryName, setCategoryName] = useState('');
  const [amount, setAmount] = useState('');
  const { data: categoryData } = useQuery(convexQuery(api.category.getCategoryByType, { type: transactionType }));
  const addTransaction = useConvexMutation(api.transaction.addTransaction);

  const resetForm = () => {
    setStep(1);
    setTransactionType('expense');
    setCategory(undefined);
    setCategoryName('');
    setAmount('');
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;
    addTransaction({
      type: transactionType,
      amount: parseFloat(amount),
      categoryId: category,
    });
    handleOpenChange(false);
  };

  const canGoNext = () => {
    if (step === 1) return true;
    if (step === 2) return !!category;
    return false;
  };

  const slideClass = (dir: 'left' | 'right') =>
    dir === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left';

  return (
    <div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${s === step
                  ? 'w-6 bg-primary'
                  : s < step
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-muted'
                  }`}
              />
            ))}
          </div>

          {/* Step 1: Type */}
          {step === 1 && (
            <div className={`flex flex-col items-center gap-6 py-4 ${slideClass('right')}`}>
              <p className="text-sm text-muted-foreground">What type of transaction?</p>
              <div className="flex w-full max-w-xs rounded-xl bg-muted p-1">
                <button
                  type="button"
                  onClick={() => {
                    setTransactionType('income');
                    setCategory(undefined);
                    setCategoryName('');
                  }}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${transactionType === 'income'
                    ? 'bg-chart-3 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTransactionType('expense');
                    setCategory(undefined);
                    setCategoryName('');
                  }}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${transactionType === 'expense'
                    ? 'bg-destructive text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Expense
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Category */}
          {step === 2 && (
            <div className={`flex flex-col gap-4 py-2 ${slideClass('right')}`}>
              <p className="text-center text-sm text-muted-foreground">Select a category</p>
              <div className="grid grid-cols-3 gap-2">
                {categoryData?.map((cat) => {
                  const IconComponent = iconMap[cat.icon] ?? PlusCircle;
                  const isSelected = category === cat._id;
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => {
                        setCategory(cat._id);
                        setCategoryName(cat.name);
                      }}
                      className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-xs transition-all ${isSelected
                        ? 'border-2 border-primary bg-primary/10 shadow-sm'
                        : 'border border-border bg-card hover:border-primary/50'
                        }`}
                    >
                      <IconComponent className="h-5 w-5" style={{ color: cat.color }} />
                      <span className="text-center leading-tight">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Amount */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className={`flex flex-col items-center gap-5 py-4 ${slideClass('right')}`}>
              {/* Summary pill */}
              <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm">
                <span className={transactionType === 'income' ? 'text-chart-3' : 'text-destructive'}>
                  {transactionType === 'income' ? 'Income' : 'Expense'}
                </span>
                <span className="text-muted-foreground">•</span>
                <span>{categoryName}</span>
              </div>

              {/* Amount input */}
              <div className="relative w-full max-w-xs">
                <IndianRupee className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-14 pl-10 text-2xl font-bold"
                  autoFocus
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>

              <Button
                type="submit"
                className={`w-full max-w-xs rounded-xl ${transactionType === 'income'
                  ? 'bg-chart-3 hover:bg-chart-3/90'
                  : 'bg-destructive hover:bg-destructive/90'
                  } text-white`}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Add {transactionType === 'income' ? 'Income' : 'Expense'}
              </Button>
            </form>
          )}

          {/* Navigation */}
          {step < 3 && (
            <div className="flex justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <Button
                size="sm"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canGoNext()}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
          {step === 3 && (
            <div className="flex justify-start pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(2)}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
