import React, { useContext, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../../context/UserDetailContext";
import { useMutation } from "react-query";
import { createUser } from "../../utils/api";
import useFavourites from "../../hooks/useFavourites";
import useBookings from "../../hooks/useBookings";
import { toast } from "react-toastify";

const Layout = () => {
  // Initialize hooks
  useFavourites();
  useBookings();

  const { isAuthenticated, user } = useAuth0();
  const { setUserDetails } = useContext(UserDetailContext);

  const { mutate } = useMutation({
    mutationKey: ["createUser", user?.email],
    mutationFn: () => createUser(user?.email), // Removed token parameter
  });

  useEffect(() => {
    const registerUser = async () => {
      try {
        if (user?.email) {
          // Store basic user info
          setUserDetails((prev) => ({
            ...prev,
            email: user.email,
            name: user.name,
            picture: user.picture
          }));

          // Create user in backend
          mutate();
        }
      } catch (error) {
        toast.error("Failed to initialize user session");
        console.error("Registration error:", error);
      }
    };

    if (isAuthenticated) {
      registerUser();
    } else {
      // Clear user details when logged out
      setUserDetails({ favourites: [], bookings: [] });
    }
  }, [isAuthenticated, user]);

  return (
    <>
      <div style={{ background: "var(--black)", overflow: "hidden" }}>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;