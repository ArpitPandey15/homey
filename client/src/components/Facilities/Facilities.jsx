import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Group, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useContext } from "react";
import UserDetailContext from "../../context/UserDetailContext";
import useProperties from "../../hooks/useProperties";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createResidency } from "../../utils/api";
import useAuthCheck from "../../hooks/useAuthCheck";

const Facilities = ({
  prevStep,
  propertyDetails,
  setPropertyDetails,
  setOpened,
  setActiveStep,
}) => {
  const { validateLogin } = useAuthCheck();
  const { user } = useAuth0();
  const { refetch: refetchProperties } = useProperties();

  const form = useForm({
    initialValues: {
      bedrooms: propertyDetails.facilities.bedrooms,
      parkings: propertyDetails.facilities.parkings,
      bathrooms: propertyDetails.facilities.bathrooms,
    },
    validate: {
      bedrooms: (value) => (value < 1 ? "Must have at least one room" : null),
      bathrooms: (value) => (value < 1 ? "Must have at least one bathroom" : null),
    },
  });

  const { bedrooms, parkings, bathrooms } = form.values;

  const { mutate, isLoading } = useMutation({
    mutationFn: () => {
      if (!validateLogin({ 
        errorMessage: "Please login to add properties",
        redirect: true 
      })) {
        throw new Error("Unauthorized");
      }
      
      return createResidency({
        ...propertyDetails,
        facilities: { bedrooms, parkings, bathrooms },
        userEmail: user?.email,
      });
    },
    onError: (error) => {
      if (error.message !== "Unauthorized") {
        toast.error(error.response?.data?.message || "Failed to add property", {
          position: "bottom-right"
        });
      }
    },
    onSuccess: () => {
      toast.success("Property added successfully", { position: "bottom-right" });
      resetForm();
      refetchProperties();
    }
  });

  const resetForm = () => {
    setPropertyDetails({
      title: "",
      description: "",
      price: 0,
      country: "",
      city: "",
      address: "",
      image: null,
      facilities: {
        bedrooms: 0,
        parkings: 0,
        bathrooms: 0,
      },
      userEmail: user?.email,
    });
    setOpened(false);
    setActiveStep(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev) => ({
        ...prev,
        facilities: { bedrooms, parkings, bathrooms },
      }));
      mutate();
    }
  };

  return (
    <Box maw="30%" mx="auto" my="sm">
      <form onSubmit={handleSubmit}>
        <NumberInput
          withAsterisk
          label="No of Bedrooms"
          min={0}
          {...form.getInputProps("bedrooms")}
        />
        <NumberInput
          label="No of Parkings"
          min={0}
          {...form.getInputProps("parkings")}
        />
        <NumberInput
          withAsterisk
          label="No of Bathrooms"
          min={0}
          {...form.getInputProps("bathrooms")}
        />
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button 
            type="submit" 
            color="green" 
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? "Submitting" : "Add Property"}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Facilities;