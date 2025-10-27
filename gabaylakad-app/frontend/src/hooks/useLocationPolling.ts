import { useState, useEffect, useCallback } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp?: string;
  [key: string]: any;
}

export function useLocationPolling(serialNumber: string, endpoint: string, intervalMs = 5000) {
  const [data, setData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${endpoint}${endpoint.includes('?') ? '&' : '?'}serial_number=${serialNumber}`);
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.message || 'Unknown error');
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [serialNumber, endpoint]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalMs);
    return () => clearInterval(interval);
  }, [fetchData, intervalMs]);

  return { data, loading, error, refresh: fetchData };
}
