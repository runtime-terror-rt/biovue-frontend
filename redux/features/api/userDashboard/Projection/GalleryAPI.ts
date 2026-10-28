import { baseApi } from "../../baseApi";

export interface ProjectionDetail {
  label: string;
  image: string;
  timeframe: string;
  est_bmi: string;
  est_weight: string;
  expected_changes: string[];
}

export interface GalleryProjection {
  id: number;
  title: string;
  timeframe: string;
  input_image: string;
  projections: {
    current_lifestyle: ProjectionDetail;
    future_goal: ProjectionDetail;
  };
  created_at: string;
}

export interface ProjectionGalleryResponse {
  success: boolean;
  data: GalleryProjection[];
}

export const galleryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectionGallery: builder.query<ProjectionGalleryResponse, void | string | number>({
      query: (userId) => ({
        url: "/my-projections",
        method: "GET",
        params: userId ? { user_id: userId } : undefined,
      }),
      providesTags: ["Projection"] as any,
    }),
  }),
  overrideExisting: true,
});

export const { useGetProjectionGalleryQuery } = galleryApi;
