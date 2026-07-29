export const parseFeatures = (featuresRaw: string): string[] => {
  if (!featuresRaw) return [];
  try {
    const parsed = JSON.parse(featuresRaw);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {}
  return [featuresRaw];
};