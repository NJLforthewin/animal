
import LoadingValue from './LoadingValue';

const MobileActivity: React.FC<{ activity: string; steps: string | number; loading?: boolean }> = ({ activity, steps, loading = false }) => {
  const status = activity && String(activity).trim() ? activity : '';
  const stepsText = steps !== undefined && steps !== null && String(steps).trim() ? `${steps}` : '';
  return (
    <div className="dashboard-mobile-card mobile-card-pos">
      <div className="card-title-row">
        <div className="card-title">ACTIVITY</div>
        <div className="card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M13 2v8l5.5 2.5L13 15v7l9-5.5V7L13 2zM4 6v12l9 5.5V7L4 6z"/>
          </svg>
        </div>
      </div>
      <div className="field-row">
        <div className="field-label">Status</div>
        <LoadingValue loading={loading} value={status} className="field-value" title={status} compact />
      </div>
      <div className="field-row">
        {/* Compact steps: hide label to save horizontal space on small screens - render number only */}
        <div style={{ flex: 1 }} />
        <LoadingValue loading={loading} value={stepsText} className="field-value" title={stepsText} compact />
      </div>
    </div>
  );
};

export default MobileActivity;
