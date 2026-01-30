'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import { onQRCode, onConnectionStatus } from '@/lib/socket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, Phone, RefreshCw, QrCode, AlertCircle } from 'lucide-react';
import { cn, formatPhone } from '@/lib/utils';
import type { WhatsAppStatus } from '@/types/chat';

// ==========================================
// CONSTANTS
// ==========================================
const QR_REFRESH_INTERVAL = 20000; // 20 seconds
const QR_TIMEOUT_DURATION = 120000; // 2 minutes

// ==========================================
// WHATSAPP CONNECTION PAGE
// ==========================================

export default function WhatsAppConnectionPage() {
  const router = useRouter();
  const {
    status,
    phoneNumber,
    qrCode,
    isConnecting,
    connect,
    disconnect,
    checkStatus,
    setStatus,
    setQRCode,
    setPhoneNumber,
  } = useWhatsApp();

  const hasAutoConnected = useRef(false);
  const isWebSocketUpdate = useRef(false);

  // Redirect when connected
  useEffect(() => {
    if (status === 'CONNECTED') {
      const timer = setTimeout(() => {
        router.push('/dashboard/inbox');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  // WebSocket listeners
  useEffect(() => {
    const unsubQR = onQRCode((data) => {
      setQRCode(data.qrCode);
      setStatus('QR_PENDING');
    });

    const unsubStatus = onConnectionStatus((data) => {
      isWebSocketUpdate.current = true;
      setStatus(data.status as WhatsAppStatus);
      if (data.phoneNumber) {
        setPhoneNumber(data.phoneNumber);
      }
      if (data.status === 'CONNECTED') {
        setQRCode(null);
      }
    });

    checkStatus();

    return () => {
      unsubQR();
      unsubStatus();
    };
  }, []);

  // Auto-connect on load
  useEffect(() => {
    if (
      hasAutoConnected.current ||
      isConnecting ||
      status !== 'DISCONNECTED' ||
      isWebSocketUpdate.current
    ) {
      return;
    }

    hasAutoConnected.current = true;
    connect().catch((err) => {
      console.error('Auto-connect failed:', err);
    });
  }, [status, isConnecting, connect]);

  const handleConnect = useCallback(async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }, [connect]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  }, [disconnect]);

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Koneksi WhatsApp</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Hubungkan akun WhatsApp Anda untuk menerima dan membalas pesan pelanggan
        </p>
      </div>

      {/* Main Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Status Koneksi</CardTitle>
            <StatusBadge status={status} />
          </div>
        </CardHeader>
        <CardContent>
          <ConnectionContent
            status={status}
            phoneNumber={phoneNumber}
            qrCode={qrCode}
            isConnecting={isConnecting}
            isWebSocketDisconnect={isWebSocketUpdate.current}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </CardContent>
      </Card>

      {/* Instructions - Only when not connected */}
      {status !== 'CONNECTED' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cara Menghubungkan</CardTitle>
            <CardDescription>Scan QR code dengan WhatsApp di ponsel Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-medium text-xs">
                  1
                </span>
                <span>Buka WhatsApp di ponsel Anda</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-medium text-xs">
                  2
                </span>
                <span>Tap menu (⋮) → Perangkat Tertaut → Tautkan Perangkat</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-medium text-xs">
                  3
                </span>
                <span>Arahkan kamera ke QR code di atas</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({ status }: { status: WhatsAppStatus }) {
  const config = {
    CONNECTED: {
      label: 'Terhubung',
      className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    DISCONNECTED: {
      label: 'Terputus',
      className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    QR_PENDING: {
      label: 'Menunggu Scan',
      className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    CONNECTING: {
      label: 'Menghubungkan',
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
  };

  const { label, className } = config[status] || config.DISCONNECTED;

  return (
    <Badge variant="outline" className={cn('font-medium', className)}>
      {label}
    </Badge>
  );
}

// ==========================================
// CONNECTION CONTENT - SIMPLIFIED
// ==========================================

interface ConnectionContentProps {
  status: WhatsAppStatus;
  phoneNumber: string | null;
  qrCode: string | null;
  isConnecting: boolean;
  isWebSocketDisconnect: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

function ConnectionContent({
  status,
  phoneNumber,
  qrCode,
  isConnecting,
  isWebSocketDisconnect,
  onConnect,
}: ConnectionContentProps) {
  const [qrExpired, setQrExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // QR Timer
  useEffect(() => {
    if (status === 'QR_PENDING' && qrCode) {
      setQrExpired(false);
      setTimeLeft(120);

      // Countdown
      countdownRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setQrExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Timeout
      timeoutRef.current = setTimeout(() => {
        setQrExpired(true);
      }, QR_TIMEOUT_DURATION);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [status, qrCode]);

  // ==========================================
  // RENDER: LOADING (Simple spinner in card)
  // ==========================================

  const isLoading =
    isConnecting ||
    status === 'CONNECTING' ||
    (status === 'DISCONNECTED' && !isWebSocketDisconnect) ||
    (status === 'QR_PENDING' && !qrCode);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  // ==========================================
  // RENDER: QR CODE ACTIVE
  // ==========================================

  if (status === 'QR_PENDING' && qrCode && !qrExpired) {
    return (
      <div className="text-center py-6">
        {/* QR Code */}
        <div className="inline-block p-4 bg-white rounded-lg shadow-sm mb-4">
          <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          <RefreshCw className="h-4 w-4" />
          <span>Kadaluarsa dalam {timeLeft}s</span>
        </div>

        {/* Refresh Button */}
        <Button variant="outline" size="sm" onClick={onConnect} disabled={isConnecting}>
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Memuat...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh QR
            </>
          )}
        </Button>
      </div>
    );
  }

  // ==========================================
  // RENDER: QR EXPIRED
  // ==========================================

  if (status === 'QR_PENDING' && qrExpired) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-2">
          QR Code Kadaluarsa
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          Klik tombol untuk memuat ulang
        </p>
        <Button onClick={onConnect} disabled={isConnecting}>
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Memuat...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Muat Ulang
            </>
          )}
        </Button>
      </div>
    );
  }

  // ==========================================
  // RENDER: CONNECTED
  // ==========================================

  if (status === 'CONNECTED') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-3 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-2">
          Berhasil Terhubung!
        </h3>
        {phoneNumber && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2 flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            {formatPhone(phoneNumber)}
          </p>
        )}
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Mengalihkan ke Inbox...</p>
      </div>
    );
  }

  // ==========================================
  // RENDER: DISCONNECTED (WebSocket)
  // ==========================================

  if (status === 'DISCONNECTED' && isWebSocketDisconnect) {
    return (
      <div className="text-center py-12">
        <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-2">
          Sesi Terputus
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          Klik tombol untuk membuat QR code baru
        </p>
        <Button onClick={onConnect} disabled={isConnecting}>
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Memuat QR...
            </>
          ) : (
            <>
              <QrCode className="h-4 w-4 mr-2" />
              Buat QR Code
            </>
          )}
        </Button>
      </div>
    );
  }

  // Fallback
  return null;
}
