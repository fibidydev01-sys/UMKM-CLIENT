'use client';

// ─── Step 4: Publish ───────────────────────────────────────────────────────

import { useState } from 'react';
import { Eye, EyeOff, Check, ChevronsUpDown } from 'lucide-react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/shared/utils';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormData } from '@/lib/shared/validations';

interface StepPublishProps {
  form: UseFormReturn<ProductFormData>;
  isEditing: boolean;
  categories: string[];
}

export function StepPublish({
  form,
  isEditing,
  categories,
}: StepPublishProps) {
  const watchIsActive = form.watch('isActive');
  const watchCategory = form.watch('category');

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const isNewCategory =
    categorySearch.trim() !== '' &&
    !categories.some((cat) => cat.toLowerCase() === categorySearch.toLowerCase());

  const handleSelectCategory = (value: string) => {
    form.setValue('category', value);
    setCategorySearch('');
    setCategoryOpen(false);
  };

  const handleCreateCategory = () => {
    const newCategory = categorySearch.trim();
    if (newCategory) {
      form.setValue('category', newCategory);
      setCategorySearch('');
      setCategoryOpen(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Category ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Category
        </p>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-sm font-semibold">Category</FormLabel>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={categoryOpen}
                      className={cn(
                        'h-11 w-full justify-between font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value || 'Select or create a category'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search or create category..."
                      value={categorySearch}
                      onValueChange={setCategorySearch}
                    />
                    <CommandList>
                      <CommandEmpty className="py-3 px-4 text-sm text-muted-foreground">
                        {categorySearch
                          ? <span>No category &quot;{categorySearch}&quot; found</span>
                          : <span>Type to search or create a new category</span>
                        }
                      </CommandEmpty>
                      {filteredCategories.length > 0 && (
                        <CommandGroup heading="Categories">
                          {filteredCategories.map((cat) => (
                            <CommandItem
                              key={cat}
                              value={cat}
                              onSelect={() => handleSelectCategory(cat)}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  watchCategory === cat ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              {cat}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                      {isNewCategory && (
                        <CommandGroup heading="Create new">
                          <CommandItem
                            value={`__create__${categorySearch}`}
                            onSelect={handleCreateCategory}
                            className="text-primary font-medium"
                          >
                            <span className="mr-2 text-base leading-none">+</span>
                            Create &quot;{categorySearch}&quot;
                          </CommandItem>
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Choose an existing category or type to create a new one.
              </FormDescription>
            </FormItem>
          )}
        />
      </div>

      {/* ── Visibility ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Visibility
        </p>

        <div className={cn(
          'flex items-center justify-between rounded-xl border-2 p-4 transition-all duration-200',
          watchIsActive ? 'border-primary/30 bg-primary/5' : 'border-border bg-background'
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors',
              watchIsActive ? 'bg-primary/10' : 'bg-muted'
            )}>
              {watchIsActive
                ? <Eye className="h-4 w-4 text-primary" />
                : <EyeOff className="h-4 w-4 text-muted-foreground" />
              }
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">
                {watchIsActive ? 'Visible in store' : 'Hidden from store'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {watchIsActive
                  ? 'Customers can find and view this listing'
                  : 'Only you can see this — not visible to customers'
                }
              </p>
            </div>
          </div>
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="shrink-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {isEditing
          ? 'Changes take effect immediately after saving.'
          : 'You can change these settings at any time after publishing.'}
      </p>

    </div>
  );
}