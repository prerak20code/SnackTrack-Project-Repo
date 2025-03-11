import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../Contexts';

export default function Redirect({ path = '/login' }) {
    const { user } = useUserContext();
    return user ? <Outlet /> : <Navigate to={path} replace />;
}
