import { useLocation, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useUserContext } from '../Contexts';
import { useEffect } from 'react';

export default function Redirect() {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const { studentId, canteenId } = useParams();
    const { pathname } = useLocation();

    function isAuthorized() {
        if (pathname.startsWith('/orders/')) {
            return (
                user.role === 'contractor' ||
                (user.role === 'student' && user._id === studentId)
            );
        } else if (pathname.startsWith('/students/')) {
            return (
                user.role === 'admin' ||
                (user.role === 'contractor' && user.canteenId === canteenId)
            );
        }
    }

    useEffect(() => {
        if (!isAuthorized()) navigate('/not-found', { replace: true });
    }, [user, studentId, canteenId]);

    if (!isAuthorized()) return null; // removes that fraction of seconds lag

    return <Outlet />;
}
