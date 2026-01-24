import { v } from 'convex/values';
import { mutation, query } from './_generated/server'
import { defaultCategories } from './category_seed';

export const seedCategories = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if categories already exist 
    const existingCategoreis = await ctx.db.query('categories').collect()

    if (existingCategoreis.length > 0) {
      return {
        success: false,
        message: 'Categories already present, skipping seeding'
      }
    }
    const now = Date.now();
    defaultCategories.map(async (cat) => {
      const res = await ctx.db.insert('categories', {
        ...cat,
        updatedAt: now
      })
    })
    return {
      success: true,
      message: 'Default categories are inserted to the database.'
    }
  }
})

// Get the transaction categories by type
export const getCategoryByType = query({
  args: {
    type: v.union(
      v.literal('income'),
      v.literal('expense')
    ),
  },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex('by_name')
      .filter((q) => q.eq(q.field("type"), args.type))
      .order("asc")
      .collect();
    return categories;
  },
});
