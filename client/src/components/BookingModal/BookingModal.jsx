import React, { useContext, useState } from "react";
import { Modal, Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useMutation } from "react-query";
import UserDetailContext from "../../context/UserDetailContext";
import { bookVisit } from "../../utils/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import useAuthCheck from "../../hooks/useAuthCheck";

const BookingModal = ({ opened, setOpened, email, propertyId }) => {
  const [value, setValue] = useState(null);
  const { setUserDetails } = useContext(UserDetailContext);
  const { validateLogin } = useAuthCheck();

  const handleBookingSuccess = () => {
    toast.success("Visit booked successfully!", {
      position: "bottom-right",
    });
    setUserDetails((prev) => ({
      ...prev,
      bookings: [
        ...prev.bookings,
        {
          id: propertyId,
          date: dayjs(value).format("DD/MM/YYYY"),
        },
      ],
    }));
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: () => {
      if (!validateLogin({ 
        errorMessage: "Please login to book a visit",
        redirect: true 
      })) {
        throw new Error("Unauthorized");
      }
      return bookVisit(
        dayjs(value).format("DD/MM/YYYY"),
        propertyId,
        email
      );
    },
    onSuccess: handleBookingSuccess,
    onError: (error) => {
      if (error.message !== "Unauthorized") {
        toast.error(error.response?.data?.message || "Failed to book visit", {
          position: "bottom-right"
        });
      }
    },
    onSettled: () => setOpened(false),
  });

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Select your date of visit"
      centered
      overlayProps={{ blur: 3 }}
    >
      <div className="flexColCenter" style={{ gap: "1rem" }}>
        <DatePicker 
          value={value} 
          onChange={setValue} 
          minDate={new Date()}
          excludeDate={(date) => date.getDay() === 0} // Example: Exclude Sundays
          aria-label="Select visit date"
        />
        <Button 
          disabled={!value || isLoading} 
          onClick={() => mutate()}
          loading={isLoading}
          fullWidth
        >
          {isLoading ? "Booking..." : "Confirm Visit"}
        </Button>
      </div>
    </Modal>
  );
};

export default BookingModal;