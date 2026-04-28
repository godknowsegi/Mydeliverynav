import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LatLngTuple } from "leaflet";
import { instance } from "./instance";

export type PackageStatus =
  | "PENDING"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"
  | "OBSTRUCTED";

export type RoutePoint = {
  label: string;
  coords: LatLngTuple;
  durationToNext?: number;
};

export type PackageRoutePayload = {
  origin: string;
  destination: string;
  distance: number;
  points: RoutePoint[];
};

export type CreatePackageInput = {
  name: string;
  weight: number;
  content: string;
  images?: File[];
  ownerEmail: string;
  description?: string;
  status?: PackageStatus;
  route: PackageRoutePayload;
};

export type UpdatePackageInput = Partial<
  Omit<CreatePackageInput, "images"> & {
    images: string[];
  }
>;

export type AdminPackage = {
  id: string;
  name: string;
  weight: number;
  content: string;
  images?: string[];
  description?: string;
  status: PackageStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminDelivery = {
  id: string;
  status: PackageStatus;
  package: {
    id: string;
    createdAt: string;
    name: string;
    weight: number;
    destination?: string | null;
    origin?: string | null;
    owner?: {
      id: string;
      name?: string | null;
      email?: string | null;
    } | null;
  } | null;
};

const prefix = "/package";

export const packageQueryKeys = {
  all: ["packages"] as const,
  deliveries: ["packages", "deliveries"] as const,
  details: (id: string) => ["packages", id] as const,
};

export async function createPackage(input: CreatePackageInput) {
  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("weight", String(input.weight));
  formData.append("content", input.content);
  formData.append("ownerEmail", input.ownerEmail);
  formData.append("description", input.description ?? "");
  formData.append("status", input.status ?? "PENDING");
  formData.append("route", JSON.stringify(input.route));

  (input.images ?? []).forEach((file) => {
    formData.append("images", file);
  });

  const { data } = await instance.post<AdminPackage>(prefix, formData);
  return data;
}

export async function getPackages() {
  const { data } = await instance.get<AdminPackage[]>(prefix);
  return data;
}

export async function getPackageById(id: string) {
  const { data } = await instance.get<AdminPackage>(`${prefix}/${id}`);
  return data;
}

export async function updatePackage(id: string, input: UpdatePackageInput) {
  const { data } = await instance.patch<AdminPackage>(`${prefix}/${id}`, input);
  return data;
}

export async function getDeliveries() {
  const { data } = await instance.get<AdminDelivery[]>(`${prefix}/deliveries`);
  return data;
}

export function usePackagesQuery(enabled = true) {
  return useQuery({
    queryKey: packageQueryKeys.all,
    queryFn: getPackages,
    enabled,
  });
}

export function usePackageQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: packageQueryKeys.details(id),
    queryFn: () => getPackageById(id),
    enabled: enabled && Boolean(id),
  });
}

export function useDeliveriesQuery(enabled = true) {
  return useQuery({
    queryKey: packageQueryKeys.deliveries,
    queryFn: getDeliveries,
    enabled,
  });
}

export function useCreatePackageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: packageQueryKeys.all });
      void queryClient.invalidateQueries({
        queryKey: packageQueryKeys.deliveries,
      });
    },
  });
}

export function useUpdatePackageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePackageInput }) =>
      updatePackage(id, input),
    onSuccess: (updatedPackage) => {
      void queryClient.invalidateQueries({ queryKey: packageQueryKeys.all });
      void queryClient.invalidateQueries({
        queryKey: packageQueryKeys.deliveries,
      });
      void queryClient.invalidateQueries({
        queryKey: packageQueryKeys.details(updatedPackage.id),
      });
    },
  });
}
