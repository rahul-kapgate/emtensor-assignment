import { api } from "@/lib/api";

import type {
  Person,
  PersonDetail,
} from "@/types/person";

export async function getPeople() {
  const response =
    await api.get<Person[]>(
      "/people",
    );

  return response.data;
}

export async function getPerson(
  researcherId: string,
) {
  const response =
    await api.get<PersonDetail>(
      `/people/${researcherId}`,
    );

  return response.data;
}