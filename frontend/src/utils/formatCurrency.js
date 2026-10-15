/**
 * Format a number to Vietnamese Dong currency string
 * e.g. 5400000 -> "5.400.000 ₫"
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default formatCurrency;
