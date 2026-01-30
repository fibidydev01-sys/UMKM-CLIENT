'use client';

import { MessageSquareText } from 'lucide-react';

// ==========================================
// CHAT EMPTY STATE COMPONENT
// ==========================================

export function ChatEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="text-center max-w-sm px-4">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
          <MessageSquareText className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          WhatsApp Chat
        </h2>

        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Pilih percakapan dari daftar di sebelah kiri untuk mulai berkirim pesan dengan pelanggan
          Anda.
        </p>

        {/* Features */}
        <div className="text-left space-y-3">
          <FeatureItem
            icon="💬"
            title="Balas Pesan"
            description="Balas pesan pelanggan langsung dari dashboard"
          />
          <FeatureItem
            icon="🤖"
            title="Auto-Reply"
            description="Atur balasan otomatis untuk respon cepat"
          />
          <FeatureItem icon="📊" title="Riwayat" description="Lihat semua riwayat percakapan" />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FEATURE ITEM
// ==========================================

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white dark:bg-zinc-800 rounded-lg">
      <span className="text-xl">{icon}</span>
      <div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
    </div>
  );
}
