'use client';

// ─── Step 1: Details ───────────────────────────────────────────────────────
// Toggle tipe listing, nama, deskripsi, category combobox, SKU

import { useState } from 'react';
import { Package, Wrench, Check, ChevronsUpDown } from 'lucide-react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { cn } from '@/lib/utils';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormData } from '@/lib/validations';
import type { ProductType } from './types';

interface StepDetailsProps {
  form: UseFormReturn<ProductFormData>;
  productType: ProductType;
  onTypeChange: (type: ProductType) => void;
  categories: string[];
}

export function StepDetails({
  form,
  productType,
  onTypeChange,
  categories,
}: StepDetailsProps) {
  const isService = productType === 'service';
  const watchCategory = form.watch('category');

  // ── State category dikelola di sini ──
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

      {/* ── Toggle tipe listing ──────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Listing type
        </p>
        <div className="flex items-center gap-2 p-1 bg-muted rounded-xl w-fit">
          <button
            type="button"
            onClick={() => onTypeChange('product')}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              productType === 'product'
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Package className="h-4 w-4" />
            Product
          </button>
          <button
            type="button"
            onClick={() => onTypeChange('service')}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              productType === 'service'
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Wrench className="h-4 w-4" />
            Service
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          {isService
            ? 'Service mode — inventory & SKU fields are hidden automatically.'
            : 'Product mode — all fields including inventory & SKU are available.'}
        </p>
      </div>

      {/* ── Nama ─────────────────────────────────────────────────── */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">
              {isService ? 'Service name' : 'Product name'}{' '}
              <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder={
                  isService
                    ? 'e.g. Logo Design, AC Service & Repair'
                    : 'e.g. Special Fried Rice, Wireless Headphones'
                }
                className="h-11"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ── Deskripsi ──────────────────────────────────────────── */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder={
                  isService
                    ? "Describe your service — what's included, turnaround time, and requirements..."
                    : 'Describe your product — materials, dimensions, key features...'
                }
                rows={4}
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              A clear description helps customers make confident purchase decisions.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ── Category + SKU ───────────────────────────────────────── */}
      <div className={cn('grid gap-4', !isService ? 'sm:grid-cols-2' : 'grid-cols-1')}>

        {/* Category */}
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

        {/* SKU — Product only */}
        {!isService && (
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">SKU</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. PROD-001"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Stock keeping unit for internal tracking.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}