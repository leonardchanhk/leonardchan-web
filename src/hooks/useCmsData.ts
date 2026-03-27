import { useState, useEffect } from 'react';

interface CmsData {
  pages: Record<string, Record<string, string>>;
  settings: Record<string, string>;
  modules: Record<string, any[]>;
  generatedAt: string;
}

let cachedData: CmsData | null = null;
let loadPromise: Promise<CmsData> | null = null;

async function loadCmsData(): Promise<CmsData> {
  if (cachedData) return cachedData;
  if (loadPromise) return loadPromise;

  loadPromise = fetch('/cms-data.json')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load CMS data');
      return res.json();
    })
    .then((data) => {
      cachedData = data;
      return data;
    })
    .catch(() => {
      // Fallback: return empty structure
      const empty: CmsData = { pages: {}, settings: {}, modules: {}, generatedAt: '' };
      cachedData = empty;
      return empty;
    });

  return loadPromise;
}

export function useCmsData() {
  const [data, setData] = useState<CmsData | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }
    loadCmsData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function usePageContent(slug: string) {
  const { data, loading } = useCmsData();
  return {
    content: data?.pages?.[slug] ?? {},
    loading,
  };
}

export function useModule(moduleName: string) {
  const { data, loading } = useCmsData();
  return {
    items: data?.modules?.[moduleName] ?? [],
    loading,
  };
}

export function useSetting(key: string, fallback = '') {
  const { data } = useCmsData();
  return data?.settings?.[key] ?? fallback;
}
