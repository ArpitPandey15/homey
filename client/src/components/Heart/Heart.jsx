import { useContext, useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import useAuthCheck from "../../hooks/useAuthCheck";
import { useMutation } from "react-query";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../../context/UserDetailContext";
import { checkFavourites, updateFavourites } from "../../utils/common";
import { toFav } from "../../utils/api";
import { toast } from "react-toastify";

const Heart = ({ id }) => {
  const [heartColor, setHeartColor] = useState("white");
  const { validateLogin } = useAuthCheck();
  const { user } = useAuth0();

  const {
    userDetails: { favourites },
    setUserDetails,
  } = useContext(UserDetailContext);

  // Update heart color based on favourites
  useEffect(() => {
    setHeartColor(() => checkFavourites(id, favourites));
  }, [favourites, id]);

  const { mutate } = useMutation({
    mutationFn: () => toFav(id, user?.email), // Removed token parameter
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        favourites: updateFavourites(id, prev.favourites),
      }));
    },
    onError: (error) => {
      toast.error("Failed to update favorites");
      // Revert UI on error
      setHeartColor((prev) => (prev === "#fa3e5f" ? "white" : "#fa3e5f"));
    },
  });

  const handleLike = () => {
    if (validateLogin()) {
      // Optimistic UI update
      setHeartColor((prev) => (prev === "#fa3e5f" ? "white" : "#fa3e5f"));
      mutate();
    }
  };

  return (
    <AiFillHeart
      size={24}
      color={heartColor}
      onClick={(e) => {
        e.stopPropagation();
        handleLike();
      }}
      style={{ cursor: "pointer" }}
    />
  );
};

export default Heart;