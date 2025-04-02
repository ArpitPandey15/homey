import React, { useContext, useEffect, useRef } from "react";
import UserDetailContext from "../context/UserDetailContext";
import { useQuery } from "react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllBookings } from "../utils/api";

const useBookings = () => {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const queryRef = useRef();
  const { user, isAuthenticated } = useAuth0();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allBookings", user?.email], // Added email to query key
    queryFn: () => getAllBookings(user?.email), // Removed token parameter
    onSuccess: (data) => {
      setUserDetails((prev) => ({ ...prev, bookings: data || [] }));
    },
    enabled: isAuthenticated, // More reliable than user check
    staleTime: 30000,
    retry: 1, // Better error handling
  });

  // Optimized refetch setup
  useEffect(() => {
    if (isAuthenticated) {
      queryRef.current = refetch;
    }
  }, [isAuthenticated, refetch]);

  return { 
    data: data || [], // Ensure data is never undefined
    isError,
    isLoading: isLoading && isAuthenticated, // Only loading when actually fetching
    refetch
  };
};

export default useBookings;