import { mutation } from './_generated/server'
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
      console.log(res)
    })
    return {
      success: true,
      message: 'Default categories are inserted to the database.'
    }
  }
})
