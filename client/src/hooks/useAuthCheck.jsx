import { useAuth0 } from '@auth0/auth0-react';
import { toast } from "react-toastify";
import { useEffect } from 'react';

const useAuthCheck = () => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    const validateLogin = (options = {}) => { 
        if (!isAuthenticated) {
            toast.error(options.errorMessage || "You must be logged in to access this feature", {
                position: "bottom-right",
                toastId: 'auth-error' // Prevent duplicate toasts
            });
            
            // Optional automatic redirect
            if (options.redirect) {
                loginWithRedirect({
                    appState: { returnTo: window.location.pathname },
                    authorizationParams: {
                        prompt: "login" // Force login screen
                    }
                });
            }
            return false;
        }
        return true;
    }

    // Optional: Add side effect to handle auth changes
    useEffect(() => {
        // You could add analytics or other side effects here
    }, [isAuthenticated]);

    return {
        validateLogin,
        isAuthenticated // Expose this for convenience
    };
}

export default useAuthCheck;