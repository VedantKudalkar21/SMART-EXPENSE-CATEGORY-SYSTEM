"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({ initialBudget, currentExpenses, accountId }) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );
  const [loading, setLoading] = useState(false);

  const percentUsed =
    initialBudget && initialBudget.amount > 0
      ? (currentExpenses / initialBudget.amount) * 100
      : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (!accountId) {
      toast.error("Account not found");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await updateBudget(amount, accountId);

      if (res?.success) {
        toast.success("Budget updated ✅");
        setIsEditing(false);
        router.refresh(); // 🔥 refresh UI
      } else {
        toast.error(res?.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">
            Monthly Budget (Default Account)
          </CardTitle>

          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={loading}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={loading}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription>
                  {initialBudget
                    ? `₹${currentExpenses.toLocaleString(
                        "en-IN"
                      )} of ₹${initialBudget.amount.toLocaleString(
                        "en-IN"
                      )} spent`
                    : "No budget set"}
                </CardDescription>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {initialBudget ? (
          <div className="space-y-2">
            <Progress
              value={percentUsed}
              extraStyles={`${
                percentUsed >= 90
                  ? "bg-red-500"
                  : percentUsed >= 75
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />

            <p className="text-xs text-muted-foreground text-right">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Set a budget to track your spending
          </p>
        )}
      </CardContent>
    </Card>
  );
}