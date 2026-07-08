package com.digital.gramseva;

import android.content.Context;
import android.content.SharedPreferences;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class UserPreferences {

    private static final String PREF_NAME = "gramseva_user";
    private static final String KEY_NAME = "user_name";
    private static final String KEY_MOBILE = "user_mobile";
    private static final String KEY_EMAIL = "user_email";
    private static final String KEY_VILLAGE = "user_village";
    private static final String KEY_DISTRICT = "user_district";
    private static final String KEY_PASSWORD = "user_password";
    private static final String KEY_IS_LOGGED_IN = "is_logged_in";
    private static final String KEY_LANGUAGE = "app_language";
    private static final String KEY_NOTIFICATIONS = "notifications_enabled";
    private static final String KEY_ACCESS_TOKEN = "supabase_access_token";
    private static final String KEY_REFRESH_TOKEN = "supabase_refresh_token";
    private static final String KEY_COMPLAINT_COUNT = "complaint_count";
    private static final String KEY_COMPLAINT_PREFIX = "complaint_";

    private final SharedPreferences prefs;

    public UserPreferences(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public void saveUser(String name, String mobile, String email, String password, String village, String district) {
        prefs.edit()
                .putString(KEY_NAME, name)
                .putString(KEY_MOBILE, mobile)
                .putString(KEY_EMAIL, email)
                .putString(KEY_PASSWORD, password)
                .putString(KEY_VILLAGE, village)
                .putString(KEY_DISTRICT, district)
                .putBoolean(KEY_IS_LOGGED_IN, true)
                .apply();
    }

    public String getName() {
        return prefs.getString(KEY_NAME, "");
    }

    public String getMobile() {
        return prefs.getString(KEY_MOBILE, "");
    }

    public String getEmail() {
        return prefs.getString(KEY_EMAIL, "");
    }

    public String getVillage() {
        return prefs.getString(KEY_VILLAGE, "");
    }

    public String getDistrict() {
        return prefs.getString(KEY_DISTRICT, "");
    }

    public String getPassword() {
        return prefs.getString(KEY_PASSWORD, "");
    }

    public boolean isLoggedIn() {
        return prefs.getBoolean(KEY_IS_LOGGED_IN, false);
    }

    public void setLanguage(String lang) {
        prefs.edit().putString(KEY_LANGUAGE, lang).apply();
    }

    public String getLanguage() {
        return prefs.getString(KEY_LANGUAGE, "english");
    }

    public void setNotificationsEnabled(boolean enabled) {
        prefs.edit().putBoolean(KEY_NOTIFICATIONS, enabled).apply();
    }

    public boolean isNotificationsEnabled() {
        return prefs.getBoolean(KEY_NOTIFICATIONS, true);
    }

    public void saveComplaint(String category, String description, String photoPath, String lat, String lng) {
        int count = prefs.getInt(KEY_COMPLAINT_COUNT, 0) + 1;
        String id = "#CMP-" + new SimpleDateFormat("yyyyMMdd-HHmmss", Locale.getDefault()).format(new Date());
        String date = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).format(new Date());
        String complaint = id + "||" + category + "||" + description + "||" + date + "||pending||" + (photoPath != null ? photoPath : "") + "||" + (lat != null ? lat : "") + "||" + (lng != null ? lng : "");
        prefs.edit()
                .putString(KEY_COMPLAINT_PREFIX + count, complaint)
                .putInt(KEY_COMPLAINT_COUNT, count)
                .apply();
    }

    public List<String[]> getComplaints() {
        List<String[]> list = new ArrayList<>();
        int count = prefs.getInt(KEY_COMPLAINT_COUNT, 0);
        for (int i = count; i >= 1; i--) {
            String data = prefs.getString(KEY_COMPLAINT_PREFIX + i, "");
            if (!data.isEmpty()) {
                list.add(data.split("\\|\\|", -1));
            }
        }
        return list;
    }

    public void cancelComplaint(String complaintId) {
        int count = prefs.getInt(KEY_COMPLAINT_COUNT, 0);
        SharedPreferences.Editor editor = prefs.edit();
        for (int i = 1; i <= count; i++) {
            String data = prefs.getString(KEY_COMPLAINT_PREFIX + i, "");
            if (!data.isEmpty()) {
                String[] parts = data.split("\\|\\|", -1);
                if (parts.length >= 5 && parts[0].equals(complaintId)) {
                    parts[4] = "cancelled";
                    editor.putString(KEY_COMPLAINT_PREFIX + i, String.join("||", parts));
                    break;
                }
            }
        }
        editor.apply();
    }

    public void setSupabaseSession(String accessToken, String refreshToken) {
        prefs.edit()
                .putString(KEY_ACCESS_TOKEN, accessToken)
                .putString(KEY_REFRESH_TOKEN, refreshToken)
                .apply();
    }

    public String getAccessToken() {
        return prefs.getString(KEY_ACCESS_TOKEN, "");
    }

    public String getRefreshToken() {
        return prefs.getString(KEY_REFRESH_TOKEN, "");
    }

    public boolean hasSupabaseSession() {
        return !getAccessToken().isEmpty();
    }

    public void logout() {
        prefs.edit()
                .putBoolean(KEY_IS_LOGGED_IN, false)
                .putString(KEY_ACCESS_TOKEN, "")
                .putString(KEY_REFRESH_TOKEN, "")
                .apply();
    }

    // ─── Chat History ───────────────────────────────────────────────────────────

    private static final String KEY_CHAT_COUNT = "chat_msg_count";
    private static final String KEY_CHAT_PREFIX = "chat_msg_";
    private static final int MAX_CHAT_HISTORY = 100; // max messages to keep

    public void saveChatMessage(ChatMessage msg) {
        int count = prefs.getInt(KEY_CHAT_COUNT, 0) + 1;
        // Store as "type||timestamp||message"
        String data = msg.getType() + "||" + msg.getTimestamp() + "||" + msg.getMessage().replace("||", "|");
        prefs.edit()
                .putString(KEY_CHAT_PREFIX + count, data)
                .putInt(KEY_CHAT_COUNT, Math.min(count, MAX_CHAT_HISTORY))
                .apply();
    }

    public List<ChatMessage> getChatHistory() {
        List<ChatMessage> list = new ArrayList<>();
        int count = prefs.getInt(KEY_CHAT_COUNT, 0);
        for (int i = 1; i <= count; i++) {
            String data = prefs.getString(KEY_CHAT_PREFIX + i, "");
            if (!data.isEmpty()) {
                String[] parts = data.split("\\|\\|", 3);
                if (parts.length == 3) {
                    try {
                        int type = Integer.parseInt(parts[0]);
                        long timestamp = Long.parseLong(parts[1]);
                        String message = parts[2];
                        list.add(new ChatMessage(message, type, timestamp));
                    } catch (Exception ignored) {}
                }
            }
        }
        return list;
    }

    public void clearChatHistory() {
        int count = prefs.getInt(KEY_CHAT_COUNT, 0);
        SharedPreferences.Editor editor = prefs.edit();
        for (int i = 1; i <= count; i++) {
            editor.remove(KEY_CHAT_PREFIX + i);
        }
        editor.putInt(KEY_CHAT_COUNT, 0).apply();
    }
}
