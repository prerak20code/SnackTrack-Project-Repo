import { Navigate } from 'react-router-dom';
import { useUserContext } from '../Contexts';

export default function Redirect({ children, path = '/login' }) {
    const { user } = useUserContext();
    return user ? children : <Navigate to={path} />;
}
