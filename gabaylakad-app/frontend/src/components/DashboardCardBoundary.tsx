import React from 'react';
import { Alert, AlertTitle } from '@mui/material'; // Import MUI Alert

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
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('DashboardCardBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Use MUI Alert for consistent error display
      return (
        <Alert severity="error" sx={{ width: '100%', alignItems: 'center' }}>
          <AlertTitle>Error</AlertTitle>
          Failed to load card data. Please try refreshing.
           {/* Optionally display error details in development */}
           {process.env.NODE_ENV === 'development' && this.state.error?.message && (
             <pre style={{ fontSize: '0.7rem', marginTop: '8px', whiteSpace: 'pre-wrap' }}>
               {this.state.error.message}
             </pre>
           )}
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default DashboardCardBoundary;
