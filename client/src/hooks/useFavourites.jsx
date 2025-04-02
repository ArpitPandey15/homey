import React, { useContext, useEffect, useRef } from "react";
import UserDetailContext from "../context/UserDetailContext";
import { useQuery } from "react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllFav } from "../utils/api";

const useFavourites = () => {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const queryRef = useRef();
  const { user, isAuthenticated } = useAuth0();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allFavourites", user?.email], // Added email to query key
    queryFn: () => getAllFav(user?.email), // Removed token parameter
    onSuccess: (data) => {
      setUserDetails((prev) => ({ ...prev, favourites: data || [] }));
    },
    enabled: isAuthenticated, // Changed to isAuthenticated for more accurate checks
    staleTime: 30000,
    retry: 1, // Added retry for better error handling
  });

  // Only set up refetch if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      queryRef.current = refetch;
    }
  }, [isAuthenticated, refetch]);

  return { 
    data: data || [], // Ensure data is never undefined
    isError, 
    isLoading: isLoading && isAuthenticated, // Only show loading when actually fetching
    refetch 
  };
};

export default useFavourites;