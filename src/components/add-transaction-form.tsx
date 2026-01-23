import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Field, FieldGroup, FieldLabel, FieldSet } from './ui/field';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from '@convex-dev/react-query';
import { api } from 'convex/_generated/api';
import { useState } from 'react';
import { Id } from 'convex/_generated/dataModel';

type TransactionType = 'income' | 'expense';

export const AddTranscationForm = () => {
  const [open, setOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Id<"categories">>();
  const [amount, setAmount] = useState('');
  const { data: categoryData } = useQuery(convexQuery(api.category.getCategoryByType, { type: transactionType }))
  const addTransaction = useConvexMutation(api.transaction.addTransaction)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      return;
    }
    addTransaction({
      type: transactionType,
      amount: parseFloat(amount),
      categoryId: category,
    })
    setOpen(false);
    // Reset form
    setCategory(undefined);
    setAmount('');
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Transction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldSet>
                <FieldGroup>

                  {/* Transcation Type */}
                  <Field>
                    <FieldLabel htmlFor="transcation-type">
                      Type
                    </FieldLabel>
                    <Select value={transactionType} onValueChange={(value: TransactionType) => {
                      setTransactionType(value)
                      setCategory(undefined)
                    }}>
                      <SelectTrigger id="transcation-type">
                        <SelectValue placeholder="transaction-type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Category */}
                  <Field>
                    <FieldLabel htmlFor="transcation-category">
                      Category
                    </FieldLabel>
                    <Select value={category} onValueChange={(value) => setCategory(value as Id<"categories">)} required>
                      <SelectTrigger id="transcation-category">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryData?.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Amount */}
                  <Field>
                    <FieldLabel htmlFor="transaction-amount">
                      Amount
                    </FieldLabel>
                    <Input
                      id="transaction-amount"
                      autoComplete="off"
                      placeholder="Transaction Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet>
              </FieldSet>

              {/* Buttons */}
              <Field orientation="horizontal">
                <Button type="submit">Submit</Button>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
