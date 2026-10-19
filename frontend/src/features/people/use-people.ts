import { useQuery } from "@tanstack/react-query";

import {
  getPeople,
  getPerson,
} from "@/api/people.api";

export function usePeople() {
  return useQuery({
    queryKey: ["people"],
    queryFn: getPeople,
  });
}

export function usePerson(
  researcherId: string | undefined,
) {
  return useQuery({
    queryKey: [
      "people",
      researcherId,
    ],

    queryFn: () =>
      getPerson(researcherId!),

    enabled: Boolean(
      researcherId,
    ),
  });
}