/**
 * Formats a number to Indonesian Rupiah (IDR) currency format.
 * Example: 0 -> "Rp 0", 29000 -> "Rp 29.000"
 */
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount == null || isNaN(amount)) return 'Rp 0';
  if (amount === 0) return 'Rp 0';
  return `Rp ${amount.toLocaleString('id-ID')}`;
};
