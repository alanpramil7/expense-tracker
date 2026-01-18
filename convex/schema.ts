import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
  })
    .index('by_clerkId', ['clerkId'])
    .index('by_email', ['email']),

  categories: defineTable({
    name: v.string(),
    type: v.union(
      v.literal('income'),
      v.literal('expense')
    ),
    icon: v.string(),
    color: v.string(),
    userId: v.nullable(v.string()),
    isSystem: v.boolean(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_name', ['name'])
    .index('by_type', ['type'])
    .index('by_userId_type', ['userId', 'type'])
    .index('by_isSystem', ['isSystem']),

  transactions: defineTable({
    userId: v.string(),
    type: v.union(
      v.literal('income'),
      v.literal('expense')
    ),
    amount: v.number(),
    categoryId: v.string(),
    description: v.string(),
    date: v.number(),
    isDeleted: v.boolean(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_categoryId', ['categoryId'])
    .index('by_userId_date', ['userId', 'date'])
    .index('by_userId_type', ['userId', 'type'])
    .index('by_isDeleted', ['isDeleted'])
    .index('by_userId_isDeleted', ['userId', 'isDeleted']),
})
