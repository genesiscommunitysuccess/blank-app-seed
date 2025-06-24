import React, {useEffect} from 'react';
import './AuthPage.css';
import { configureFoundationLogin } from "@/share/foundation-login.ts";
import { useNavigate, useLocation } from 'react-router-dom';

const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        configureFoundationLogin({ navigate, location });
    }, []);

    return (
        <section className="auth-page">
            <client-app-login></client-app-login>
        </section>
    );
};

export default AuthPage;
