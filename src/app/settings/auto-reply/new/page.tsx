'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAutoReply } from '@/hooks/use-auto-reply';
import { RuleForm } from '@/components/auto-reply';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { CreateAutoReplyRuleInput } from '@/types/chat';

// ==========================================
// CREATE AUTO-REPLY RULE PAGE
// ==========================================

export default function NewAutoReplyRulePage() {
  const router = useRouter();
  const { createRule, isSaving } = useAutoReply();

  const handleSubmit = useCallback(
    async (data: CreateAutoReplyRuleInput) => {
      const result = await createRule(data);
      if (result) {
        router.push('/dashboard/auto-reply');
      }
    },
    [createRule, router]
  );

  return (
    <div className="container max-w-3xl py-8">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/dashboard/auto-reply">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Buat Aturan Auto-Reply
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Tambahkan aturan baru untuk membalas pesan pelanggan secara otomatis
        </p>
      </div>

      {/* Form */}
      <RuleForm onSubmit={handleSubmit} isSubmitting={isSaving} />
    </div>
  );
}
