"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// ✅ GET BUDGET + EXPENSES
export async function getCurrentBudget(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // ✅ Get budget for THIS account
    const budget = await db.budget.findFirst({
      where: {
        userId: user.id,
        accountId: accountId,
      },
    });

    // ✅ Get expenses for THIS account (NO DATE FILTER for reliability)
    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        accountId: accountId,
        type: "EXPENSE",
      },
      _sum: {
        amount: true,
      },
    });

    const currentExpenses = Number(expenses._sum.amount || 0);

    return {
      budget: budget
        ? { ...budget, amount: budget.amount.toNumber() }
        : null,
      currentExpenses,
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
}

// ✅ UPDATE / CREATE BUDGET (PER ACCOUNT)
export async function updateBudget(amount, accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // 🔥 STEP 1: check if budget exists
    const existing = await db.budget.findFirst({
      where: {
        userId: user.id,
        accountId: accountId,
      },
    });

    let budget;

    // 🔥 STEP 2: update or create manually
    if (existing) {
      budget = await db.budget.update({
        where: {
          id: existing.id,
        },
        data: {
          amount,
        },
      });
    } else {
      budget = await db.budget.create({
        data: {
          userId: user.id,
          accountId: accountId,
          amount,
        },
      });
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      data: { ...budget, amount: budget.amount.toNumber() },
    };
  } catch (error) {
    console.error("Error updating budget:", error);
    return { success: false, error: error.message };
  }
}