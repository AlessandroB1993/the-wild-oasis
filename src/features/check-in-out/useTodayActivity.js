import { useQuery } from "@tanstack/react-query";
import { getStaysTodayActivity } from "../../services/apiBookings.js";

export function useTodayActivity() {
  const { data: activeBookings, isLoading } = useQuery({
    queryFn: getStaysTodayActivity,
    queryKey: ["today-activity"],
  });

  return { activeBookings, isLoading };
}
