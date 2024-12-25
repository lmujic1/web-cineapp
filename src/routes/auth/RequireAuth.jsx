import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation();
    const userRole = localStorage.getItem('userRole');
    const passwordChanged = localStorage.getItem('passwordChanged') === 'true'; // Assuming it's stored as a string
    const addedBySuperAdmin = localStorage.getItem('addedBySuperAdmin') === 'true'; // Assuming it's stored as a string


    // If the user is not authenticated
    if (!userRole) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // If the user has not changed their password and is not on the password change page
    if (addedBySuperAdmin && !passwordChanged && location.pathname != '/user-profile/password') {
        return <Navigate to="/user-profile/password" replace />;
    }

    // If the user's role is not allowed
    return (
        allowedRoles.includes(userRole)
            ? <Outlet />
            : <Navigate to="/unauthorized" state={{ from: location }} replace />
    );
}

export default RequireAuth;
