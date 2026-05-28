import React from 'react';

const Header = ({ title, subtitle }) => {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="text-muted">
        {new Date().toLocaleDateString('en-US', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })}
      </div>
    </header>
  );
};

export default Header;
