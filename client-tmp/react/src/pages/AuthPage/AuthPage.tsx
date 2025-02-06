import React from 'react';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  return (
    <section className="auth-page">
      <client-app-login></client-app-login>
    </section>
  );
};

export default AuthPage;