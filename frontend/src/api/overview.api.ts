import { api } from "@/lib/api";
import type { Overview } from "@/types/overview";

export async function getOverview() {
  const response =
    await api.get<Overview>("/overview");

  return response.data;
}