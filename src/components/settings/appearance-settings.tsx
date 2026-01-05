"use client";

import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/upload/image-upload";

// ==========================================
// THEME COLORS - Connect ke backend theme.primaryColor
// ==========================================
const THEME_COLORS = [
  { name: "Default", value: "#0ea5e9", class: "bg-sky-500" },
  { name: "Emerald", value: "#10b981", class: "bg-emerald-500" },
  { name: "Rose", value: "#f43f5e", class: "bg-rose-500" },
  { name: "Amber", value: "#f59e0b", class: "bg-amber-500" },
  { name: "Violet", value: "#8b5cf6", class: "bg-violet-500" },
  { name: "Orange", value: "#f97316", class: "bg-orange-500" },
] as const;

interface AppearanceSettingsProps {
  tenantData: {
    logo?: string | null;
    banner?: string | null;
    theme?: {
      primaryColor?: string;
    } | null;
  };
  onUpdate: (data: {
    logo?: string;
    banner?: string;
    theme?: { primaryColor: string };
  }) => Promise<void>;
  isLoading?: boolean;
}

export function AppearanceSettings({
  tenantData,
  onUpdate,
  isLoading: externalLoading,
}: AppearanceSettingsProps) {
  // Local state for optimistic updates
  const [logo, setLogo] = useState(tenantData?.logo || "");
  const [banner, setBanner] = useState(tenantData?.banner || "");
  const [primaryColor, setPrimaryColor] = useState(
    tenantData?.theme?.primaryColor || THEME_COLORS[0].value
  );
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync state when tenantData changes
  useEffect(() => {
    setLogo(tenantData?.logo || "");
    setBanner(tenantData?.banner || "");
    setPrimaryColor(tenantData?.theme?.primaryColor || THEME_COLORS[0].value);
  }, [tenantData]);

  // Track changes
  useEffect(() => {
    const originalLogo = tenantData?.logo || "";
    const originalBanner = tenantData?.banner || "";
    const originalColor = tenantData?.theme?.primaryColor || THEME_COLORS[0].value;

    const changed =
      logo !== originalLogo ||
      banner !== originalBanner ||
      primaryColor !== originalColor;

    setHasChanges(changed);
  }, [logo, banner, primaryColor, tenantData]);

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate({
        logo: logo || undefined,
        banner: banner || undefined,
        theme: { primaryColor },
      });

      toast.success("Tampilan berhasil diperbarui");
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to update appearance:", error);
      toast.error("Gagal memperbarui tampilan");
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = externalLoading || isSaving;

  return (
    <div className="space-y-6">
      {/* Logo & Banner */}
      <Card>
        <CardHeader>
          <CardTitle>Logo & Banner</CardTitle>
          <CardDescription>
            Gambar yang ditampilkan di toko online Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Logo Toko</label>
            <p className="text-xs text-muted-foreground">
              Rasio 1:1 (kotak), ukuran rekomendasi 512x512px
            </p>
            <div className="w-32">
              <ImageUpload
                value={logo}
                onChange={setLogo}
                onRemove={() => setLogo("")}
                aspectRatio={1}
                folder="tenant-logos"
                placeholder="Upload Logo"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Banner */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Banner Toko</label>
            <p className="text-xs text-muted-foreground">
              Rasio 3:1 (landscape), ukuran rekomendasi 1200x400px
            </p>
            <div className="max-w-md">
              <ImageUpload
                value={banner}
                onChange={setBanner}
                onRemove={() => setBanner("")}
                aspectRatio={3}
                folder="tenant-banners"
                placeholder="Upload Banner"
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Color */}
      <Card>
        <CardHeader>
          <CardTitle>Warna Tema</CardTitle>
          <CardDescription>
            Pilih warna utama untuk toko online Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {THEME_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setPrimaryColor(color.value)}
                disabled={isLoading}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  primaryColor === color.value
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-muted-foreground/20",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    color.class
                  )}
                >
                  {primaryColor === color.value && (
                    <Check className="h-5 w-5 text-white" />
                  )}
                </div>
                <span className="text-xs font-medium">{color.name}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Warna tema akan diterapkan pada tombol, link, dan elemen aksen di toko online Anda.
          </p>
        </CardContent>
      </Card>

      {/* Dark Mode Info */}
      <Card>
        <CardHeader>
          <CardTitle>Mode Gelap</CardTitle>
          <CardDescription>
            Ubah tampilan antara mode terang dan gelap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Gunakan tombol 🌙/☀️ di header untuk mengubah mode tampilan.
            Preferensi akan disimpan secara otomatis di browser Anda.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      {hasChanges && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </div>
      )}
    </div>
  );
}