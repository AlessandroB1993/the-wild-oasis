import { useQuery } from "@tanstack/react-query";
import { getGuests } from "../../services/apiGuests.js";

export function useGuests() {
  const { data: guests, isLoading: isLoadingGuests } = useQuery({
    queryFn: getGuests,
    queryKey: ["guests"],
  });

  return { guests, isLoadingGuests };
}
