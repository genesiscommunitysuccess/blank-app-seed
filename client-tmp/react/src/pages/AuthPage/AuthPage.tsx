import React, {useEffect} from 'react';
import './AuthPage.css';
import { configureFoundationLogin } from "@/share/foundation-login.ts";
import { useNavigate } from "react-router";

const AuthPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        configureFoundationLogin({ navigate });
    }, []);

    return (
        <section className="auth-page">
            <client-app-login></client-app-login>
        </section>
    );
};

export default AuthPage;
