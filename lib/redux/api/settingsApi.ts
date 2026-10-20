import { baseApi } from "@/lib/redux/api/baseApi";
import { ApiResponse } from "@/types/api.types";
import {
  CompanySettings,
  UpdateCompanySettingsDto,
  CompanyLogoUploadResponse,
  PlanItem,
  GetPlansQueryParams,
  CreatePlanDto,
  UpdatePlanDto,
  EscrowSettings,
  UpdateEscrowDto,
  NotificationTargetType,
  NotificationSettingItem,
  UpdateNotificationDto,
  ToggleAllNotificationsDto,
  NotificationCategoryItem,
  SecuritySettingsData,
  UpdateSecurityDto,
  IpRestrictionItem,
  CreateIpRestrictionDto,
  UpdateIpRestrictionDto,
  GetIpRestrictionsParams,
  ActiveSessionItem,
  ChangePasswordDto,
} from "@/types/settings.types";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── General Company Settings ───────────────────────────────────────
    getCompanySettings: builder.query<CompanySettings, void>({
      query: () => ({
        url: "/admin/settings/general/company",
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<CompanySettings> | CompanySettings
      ) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as CompanySettings;
      },
      providesTags: [{ type: "Settings", id: "COMPANY" }],
    }),

    updateCompanySettings: builder.mutation<
      CompanySettings,
      UpdateCompanySettingsDto
    >({
      query: (body) => ({
        url: "/admin/settings/general/company",
        method: "PATCH",
        body,
      }),
      transformResponse: (
        response: ApiResponse<CompanySettings> | CompanySettings
      ) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as CompanySettings;
      },
      invalidatesTags: [{ type: "Settings", id: "COMPANY" }],
    }),

    uploadCompanyLogo: builder.mutation<
      CompanyLogoUploadResponse,
      FormData | File
    >({
      query: (arg) => {
        let body: FormData;
        if (arg instanceof FormData) {
          body = arg;
        } else {
          body = new FormData();
          body.append("logo", arg);
        }
        return {
          url: "/admin/settings/general/company/logo",
          method: "POST",
          body,
        };
      },
      transformResponse: (
        response:
          | ApiResponse<CompanyLogoUploadResponse>
          | CompanyLogoUploadResponse
      ) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as CompanyLogoUploadResponse;
      },
      invalidatesTags: [{ type: "Settings", id: "COMPANY" }],
    }),

    removeCompanyLogo: builder.mutation<
      { success: boolean; message?: string },
      void
    >({
      query: () => ({
        url: "/admin/settings/general/company/logo",
        method: "DELETE",
      }),
      transformResponse: (
        response: ApiResponse<any> | { success: boolean; message?: string }
      ) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as { success: boolean; message?: string };
      },
      invalidatesTags: [{ type: "Settings", id: "COMPANY" }],
    }),

    // ── Plan & Pricing Settings ─────────────────────────────────────────
    getPlans: builder.query<PlanItem[], GetPlansQueryParams | void>({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params?.limit !== undefined) queryParams.limit = params.limit;
        if (params?.offset !== undefined) queryParams.offset = params.offset;
        if (params?.status && params.status !== "ALL") {
          queryParams.status = params.status;
        }
        return {
          url: "/admin/settings/plans",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (
        response:
          | ApiResponse<
              | PlanItem[]
              | { plans?: PlanItem[]; items?: PlanItem[]; data?: PlanItem[] }
            >
          | PlanItem[]
          | { plans?: PlanItem[]; items?: PlanItem[]; data?: PlanItem[] }
      ) => {
        const raw =
          response && "data" in response && response.data
            ? response.data
            : response;

        if (Array.isArray(raw)) return raw;
        if (raw && typeof raw === "object") {
          if (Array.isArray((raw as any).plans)) return (raw as any).plans;
          if (Array.isArray((raw as any).items)) return (raw as any).items;
          if (Array.isArray((raw as any).data)) return (raw as any).data;
        }
        return [];
      },
      providesTags: [{ type: "Settings", id: "PLANS_LIST" }],
    }),

    getPlanById: builder.query<PlanItem, string>({
      query: (id) => ({
        url: `/admin/settings/plans/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<PlanItem> | PlanItem) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as PlanItem;
      },
      providesTags: (_result, _error, id) => [
        { type: "Settings", id: `PLAN_${id}` },
      ],
    }),

    createPlan: builder.mutation<PlanItem, CreatePlanDto>({
      query: (body) => ({
        url: "/admin/settings/plans",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<PlanItem> | PlanItem) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as PlanItem;
      },
      invalidatesTags: [{ type: "Settings", id: "PLANS_LIST" }],
    }),

    updatePlan: builder.mutation<PlanItem, { id: string } & UpdatePlanDto>({
      query: ({ id, ...body }) => ({
        url: `/admin/settings/plans/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<PlanItem> | PlanItem) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as PlanItem;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Settings", id: "PLANS_LIST" },
        { type: "Settings", id: `PLAN_${id}` },
      ],
    }),

    deletePlan: builder.mutation<
      { success: boolean; message?: string },
      string
    >({
      query: (id) => ({
        url: `/admin/settings/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Settings", id: "PLANS_LIST" }],
    }),

    togglePlanStatus: builder.mutation<PlanItem, string>({
      query: (id) => ({
        url: `/admin/settings/plans/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Settings", id: "PLANS_LIST" },
        { type: "Settings", id: `PLAN_${id}` },
      ],
    }),

    // ── Payment & Escrow Settings ───────────────────────────────────────
    getEscrowSettings: builder.query<EscrowSettings, void>({
      query: () => ({
        url: "/admin/settings/payment-escrow",
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<EscrowSettings> | EscrowSettings
      ) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as EscrowSettings;
      },
      providesTags: [{ type: "Settings", id: "ESCROW" }],
    }),

    updateEscrowSettings: builder.mutation<EscrowSettings, UpdateEscrowDto>({
      query: (body) => ({
        url: "/admin/settings/payment-escrow",
        method: "PATCH",
        body,
      }),
      transformResponse: (
        response: ApiResponse<EscrowSettings> | EscrowSettings
      ) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as EscrowSettings;
      },
      invalidatesTags: [{ type: "Settings", id: "ESCROW" }],
    }),

    resetEscrowSettings: builder.mutation<
      { success: boolean; message?: string },
      void
    >({
      query: () => ({
        url: "/admin/settings/payment-escrow/reset",
        method: "POST",
      }),
      transformResponse: (
        response: ApiResponse<any> | { success: boolean; message?: string }
      ) => {
        if (response && "data" in response && response.data) {
          return response.data;
        }
        return response as { success: boolean; message?: string };
      },
      invalidatesTags: [{ type: "Settings", id: "ESCROW" }],
    }),

    // ── Notification Settings ───────────────────────────────────────────
    getAllNotifications: builder.query<any, void>({
      query: () => ({
        url: "/admin/settings/notifications",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<any> | any) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response;
      },
      providesTags: [{ type: "Settings", id: "NOTIFICATIONS" }],
    }),

    getNotificationsByTargetType: builder.query<any, NotificationTargetType>({
      query: (targetType) => ({
        url: `/admin/settings/notifications/${targetType}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<any> | any) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response;
      },
      providesTags: (_result, _error, targetType) => [
        { type: "Settings", id: `NOTIFICATIONS_${targetType}` },
        { type: "Settings", id: "NOTIFICATIONS" },
      ],
    }),

    getNotificationCategories: builder.query<any, void>({
      query: () => ({
        url: "/admin/settings/notifications/categories",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<any> | any) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response;
      },
      providesTags: [{ type: "Settings", id: "NOTIFICATION_CATEGORIES" }],
    }),

    updateNotification: builder.mutation<
      NotificationSettingItem,
      UpdateNotificationDto
    >({
      query: (body) => ({
        url: "/admin/settings/notifications",
        method: "PATCH",
        body,
      }),
      transformResponse: (
        response: ApiResponse<NotificationSettingItem> | NotificationSettingItem
      ) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response as NotificationSettingItem;
      },
      invalidatesTags: (_result, _error, { targetType }) => [
        { type: "Settings", id: `NOTIFICATIONS_${targetType}` },
        { type: "Settings", id: "NOTIFICATIONS" },
      ],
    }),

    toggleAllNotifications: builder.mutation<
      { success: boolean; message?: string },
      ToggleAllNotificationsDto
    >({
      query: (body) => ({
        url: "/admin/settings/notifications/toggle-all",
        method: "POST",
        body,
      }),
      transformResponse: (
        response: ApiResponse<any> | { success: boolean; message?: string }
      ) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response as { success: boolean; message?: string };
      },
      invalidatesTags: (_result, _error, { targetType }) => [
        { type: "Settings", id: `NOTIFICATIONS_${targetType}` },
        { type: "Settings", id: "NOTIFICATIONS" },
      ],
    }),

    resetNotifications: builder.mutation<
      { success: boolean; message?: string },
      void
    >({
      query: () => ({
        url: "/admin/settings/notifications/reset",
        method: "POST",
      }),
      transformResponse: (
        response: ApiResponse<any> | { success: boolean; message?: string }
      ) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response as { success: boolean; message?: string };
      },
      invalidatesTags: [
        { type: "Settings", id: "NOTIFICATIONS" },
        { type: "Settings", id: "NOTIFICATIONS_CLIENT" },
        { type: "Settings", id: "NOTIFICATIONS_EXPERT" },
      ],
    }),

    // ── Security Settings ────────────────────────────────────────────────
    getSecuritySettings: builder.query<SecuritySettingsData, void>({
      query: () => ({
        url: "/admin/settings/security",
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<SecuritySettingsData> | SecuritySettingsData
      ) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response as SecuritySettingsData;
      },
      providesTags: [{ type: "Settings", id: "SECURITY" }],
    }),

    updateSecuritySettings: builder.mutation<
      SecuritySettingsData,
      UpdateSecurityDto
    >({
      query: (body) => ({
        url: "/admin/settings/security",
        method: "PATCH",
        body,
      }),
      transformResponse: (
        response: ApiResponse<SecuritySettingsData> | SecuritySettingsData
      ) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response as SecuritySettingsData;
      },
      invalidatesTags: [{ type: "Settings", id: "SECURITY" }],
    }),

    // ── IP Restrictions ─────────────────────────────────────────────────
    getIpRestrictions: builder.query<
      IpRestrictionItem[],
      GetIpRestrictionsParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params?.limit !== undefined) queryParams.limit = params.limit;
        if (params?.offset !== undefined) queryParams.offset = params.offset;
        if (params?.status && params.status !== "ALL") {
          queryParams.status = params.status;
        }
        return {
          url: "/admin/settings/security/ip-restrictions",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response: ApiResponse<any> | any) => {
        const raw =
          response && "data" in response && response.data !== undefined
            ? response.data
            : response;
        if (Array.isArray(raw)) return raw;
        if (raw && typeof raw === "object") {
          if (Array.isArray(raw.items)) return raw.items;
          if (Array.isArray(raw.restrictions)) return raw.restrictions;
          if (Array.isArray(raw.data)) return raw.data;
        }
        return [];
      },
      providesTags: [{ type: "Settings", id: "IP_RESTRICTIONS" }],
    }),

    createIpRestriction: builder.mutation<
      IpRestrictionItem,
      CreateIpRestrictionDto
    >({
      query: (body) => ({
        url: "/admin/settings/security/ip-restrictions",
        method: "POST",
        body,
      }),
      transformResponse: (
        response: ApiResponse<IpRestrictionItem> | IpRestrictionItem
      ) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response as IpRestrictionItem;
      },
      invalidatesTags: [{ type: "Settings", id: "IP_RESTRICTIONS" }],
    }),

    updateIpRestriction: builder.mutation<
      IpRestrictionItem,
      { id: string; data: UpdateIpRestrictionDto }
    >({
      query: ({ id, data }) => ({
        url: `/admin/settings/security/ip-restrictions/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (
        response: ApiResponse<IpRestrictionItem> | IpRestrictionItem
      ) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response as IpRestrictionItem;
      },
      invalidatesTags: [{ type: "Settings", id: "IP_RESTRICTIONS" }],
    }),

    toggleIpRestriction: builder.mutation<IpRestrictionItem, string>({
      query: (id) => ({
        url: `/admin/settings/security/ip-restrictions/${id}/toggle`,
        method: "PATCH",
      }),
      transformResponse: (
        response: ApiResponse<IpRestrictionItem> | IpRestrictionItem
      ) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response as IpRestrictionItem;
      },
      invalidatesTags: [{ type: "Settings", id: "IP_RESTRICTIONS" }],
    }),

    deleteIpRestriction: builder.mutation<
      { success: boolean; message?: string },
      string
    >({
      query: (id) => ({
        url: `/admin/settings/security/ip-restrictions/${id}`,
        method: "DELETE",
      }),
      transformResponse: (
        response: ApiResponse<any> | { success: boolean; message?: string }
      ) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response as { success: boolean; message?: string };
      },
      invalidatesTags: [{ type: "Settings", id: "IP_RESTRICTIONS" }],
    }),

    // ── Active Sessions ─────────────────────────────────────────────────
    getActiveSessions: builder.query<ActiveSessionItem[], void>({
      query: () => ({
        url: "/admin/settings/security/sessions",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<any> | any) => {
        const raw =
          response && "data" in response && response.data !== undefined
            ? response.data
            : response;
        if (Array.isArray(raw)) return raw;
        if (raw && typeof raw === "object") {
          if (Array.isArray(raw.sessions)) return raw.sessions;
          if (Array.isArray(raw.items)) return raw.items;
          if (Array.isArray(raw.data)) return raw.data;
        }
        return [];
      },
      providesTags: [{ type: "Settings", id: "SESSIONS" }],
    }),

    endSession: builder.mutation<
      { success: boolean; message?: string },
      string
    >({
      query: (sessionId) => ({
        url: `/admin/settings/security/sessions/${sessionId}`,
        method: "DELETE",
      }),
      transformResponse: (
        response: ApiResponse<any> | { success: boolean; message?: string }
      ) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response as { success: boolean; message?: string };
      },
      invalidatesTags: [{ type: "Settings", id: "SESSIONS" }],
    }),

    endAllSessions: builder.mutation<
      { success: boolean; message?: string },
      void
    >({
      query: () => ({
        url: "/admin/settings/security/sessions/end-all",
        method: "POST",
      }),
      transformResponse: (
        response: ApiResponse<any> | { success: boolean; message?: string }
      ) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response as { success: boolean; message?: string };
      },
      invalidatesTags: [{ type: "Settings", id: "SESSIONS" }],
    }),

    // ── Change Password ─────────────────────────────────────────────────
    changePassword: builder.mutation<
      { success: boolean; message?: string },
      ChangePasswordDto
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
      transformResponse: (
        response: ApiResponse<any> | { success: boolean; message?: string }
      ) => {
        if (response && "data" in response && response.data !== undefined) {
          return response.data;
        }
        return response as { success: boolean; message?: string };
      },
    }),
  }),
});

export const {
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
  useUploadCompanyLogoMutation,
  useRemoveCompanyLogoMutation,
  useGetPlansQuery,
  useGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useTogglePlanStatusMutation,
  useGetEscrowSettingsQuery,
  useUpdateEscrowSettingsMutation,
  useResetEscrowSettingsMutation,
  useGetAllNotificationsQuery,
  useGetNotificationsByTargetTypeQuery,
  useGetNotificationCategoriesQuery,
  useUpdateNotificationMutation,
  useToggleAllNotificationsMutation,
  useResetNotificationsMutation,
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
  useGetIpRestrictionsQuery,
  useCreateIpRestrictionMutation,
  useUpdateIpRestrictionMutation,
  useToggleIpRestrictionMutation,
  useDeleteIpRestrictionMutation,
  useGetActiveSessionsQuery,
  useEndSessionMutation,
  useEndAllSessionsMutation,
  useChangePasswordMutation,
} = settingsApi;

