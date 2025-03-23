import { Outlet, useNavigate } from 'react-router-dom';
import { useUserContext } from '../Contexts';
import { useEffect } from 'react';

export default function AdminAccess() {
    const { adminVerified } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!adminVerified) navigate('/not-found', { replace: true });
    }, [adminVerified, navigate]);

    if (!adminVerified) return null; // removes that fraction of seconds lag

    return <Outlet />;
}
