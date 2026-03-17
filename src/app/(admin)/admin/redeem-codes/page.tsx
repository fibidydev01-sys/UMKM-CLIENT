'use client';

// ==========================================
// ADMIN REDEEM CODES PAGE
// File: src/app/(admin)/admin/redeem-codes/page.tsx
// ==========================================

import { useState } from 'react';
import { Copy, Trash2, Plus, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useRedeemCodes, useCreateRedeemCodes } from '@/hooks/admin';

// ==========================================
// GENERATE DIALOG
// ==========================================

interface GenerateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function GenerateDialog({ open, onClose, onSuccess }: GenerateDialogProps) {
  const [plan, setPlan] = useState('BUSINESS');
  const [duration, setDuration] = useState('30');
  const [quantity, setQuantity] = useState('1');
  const [expiresAt, setExpiresAt] = useState('');
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);

  const { create, isLoading } = useCreateRedeemCodes();

  const handleGenerate = async () => {
    const res = await create({
      plan,
      durationDay: Number(duration),
      quantity: Number(quantity),
      expiresAt: expiresAt || undefined,
    });
    setGeneratedCodes(res.codes);
    onSuccess();
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(generatedCodes.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleClose = () => {
    setGeneratedCodes([]);
    setPlan('BUSINESS');
    setDuration('30');
    setQuantity('1');
    setExpiresAt('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Redeem Codes</DialogTitle>
        </DialogHeader>

        {generatedCodes.length > 0 ? (
          // Show generated codes
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {generatedCodes.length} kode berhasil dibuat
              </p>
              <Button variant="outline" size="sm" onClick={handleCopyAll}>
                {copiedAll ? (
                  <><Check className="mr-1 h-3 w-3" />Copied!</>
                ) : (
                  <><Copy className="mr-1 h-3 w-3" />Copy Semua</>
                )}
              </Button>
            </div>
            <div className="max-h-60 overflow-y-auto rounded-md border bg-muted p-3">
              {generatedCodes.map((code) => (
                <div key={code} className="font-mono text-sm py-0.5">{code}</div>
              ))}
            </div>
          </div>
        ) : (
          // Form
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Plan</Label>
                <Select value={plan} onValueChange={setPlan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STARTER">Starter</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Durasi</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 hari</SelectItem>
                    <SelectItem value="90">90 hari</SelectItem>
                    <SelectItem value="180">180 hari</SelectItem>
                    <SelectItem value="365">365 hari</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qty">
                Jumlah kode <span className="text-muted-foreground">(maks. 50)</span>
              </Label>
              <Input
                id="qty"
                type="number"
                min={1}
                max={50}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expires">
                Kode expired tanggal <span className="text-muted-foreground">(opsional)</span>
              </Label>
              <Input
                id="expires"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {generatedCodes.length > 0 ? 'Tutup' : 'Batal'}
          </Button>
          {generatedCodes.length === 0 && (
            <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>
              ) : (
                'Generate'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// PAGE
// ==========================================

export default function AdminRedeemCodesPage() {
  const [isUsedFilter, setIsUsedFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [generateOpen, setGenerateOpen] = useState(false);

  const { result, isLoading, refetch } = useRedeemCodes({
    page,
    limit: 20,
    isUsed: isUsedFilter === 'ALL' ? undefined : isUsedFilter === 'true',
  });

  const { deleteCode } = useCreateRedeemCodes();
  const totalPages = result ? Math.ceil(result.total / 20) : 1;

  const handleDelete = async (id: string) => {
    await deleteCode(id);
    refetch();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Redeem Codes</h1>
          <p className="text-sm text-muted-foreground">
            {result ? `${result.total} kode total` : 'Memuat...'}
          </p>
        </div>
        <Button onClick={() => setGenerateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Generate Kode
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select
          value={isUsedFilter}
          onValueChange={(v) => { setIsUsedFilter(v); setPage(1); }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua kode</SelectItem>
            <SelectItem value="false">Belum dipakai</SelectItem>
            <SelectItem value="true">Sudah dipakai</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : result?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Tidak ada kode
                </TableCell>
              </TableRow>
            ) : (
              result?.data.map((code) => (
                <TableRow key={code.id} className={code.isUsed ? 'opacity-50' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm">{code.code}</code>
                      {!code.isUsed && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyCode(code.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {code.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{code.durationDay} hari</TableCell>
                  <TableCell>
                    <Badge variant={code.isUsed ? 'secondary' : 'default'} className="text-xs">
                      {code.isUsed ? 'Terpakai' : 'Tersedia'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {code.expiresAt
                      ? new Date(code.expiresAt).toLocaleDateString('id-ID')
                      : '—'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(code.createdAt).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    {!code.isUsed && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus kode ini?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Kode <code className="font-mono">{code.code}</code> akan dihapus permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(code.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Halaman {page} dari {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* Generate Dialog */}
      <GenerateDialog
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}