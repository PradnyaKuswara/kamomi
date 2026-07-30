export const parseFeatures = (featuresRaw: string): string[] => {
  if (!featuresRaw) return [];
  try {
    const parsed = JSON.parse(featuresRaw);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {}
  return [featuresRaw];
};

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};