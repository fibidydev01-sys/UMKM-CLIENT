'use client';

import { forwardRef } from 'react';
import Image from 'next/image';
import { formatPrice, formatDate } from '@/lib/format';
import { getLogoUrl } from '@/lib/cloudinary';
import type { Order, Tenant } from '@/types';

// ==========================================
// INVOICE TEMPLATE - HTML2CANVAS COMPATIBLE
// Uses inline HEX colors (no lab() colors)
// ==========================================

export interface InvoiceTemplateProps {
  order: Order;
  tenant: Pick<Tenant, 'name' | 'logo' | 'phone' | 'whatsapp' | 'address'>;
}

// Color constants (HEX - html2canvas compatible)
const COLORS = {
  pink500: '#ec4899',
  pink600: '#db2777',
  pink50: '#fdf2f8',
  pink100: '#fce7f3',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray900: '#111827',
  green100: '#dcfce7',
  green600: '#16a34a',
  green700: '#15803d',
  yellow100: '#fef9c3',
  yellow700: '#a16207',
  orange100: '#ffedd5',
  orange700: '#c2410c',
  red100: '#fee2e2',
  red700: '#b91c1c',
  white: '#ffffff',
};

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  function InvoiceTemplate({ order, tenant }, ref) {
    const customerName = order.customer?.name || order.customerName || 'Pelanggan';
    const customerPhone = order.customer?.phone || order.customerPhone || '-';
    const customerAddress = order.customer?.address || '-';

    return (
      <div
        ref={ref}
        style={{
          backgroundColor: COLORS.white,
          padding: '24px',
          width: '500px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          color: COLORS.gray900,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: `2px solid ${COLORS.pink500}`,
            paddingBottom: '12px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {tenant.logo ? (
              <Image
                src={getLogoUrl(tenant.logo)}
                alt={tenant.name}
                width={48}
                height={48}
                style={{
                  objectFit: 'contain',
                  borderRadius: '4px',
                }}
                unoptimized
              />
            ) : (
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: COLORS.pink100,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    color: COLORS.pink600,
                    fontWeight: 'bold',
                    fontSize: '18px',
                  }}
                >
                  {tenant.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: COLORS.gray900,
                  margin: 0,
                }}
              >
                {tenant.name}
              </h1>
              {tenant.phone && (
                <p style={{ fontSize: '12px', color: COLORS.gray600, margin: '2px 0 0 0' }}>
                  {tenant.phone}
                </p>
              )}
              {tenant.address && (
                <p
                  style={{
                    fontSize: '12px',
                    color: COLORS.gray600,
                    margin: '2px 0 0 0',
                    maxWidth: '180px',
                    lineHeight: '1.3',
                  }}
                >
                  {tenant.address}
                </p>
              )}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: COLORS.pink600,
                margin: 0,
              }}
            >
              INVOICE
            </h2>
            <p style={{ fontSize: '12px', color: COLORS.gray600, margin: '4px 0 0 0' }}>
              #{order.orderNumber}
            </p>
            <p style={{ fontSize: '12px', color: COLORS.gray600, margin: '2px 0 0 0' }}>
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div
          style={{
            marginBottom: '16px',
            backgroundColor: COLORS.gray50,
            padding: '12px',
            borderRadius: '4px',
          }}
        >
          <h3
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: COLORS.gray500,
              margin: '0 0 4px 0',
              textTransform: 'uppercase',
            }}
          >
            Ditagihkan Kepada:
          </h3>
          <p style={{ fontWeight: '600', color: COLORS.gray900, margin: '0 0 2px 0' }}>
            {customerName}
          </p>
          <p style={{ fontSize: '12px', color: COLORS.gray600, margin: '0 0 2px 0' }}>
            {customerPhone}
          </p>
          {customerAddress !== '-' && (
            <p style={{ fontSize: '12px', color: COLORS.gray600, margin: 0 }}>
              {customerAddress}
            </p>
          )}
        </div>

        {/* Items Table */}
        <table
          style={{
            width: '100%',
            marginBottom: '16px',
            fontSize: '12px',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: COLORS.pink50 }}>
              <th
                style={{
                  textAlign: 'left',
                  padding: '8px',
                  fontWeight: '600',
                  color: COLORS.gray700,
                  borderTopLeftRadius: '4px',
                }}
              >
                Item
              </th>
              <th
                style={{
                  textAlign: 'center',
                  padding: '8px 4px',
                  fontWeight: '600',
                  color: COLORS.gray700,
                  width: '40px',
                }}
              >
                Qty
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '8px',
                  fontWeight: '600',
                  color: COLORS.gray700,
                  width: '80px',
                }}
              >
                Harga
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '8px',
                  fontWeight: '600',
                  color: COLORS.gray700,
                  width: '90px',
                  borderTopRightRadius: '4px',
                }}
              >
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  backgroundColor: index % 2 === 0 ? COLORS.white : COLORS.gray50,
                }}
              >
                <td style={{ padding: '8px' }}>
                  <p style={{ fontWeight: '500', color: COLORS.gray900, margin: 0 }}>
                    {item.name}
                  </p>
                  {item.notes && (
                    <p style={{ fontSize: '10px', color: COLORS.gray500, margin: '2px 0 0 0' }}>
                      {item.notes}
                    </p>
                  )}
                </td>
                <td
                  style={{
                    padding: '8px 4px',
                    textAlign: 'center',
                    color: COLORS.gray700,
                  }}
                >
                  {item.qty}
                </td>
                <td
                  style={{
                    padding: '8px',
                    textAlign: 'right',
                    color: COLORS.gray700,
                  }}
                >
                  {formatPrice(item.price)}
                </td>
                <td
                  style={{
                    padding: '8px',
                    textAlign: 'right',
                    fontWeight: '500',
                    color: COLORS.gray900,
                  }}
                >
                  {formatPrice(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div
          style={{
            borderTop: `1px solid ${COLORS.gray200}`,
            paddingTop: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '180px', fontSize: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px 0',
                }}
              >
                <span style={{ color: COLORS.gray600 }}>Subtotal</span>
                <span style={{ color: COLORS.gray900 }}>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '4px 0',
                    color: COLORS.green600,
                  }}
                >
                  <span>Diskon</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '4px 0',
                  }}
                >
                  <span style={{ color: COLORS.gray600 }}>Pajak</span>
                  <span style={{ color: COLORS.gray900 }}>{formatPrice(order.tax)}</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderTop: `2px solid ${COLORS.pink500}`,
                  marginTop: '4px',
                }}
              >
                <span style={{ fontWeight: 'bold', color: COLORS.gray900 }}>TOTAL</span>
                <span style={{ fontWeight: 'bold', color: COLORS.pink600 }}>
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
          }}
        >
          <div>
            <span style={{ color: COLORS.gray500 }}>Status: </span>
            <PaymentBadge status={order.paymentStatus} />
          </div>
          {order.paymentMethod && (
            <span style={{ color: COLORS.gray500 }}>Metode: {order.paymentMethod}</span>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: `1px solid ${COLORS.gray200}`,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '12px', color: COLORS.gray500, margin: 0 }}>
            Terima kasih atas pesanan Anda!
          </p>
          <p style={{ fontSize: '10px', color: COLORS.gray400, margin: '4px 0 0 0' }}>
            Powered by fibidy.com
          </p>
        </div>
      </div>
    );
  }
);

// Payment Badge with inline styles
function PaymentBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; bg: string; color: string }> = {
    PENDING: { label: 'Menunggu', bg: COLORS.yellow100, color: COLORS.yellow700 },
    PAID: { label: 'Lunas', bg: COLORS.green100, color: COLORS.green700 },
    PARTIAL: { label: 'Sebagian', bg: COLORS.orange100, color: COLORS.orange700 },
    FAILED: { label: 'Gagal', bg: COLORS.red100, color: COLORS.red700 },
  };

  const { label, bg, color } = config[status] || {
    label: status,
    bg: COLORS.gray100,
    color: COLORS.gray700,
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        padding: '2px 8px',
        fontSize: '10px',
        fontWeight: '600',
        borderRadius: '9999px',
        backgroundColor: bg,
        color: color,
      }}
    >
      {label}
    </span>
  );
}