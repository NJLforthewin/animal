import React from 'react';

interface Field {
  label: string;
  value: React.ReactNode;
}

interface MobileCardProps {
  title: string;
  fields: Field[];
}

const MobileCard: React.FC<MobileCardProps> = ({ title, fields }) => {
  return (
    <div className="dashboard-mobile-card-inner">
      <div className="card-title-row">
        <div className="card-title">{title}</div>
        {/* icon is rendered by the parent wrapper for consistent positioning */}
      </div>
      {fields.map((f, i) => (
        <div key={i} style={{ marginBottom: 6, width: '100%' }}>
          <div style={{ fontWeight: 600 }}>{f.label}</div>
          <div style={{ marginTop: 4 }}>{f.value}</div>
        </div>
      ))}
    </div>
  );
};

export default MobileCard;
