import api from "@/lib/api";
import { authClient } from "@/lib/auth-client";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NotificationPreferences {
  id: string;
  userId: string;
  emailEnabled: boolean;
  slackEnabled: boolean;
}

export interface ActiveSession {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: string;
}

// ─── Profile Service ─────────────────────────────────────────────────────────

export const profileService = {
  /**
   * Update display name and/or avatar image URL.
   * Uses better-auth's built-in updateUser endpoint.
   */
  async updateProfile(data: { name?: string; image?: string }) {
    const result = await authClient.updateUser(data);
    if (result.error) throw new Error(result.error.message || "Failed to update profile.");
    return result.data;
  },

  /**
   * Change account password.
   * Uses better-auth's changePassword endpoint (requires current password).
   */
  async changePassword(currentPassword: string, newPassword: string) {
    const result = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: false,
    });
    if (result.error) throw new Error(result.error.message || "Failed to change password.");
    return result.data;
  },

  /**
   * List all active sessions for the current user via the server proxy.
   */
  async listSessions(): Promise<ActiveSession[]> {
    const response = await api.get<ActiveSession[]>("/users/me/sessions");
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Revoke a specific session by its token.
   */
  async revokeSession(token: string): Promise<void> {
    await api.delete(`/users/me/sessions/${encodeURIComponent(token)}`);
  },

  /**
   * Get notification preferences for the current user.
   * Auto-creates defaults (both true) if not yet configured.
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await api.get<NotificationPreferences>("/users/me/notifications");
    return response.data;
  },

  /**
   * Toggle email and/or Slack notification preferences.
   */
  async updateNotificationPreferences(
    prefs: Partial<Pick<NotificationPreferences, "emailEnabled" | "slackEnabled">>
  ): Promise<NotificationPreferences> {
    const response = await api.patch<{ success: boolean; preferences: NotificationPreferences }>(
      "/users/me/notifications",
      prefs
    );
    return response.data.preferences;
  },
};
