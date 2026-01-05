import { Package } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { formatPrice } from '@/lib/format';
import type { OrderItem } from '@/types';

// ==========================================
// ORDER ITEMS TABLE
// ==========================================

interface OrderItemsTableProps {
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  shippingCost?: number;
  total: number;
}

export function OrderItemsTable({
  items,
  subtotal,
  discount = 0,
  shippingCost = 0,
  total,
}: OrderItemsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50%]">Produk</TableHead>
          <TableHead className="text-right">Harga</TableHead>
          <TableHead className="text-center">Qty</TableHead>
          <TableHead className="text-right">Subtotal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={item.id || index}><TableCell>
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground">{item.notes}</p>
                  )}
                </div>
              </div>
            </TableCell><TableCell className="text-right">{formatPrice(item.price)}</TableCell><TableCell className="text-center">{item.qty}</TableCell><TableCell className="text-right font-medium">{formatPrice(item.subtotal)}</TableCell></TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="text-right">Subtotal</TableCell>
          <TableCell className="text-right">{formatPrice(subtotal)}</TableCell>
        </TableRow>
        {discount > 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-right text-green-600">Diskon</TableCell>
            <TableCell className="text-right text-green-600">-{formatPrice(discount)}</TableCell>
          </TableRow>
        )}
        {shippingCost > 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-right">Ongkos Kirim</TableCell>
            <TableCell className="text-right">{formatPrice(shippingCost)}</TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
          <TableCell className="text-right font-bold text-lg text-primary">{formatPrice(total)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}