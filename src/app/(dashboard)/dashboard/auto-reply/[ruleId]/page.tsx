'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAutoReply } from '@/hooks/use-auto-reply';
import { RuleForm } from '@/components/auto-reply';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { CreateAutoReplyRuleInput } from '@/types/chat';

// ==========================================
// EDIT AUTO-REPLY RULE PAGE
// ==========================================

export default function EditAutoReplyRulePage() {
  const router = useRouter();
  const params = useParams();
  const ruleId = params.ruleId as string;

  const { selectedRule, isLoading, isSaving, fetchRule, updateRule } = useAutoReply();

  useEffect(() => {
    if (ruleId) {
      fetchRule(ruleId);
    }
  }, [ruleId]);

  const handleSubmit = useCallback(
    async (data: CreateAutoReplyRuleInput) => {
      const result = await updateRule(ruleId, data);
      if (result) {
        router.push('/dashboard/auto-reply');
      }
    },
    [updateRule, ruleId, router]
  );

  if (isLoading) {
    return (
      <div className="container max-w-3xl py-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!selectedRule) {
    return (
      <div className="container max-w-3xl py-8 text-center">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Aturan Tidak Ditemukan
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">
          Aturan auto-reply yang Anda cari tidak ditemukan.
        </p>
        <Button asChild>
          <Link href="/dashboard/auto-reply">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </Link>
        </Button>
      </div>
    );
  }

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
          Edit Aturan Auto-Reply
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Perbarui pengaturan aturan auto-reply
        </p>
      </div>

      {/* Form */}
      <RuleForm initialData={selectedRule} onSubmit={handleSubmit} isSubmitting={isSaving} />
    </div>
  );
}
