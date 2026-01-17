# 🔥 DEBUG: Landing Config Save Issue

## MASALAH
Live preview berhasil, tapi setelah publish, store page masih tampil DEFAULT data.

## ROOT CAUSE ANALYSIS

### ✅ Frontend (UMKM-CLIENT) - SUDAH FIX
1. **Cache Issue** - FIXED dengan `export const dynamic = 'force-dynamic'`
   - `/src/app/store/[slug]/page.tsx`
   - `/src/app/store/[slug]/layout.tsx`

### ❓ Backend (SERVER) - PERLU CEK

Backend validator terlalu strict! File `landing-config.validator.ts` punya:
```typescript
additionalProperties: false  // ⚠️ Reject unknown fields!
```

## 🧪 CARA TEST BACKEND

### Test 1: Cek apakah data tersimpan di database

```bash
# Di server terminal, cek database
psql $DATABASE_URL

# Query:
SELECT
  slug,
  name,
  "landingConfig"
FROM "Tenant"
WHERE slug = 'burgerchina';
```

**Expected:**
- Kalau data `landingConfig` kosong `{}` atau `null` → **BACKEND TIDAK MENYIMPAN!**
- Kalau data ada tapi masih default → **VALIDATOR REJECT data kita!**

### Test 2: Cek Backend Logs

```bash
# Di server terminal
npm run dev

# Saat kamu klik "Publish", perhatikan logs:
# ❌ Error: "Invalid landing page configuration"
# ❌ Error: "additionalProperties"
# ❌ Error: Validation error
```

### Test 3: Cek Network Request di Browser

1. Buka Chrome DevTools (F12)
2. Tab "Network"
3. Klik "Publish" di customize page
4. Cek request ke `/api/tenants/me` atau `/tenants/me`
5. Lihat:
   - **Request Payload:** Apa yang dikirim frontend?
   - **Response:** Apa yang dikembalikan backend?
   - **Status Code:** 200 OK atau 400 Bad Request?

## 🔧 SOLUSI BACKEND

### Opsi 1: Update Validator (RECOMMENDED)

Edit `server/src/validators/landing-config.validator.ts`:

```typescript
const landingConfigSchema = {
  type: 'object' as const,
  properties: {
    // ... existing properties ...
  },
  additionalProperties: true,  // ✅ Allow unknown fields
};

// Atau untuk sub-objects:
hero: {
  type: 'object' as const,
  properties: { /* ... */ },
  additionalProperties: true,  // ✅ Allow unknown fields in hero config
},
```

### Opsi 2: Pastikan Frontend Kirim Data yang Benar

Cek di `use-landing-config.ts` → `publishChanges()`:

```typescript
const preparedConfig = prepareConfigForSave(config);
console.log('📤 Sending to backend:', JSON.stringify(preparedConfig, null, 2));
```

## 🎯 ACTION ITEMS

1. ✅ Frontend cache - SUDAH FIX
2. ⏳ Cek database - apakah data tersimpan?
3. ⏳ Cek backend logs - ada error validation?
4. ⏳ Cek network request - status 200 atau 400?
5. ⏳ Fix backend validator jika perlu

## 📊 DEBUGGING CHECKLIST

- [ ] Database query menunjukkan landingConfig tersimpan
- [ ] Backend logs tidak ada error validation
- [ ] Network request status 200 OK
- [ ] Response dari backend return data yang benar
- [ ] Store page (setelah hard refresh) tampil data baru

---

**Next Step:** Test 3 hal di atas, lalu report hasilnya!
