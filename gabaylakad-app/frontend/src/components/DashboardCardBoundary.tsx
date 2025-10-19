import React from 'react';

interface DashboardCardBoundaryProps {
  children: React.ReactNode;
}

interface DashboardCardBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class DashboardCardBoundary extends React.Component<DashboardCardBoundaryProps, DashboardCardBoundaryState> {
  constructor(props: DashboardCardBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging/telemetry
    console.error('DashboardCardBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1rem', color: '#e74c3c', background: '#fff6f6', borderRadius: 8, textAlign: 'center', fontWeight: 600 }}>
          ⚠️ Error loading data
        </div>
      );
    }
    return this.props.children;
  }
}

export default DashboardCardBoundary;
