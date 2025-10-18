import React, { useState, useEffect } from 'react';

interface DashboardSectionLoaderProps {
  fetcher: () => Promise<any>;
  children: (data: any, loading: boolean) => React.ReactNode;
}

const DashboardSectionLoader: React.FC<DashboardSectionLoaderProps> = ({ fetcher, children }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetcher().then(res => {
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [fetcher]);

  return <>{children(data, loading)}</>;
};

export default DashboardSectionLoader;
