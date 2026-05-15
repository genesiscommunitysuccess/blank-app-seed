import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { configureFoundationLogin } from '../../share/foundation-login.ts';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    configureFoundationLogin({ navigate, location });
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- run once on mount; re-subscribing on every navigation would re-initialise login
  }, []);

  return (
    <section className="auth-page">
      <client-app-login></client-app-login>
    </section>
  );
};

export default AuthPage;
