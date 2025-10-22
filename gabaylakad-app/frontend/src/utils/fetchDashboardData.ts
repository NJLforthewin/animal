// Fetch dashboard data utility for Dashboard.tsx
export async function fetchDashboardData() {
  const token = sessionStorage.getItem('token');
  try {
    const res = await fetch('/api/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return { error: 'Unable to load dashboard. Please try again.' };
    }
    return await res.json();
  } catch (err) {
    return { error: 'Unable to load dashboard. Please try again.' };
  }
}
