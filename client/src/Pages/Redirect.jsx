import { Outlet, useNavigate } from 'react-router-dom';
import { useUserContext } from '../Contexts';
import { useEffect } from 'react';

export default function Redirect({ path = '/login' }) {
    const { user } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate(path, { replace: true });
        }
    }, [user, navigate]);

    if (!user) {
        // removes that fraction of seconds lag
        return null;
    }

    return <Outlet />;
}
