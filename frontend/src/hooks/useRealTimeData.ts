import { useEffect, useRef, useState } from 'react';

/**
 * Hook untuk polling data secara real-time
 * @param fetchFn - Fungsi untuk fetch data
 * @param interval - Interval polling dalam milliseconds (default: 5000ms)
 * @param enabled - Apakah polling aktif (default: true)
 */
export const useRealTimeData = <T,>(
  fetchFn: () => Promise<T>,
  interval: number = 5000,
  enabled: boolean = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Real-time data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!enabled) return;
    fetchData();
  }, [enabled]);

  // Setup polling
  useEffect(() => {
    if (!enabled) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      return;
    }

    pollingIntervalRef.current = setInterval(() => {
      fetchData();
    }, interval);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [enabled, interval]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, loading, error, refetch };
};

/**
 * Hook untuk update status dengan notifikasi
 * Digunakan untuk tracking perubahan status pembayaran
 */
export const useStatusTracker = <T extends { status: string; id: string }>(
  initialData: T[] = []
) => {
  const [data, setData] = useState<T[]>(initialData);
  const [statusUpdates, setStatusUpdates] = useState<Map<string, string>>(new Map());
  const prevDataRef = useRef<T[]>(initialData);

  useEffect(() => {
    const updates = new Map<string, string>();
    
    data.forEach((item) => {
      const prevItem = prevDataRef.current.find((p) => p.id === item.id);
      if (prevItem && prevItem.status !== item.status) {
        updates.set(item.id, item.status);
      }
    });

    if (updates.size > 0) {
      setStatusUpdates(updates);
      prevDataRef.current = data;
    }
  }, [data]);

  return { data, setData, statusUpdates };
};
