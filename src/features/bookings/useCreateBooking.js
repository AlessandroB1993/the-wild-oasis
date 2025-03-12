import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewBooking as createNewBookingApi } from "../../services/apiBookings.js";
import toast from "react-hot-toast";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { isLoading: isCreating, mutate: createBooking } = useMutation({
    mutationFn: createNewBookingApi,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("New booking successfully created");
    },
    onError: (err) => {
      console.error(err);
      toast.ErrorIcon(err.message);
    },
  });

  return { isCreating, createBooking };
}
