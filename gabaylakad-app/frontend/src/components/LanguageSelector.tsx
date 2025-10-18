import React, { useState } from 'react';

const languages = [
  { code: 'ceb', name: 'Cebuano' },
  { code: 'en', name: 'English' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'es', name: 'Spanish' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'fr', name: 'French' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'de', name: 'German' },
  { code: 'ko', name: 'Korean' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'fa', name: 'Persian' },
];

const LanguageSelector: React.FC = () => {
  const [selected, setSelected] = useState('ceb');
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.1rem 1.2rem', borderBottom: '1px solid #f7f7f7', fontWeight: 600,
          color: '#232946', fontSize: '1.08rem', cursor: 'pointer',
        }}
        onClick={() => setOpen(!open)}
      >
        <span><i className="fas fa-language" style={{ marginRight: 12, color: '#232946' }}></i>Language</span>
        <span style={{ color: '#232946', fontSize: '1.08rem', fontWeight: 500 }}>{languages.find(l => l.code === selected)?.name}</span>
        <i className={`fas fa-chevron-${open ? 'up' : 'down'}`} style={{ color: '#232946', fontSize: '1.1rem', marginLeft: 8 }}></i>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', zIndex: 10, borderRadius: 8, boxShadow: '0 2px 12px rgba(44,62,80,0.08)', maxHeight: 260, overflowY: 'auto' }}>
          {languages.map(lang => (
            <div
              key={lang.code}
              style={{
                padding: '0.9rem 1.2rem', fontWeight: 500, color: selected === lang.code ? '#2980b9' : '#232946',
                background: selected === lang.code ? '#e0e6ed' : 'transparent', cursor: 'pointer',
              }}
              onClick={() => { setSelected(lang.code); setOpen(false); }}
            >
              {lang.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
