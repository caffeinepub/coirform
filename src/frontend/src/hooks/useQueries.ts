import { useMutation, useQuery } from "@tanstack/react-query";
import type { Order, VibeDesign } from "../backend.d";
import { useActor } from "./useActor";

export function useGetVibeDesigns(vibeType: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<VibeDesign[]>({
    queryKey: ["vibes", vibeType],
    queryFn: async () => {
      if (!actor || !vibeType) return [];
      return actor.getVibesByType(vibeType);
    },
    enabled: !!actor && !isFetching && !!vibeType,
  });
}

export interface CreateOrderParams {
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  phoneModel: string;
  color: string;
  texture: string;
  pattern: string;
  vibe: string | null;
  aiSuggestionUsed: boolean;
}

export function useCreateOrder() {
  const { actor } = useActor();
  return useMutation<Order, Error, CreateOrderParams>({
    mutationFn: async (params) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createOrder(
        params.customerName,
        params.customerEmail,
        params.phone,
        params.address,
        params.phoneModel,
        params.color,
        params.texture,
        params.pattern,
        params.vibe,
        params.aiSuggestionUsed,
      );
    },
  });
}
