import { v } from 'convex/values';
import { mutation, query } from './_generated/server'

export const addTransaction = mutation({
  args: {
    type: v.union(
      v.literal('income'),
      v.literal('expense')
    ),
    amount: v.number(),
    categoryId: v.id("categories"),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity().then((i) => i?.subject)
    if (!userId) {
      throw new Error("User ID not found.")
    }
    const now = Date.now();
    await ctx.db.insert('transactions', {
      userId: userId,
      type: args.type,
      amount: args.amount,
      categoryId: args.categoryId,
      description: args.description,
      date: now,
      isDeleted: false,
      updatedAt: now,
    })
  },
})

export const getTransactionByType = query({
  args: {
    type: v.union(
      v.literal('income'),
      v.literal('expense')
    ),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity().then((i) => i?.subject)
    if (!userId) {
      throw new Error("User ID not found.")
    }
    const transactions = await ctx.db
      .query("transactions")
      .withIndex('by_userId_date')
      .order('asc')
      .filter((q) => q.eq(q.field('userId'), userId))
      .filter((q) => q.eq(q.field('type'), args.type))
      .collect()
    return transactions
  }
})


export const getAllTransactions = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity().then((i) => i?.subject)
    if (!userId) {
      throw new Error("User ID not found.")
    }
    const transactions = await ctx.db
      .query("transactions")
      .withIndex('by_userId_date')
      .order('asc')
      .filter((q) => q.eq(q.field('userId'), userId))
      .collect()
    return transactions
  }
})
