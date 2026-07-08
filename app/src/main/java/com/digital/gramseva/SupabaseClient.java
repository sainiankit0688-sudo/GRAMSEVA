package com.digital.gramseva;

import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.util.Log;

import com.digital.gramseva.BuildConfig;

import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class SupabaseClient {

    private static final String TAG = "SupabaseClient";
    private static final String SUPABASE_URL = BuildConfig.SUPABASE_URL;
    private static final String SUPABASE_ANON_KEY = BuildConfig.SUPABASE_ANON_KEY;

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private final OkHttpClient client;

    private static SupabaseClient instance;

    public static SupabaseClient getInstance() {
        if (instance == null) {
            instance = new SupabaseClient();
        }
        return instance;
    }

    // ─── Current user / session ───────────────────────────────────────────────────

    public static class UserInfo {
        public final String id;
        public final String email;
        public final String name;

        public UserInfo(String id, String email, String name) {
            this.id = id;
            this.email = email;
            this.name = name;
        }
    }

    public static class Session {
        public final String accessToken;
        public final String refreshToken;
        public final long expiresAt;

        public Session(String accessToken, String refreshToken, long expiresAt) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.expiresAt = expiresAt;
        }
    }

    private UserInfo currentUser;
    private Session currentSession;
    private TokenUpdateListener tokenUpdateListener;
    private SessionExpiredListener sessionExpiredListener;

    // ─── Token persistence and session expiry listeners ──────────────────────────

    public interface TokenUpdateListener {
        void onTokensRefreshed(String accessToken, String refreshToken);
    }

    public interface SessionExpiredListener {
        void onSessionExpired();
    }

    public void setTokenUpdateListener(TokenUpdateListener listener) {
        this.tokenUpdateListener = listener;
    }

    public void setSessionExpiredListener(SessionExpiredListener listener) {
        this.sessionExpiredListener = listener;
    }

    public UserInfo getCurrentUser() {
        return currentUser;
    }

    public Session getCurrentSession() {
        return currentSession;
    }

    public String getCurrentUserId() {
        return currentUser != null ? currentUser.id : null;
    }

    /**
     * Returns a valid (non-expired) access token, refreshing automatically if needed.
     * Can be called from any thread. If called from the main thread and a refresh
     * is needed, it will be performed synchronously (not recommended — call from
     * background thread). Returns null if the session is invalid or refresh fails.
     */
    public String getAccessToken() {
        if (currentSession == null) return null;

        long now = System.currentTimeMillis() / 1000;
        if (now < currentSession.expiresAt) {
            return currentSession.accessToken;
        }

        Log.d(TAG, "getAccessToken: token expired, refreshing...");
        return refreshAccessTokenSync();
    }

    /**
     * Synchronously refreshes the access token using the stored refresh token.
     * Must be called from a background thread (not main thread).
     */
    private synchronized String refreshAccessTokenSync() {
        if (currentSession == null || currentSession.refreshToken == null || currentSession.refreshToken.isEmpty()) {
            Log.e(TAG, "refreshAccessTokenSync: no refresh token available");
            notifySessionExpired();
            return null;
        }

        try {
            JSONObject body = new JSONObject();
            body.put("refresh_token", currentSession.refreshToken);

            RequestBody requestBody = RequestBody.create(body.toString(), JSON);
            Request request = new Request.Builder()
                    .url(SUPABASE_URL + "/auth/v1/token?grant_type=refresh_token")
                    .header("apikey", SUPABASE_ANON_KEY)
                    .header("Content-Type", "application/json")
                    .post(requestBody)
                    .build();

            Log.d(TAG, "refreshAccessTokenSync: POST /auth/v1/token?grant_type=refresh_token");
            Response response = client.newCall(request).execute();
            String responseBody = response.body() != null ? response.body().string() : "";

            if (response.isSuccessful()) {
                JSONObject obj = new JSONObject(responseBody);
                String newAccessToken = obj.getString("access_token");
                String newRefreshToken = obj.getString("refresh_token");

                setSession(newAccessToken, newRefreshToken);

                if (tokenUpdateListener != null) {
                    tokenUpdateListener.onTokensRefreshed(newAccessToken, newRefreshToken);
                }

                Log.i(TAG, "refreshAccessTokenSync: token refreshed successfully");
                return newAccessToken;
            } else {
                Log.e(TAG, "refreshAccessTokenSync: refresh failed HTTP " + response.code() + " " + responseBody);
                clearSession();
                notifySessionExpired();
                return null;
            }
        } catch (Exception e) {
            Log.e(TAG, "refreshAccessTokenSync: exception: " + e.getMessage());
            notifySessionExpired();
            return null;
        }
    }

    private void notifySessionExpired() {
        postResult(() -> {
            if (sessionExpiredListener != null) {
                sessionExpiredListener.onSessionExpired();
            }
        });
    }

    public boolean hasValidSession() {
        if (currentSession == null) return false;
        long now = System.currentTimeMillis() / 1000;
        boolean valid = now < currentSession.expiresAt;
        Log.d(TAG, "hasValidSession: now=" + now + " expiresAt=" + currentSession.expiresAt + " valid=" + valid);
        return valid;
    }

    // ─── Constructor (private — use getInstance()) ────────────────────────────────

    private SupabaseClient() {
        client = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS)
                .build();
    }

    // ─── Session management ──────────────────────────────────────────────────────

    public void setSession(String accessToken, String refreshToken) {
        Log.d(TAG, "=== setSession ===");

        this.currentSession = parseSession(accessToken, refreshToken);
        this.currentUser = parseUserFromToken(accessToken);

        if (currentSession != null) {
            Log.d(TAG, "currentSession: accessToken=" + maskToken(accessToken));
            Log.d(TAG, "currentSession: refreshToken=" + maskToken(refreshToken));
            Log.d(TAG, "session expiry: " + currentSession.expiresAt + " (epoch seconds)");
        } else {
            Log.w(TAG, "currentSession: null (failed to parse)");
        }

        if (currentUser != null) {
            Log.d(TAG, "currentUser: id=" + currentUser.id);
            Log.d(TAG, "currentUser: email=" + currentUser.email);
            Log.d(TAG, "currentUser: name=" + currentUser.name);
            Log.d(TAG, "currentUser.id=" + currentUser.id);
        } else {
            Log.w(TAG, "currentUser: null (failed to parse)");
        }
    }

    public void clearSession() {
        Log.d(TAG, "clearSession: clearing current user and session");
        currentUser = null;
        currentSession = null;
    }

    private Session parseSession(String accessToken, String refreshToken) {
        try {
            String[] parts = accessToken.split("\\.");
            if (parts.length >= 2) {
                byte[] decoded = Base64.decode(parts[1], Base64.URL_SAFE);
                String json = new String(decoded, "UTF-8");
                JSONObject payload = new JSONObject(json);
                long exp = payload.optLong("exp", 0);
                return new Session(accessToken, refreshToken, exp);
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to parse session: " + e.getMessage());
        }
        return null;
    }

    private UserInfo parseUserFromToken(String accessToken) {
        try {
            String[] parts = accessToken.split("\\.");
            if (parts.length >= 2) {
                byte[] decoded = Base64.decode(parts[1], Base64.URL_SAFE);
                String json = new String(decoded, "UTF-8");
                JSONObject payload = new JSONObject(json);
                String id = payload.optString("sub", "");
                String email = payload.optString("email", "");
                String name = payload.optString("name", "");
                if (name.isEmpty()) {
                    name = payload.optString("full_name", "");
                }
                return new UserInfo(id, email, name);
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to parse user from token: " + e.getMessage());
        }
        return null;
    }

    private String maskToken(String token) {
        if (token == null || token.length() < 10) return token;
        return token.substring(0, 10) + "..." + token.substring(token.length() - 4);
    }

    private void postResult(Runnable runnable) {
        new Handler(Looper.getMainLooper()).post(runnable);
    }

    // ─── Auth ──────────────────────────────────────────────────────────────────────

    public interface AuthCallback {
        void onSuccess(String accessToken, String refreshToken, String email, String name);
        void onError(String error);
    }

    public void signInWithGoogleIdToken(String idToken, AuthCallback callback) {
        String json = "{\"provider\": \"google\", \"id_token\": \"" + idToken + "\", \"gotrue_meta_security\": {}}";

        RequestBody body = RequestBody.create(json, JSON);
        Request request = new Request.Builder()
                .url(SUPABASE_URL + "/auth/v1/token?grant_type=id_token")
                .header("apikey", SUPABASE_ANON_KEY)
                .header("Content-Type", "application/json")
                .post(body)
                .build();

        executeRequest(request, new RequestCallback() {
            @Override
            public void onSuccess(String responseBody) {
                try {
                    JSONObject obj = new JSONObject(responseBody);
                    String accessToken = obj.getString("access_token");
                    String refreshToken = obj.getString("refresh_token");
                    JSONObject user = obj.getJSONObject("user");
                    JSONObject userMetadata = user.getJSONObject("user_metadata");
                    String email = userMetadata.optString("email", "");
                    String name = userMetadata.optString("full_name", "User");

                    // Store session in singleton
                    setSession(accessToken, refreshToken);

                    postResult(() -> callback.onSuccess(accessToken, refreshToken, email, name));
                } catch (Exception e) {
                    postResult(() -> callback.onError("Parse error: " + e.getMessage()));
                }
            }

            @Override
            public void onError(String error) {
                postResult(() -> callback.onError(error));
            }
        });
    }

    // ─── Photo Upload ─────────────────────────────────────────────────────────────

    public interface UploadCallback {
        void onSuccess(String publicUrl);
        void onError(String error);
    }

    public void uploadPhoto(String userId, String filePath, UploadCallback callback) {
        String token = getAccessToken();
        if (token == null) {
            postResult(() -> callback.onError("Session expired. Please login again."));
            return;
        }

        File file = new File(filePath);
        if (!file.exists()) {
            postResult(() -> callback.onError("Photo file not found"));
            return;
        }

        String fileName = System.currentTimeMillis() + "_" + file.getName();
        String objectPath = userId + "/" + fileName;
        String mediaType = filePath.endsWith(".png") ? "image/png" : "image/jpeg";

        RequestBody fileBody = RequestBody.create(file, MediaType.parse(mediaType));
        Request request = new Request.Builder()
                .url(SUPABASE_URL + "/storage/v1/object/complaints/" + objectPath)
                .header("Authorization", "Bearer " + token)
                .header("apikey", SUPABASE_ANON_KEY)
                .header("Content-Type", mediaType)
                .put(fileBody)
                .build();

        executeRequest(request, new RequestCallback() {
            @Override
            public void onSuccess(String responseBody) {
                String publicUrl = SUPABASE_URL + "/storage/v1/object/public/complaints/" + objectPath;
                Log.i(TAG, "Photo uploaded: " + publicUrl);
                postResult(() -> callback.onSuccess(publicUrl));
            }

            @Override
            public void onError(String error) {
                postResult(() -> callback.onError(error));
            }
        });
    }

    // ─── Complaint Insert ─────────────────────────────────────────────────────────

    public interface InsertCallback {
        void onSuccess(Complaint complaint);
        void onError(String error);
    }

    public void insertComplaint(Complaint complaint, InsertCallback callback) {
        String token = getAccessToken();
        if (token == null) {
            postResult(() -> callback.onError("Session expired. Please login again."));
            return;
        }

        // Build JSON manually to ensure correct field names and types
        try {
            org.json.JSONObject payload = new org.json.JSONObject();
            payload.put("user_id", complaint.getUserId());
            payload.put("category", complaint.getCategory());
            payload.put("description", complaint.getDescription());
            payload.put("status", complaint.getStatus() != null ? complaint.getStatus() : "Pending");
            if (complaint.getPhotoUrl() != null && !complaint.getPhotoUrl().isEmpty()) {
                payload.put("photo_url", complaint.getPhotoUrl());
            }
            if (complaint.getLatitude() != null && complaint.getLatitude() != 0) {
                payload.put("latitude", complaint.getLatitude());
            }
            if (complaint.getLongitude() != null && complaint.getLongitude() != 0) {
                payload.put("longitude", complaint.getLongitude());
            }
            if (complaint.getAddress() != null && !complaint.getAddress().isEmpty()) {
                payload.put("address", complaint.getAddress());
            }

            String json = payload.toString();
            Log.d(TAG, "insertComplaint: POST /rest/v1/complaints");
            Log.d(TAG, "insertComplaint payload: " + json);
            Log.d(TAG, "insertComplaint user_id: " + complaint.getUserId());

            RequestBody body = RequestBody.create(json, JSON);
            final Request request = new Request.Builder()
                    .url(SUPABASE_URL + "/rest/v1/complaints")
                    .header("Authorization", "Bearer " + token)
                    .header("apikey", SUPABASE_ANON_KEY)
                    .header("Content-Type", "application/json")
                    .header("Prefer", "return=representation")
                    .post(body)
                    .build();

            executeRequestWithRetry(request, new RequestCallback() {
                @Override
                public void onSuccess(String responseBody) {
                    try {
                        com.google.gson.Gson gson = new com.google.gson.Gson();
                        Complaint[] complaints = gson.fromJson(responseBody, Complaint[].class);
                        if (complaints != null && complaints.length > 0) {
                            Log.d(TAG, "insertComplaint success: id=" + complaints[0].getId());
                            postResult(() -> callback.onSuccess(complaints[0]));
                        } else {
                            Log.d(TAG, "insertComplaint: 201 empty body — treating as success");
                            postResult(() -> callback.onSuccess(complaint));
                        }
                    } catch (Exception e) {
                        Log.w(TAG, "insertComplaint parse warning: " + e.getMessage() + " — treating as success");
                        postResult(() -> callback.onSuccess(complaint));
                    }
                }

                @Override
                public void onError(String error) {
                    Log.e(TAG, "insertComplaint FAILED: " + error);
                    postResult(() -> callback.onError(error));
                }
            });

        } catch (Exception e) {
            Log.e(TAG, "insertComplaint JSON build error: " + e.getMessage());
            postResult(() -> callback.onError("JSON error: " + e.getMessage()));
        }
    }

    // ─── Fetch User's Complaints ──────────────────────────────────────────────────

    public interface ComplaintsCallback {
        void onSuccess(java.util.List<Complaint> complaints);
        void onError(String error);
    }

    public void getUserComplaints(ComplaintsCallback callback) {
        String token = getAccessToken();
        if (token == null) {
            postResult(() -> callback.onError("Session expired. Please login again."));
            return;
        }

        Log.d(TAG, "getUserComplaints: GET /rest/v1/complaints");

        String userId = currentUser != null ? currentUser.id : "";
        String url = SUPABASE_URL + "/rest/v1/complaints?select=*&order=created_at.desc";
        if (!userId.isEmpty()) {
            url += "&user_id=eq." + userId;
        }
        Log.d(TAG, "getUserComplaints URL: " + url);

        Request request = new Request.Builder()
                .url(url)
                .header("Authorization", "Bearer " + token)
                .header("apikey", SUPABASE_ANON_KEY)
                .header("Content-Type", "application/json")
                .get()
                .build();

        executeRequestWithRetry(request, new RequestCallback() {
            @Override
            public void onSuccess(String responseBody) {
                Log.d(TAG, "getUserComplaints response: " + responseBody);
                try {
                    com.google.gson.Gson gson = new com.google.gson.Gson();
                    java.util.List<Complaint> complaints = gson.fromJson(responseBody,
                            new com.google.gson.reflect.TypeToken<java.util.List<Complaint>>(){}.getType());
                    postResult(() -> callback.onSuccess(complaints != null ? complaints : new java.util.ArrayList<Complaint>()));
                } catch (Exception e) {
                    Log.e(TAG, "getUserComplaints parse error: " + e.getMessage());
                    postResult(() -> callback.onError("Parse error: " + e.getMessage()));
                }
            }

            @Override
            public void onError(String error) {
                Log.e(TAG, "getUserComplaints error: " + error);
                postResult(() -> callback.onError(error));
            }
        });
    }

    // ─── Cancel Complaint ─────────────────────────────────────────────────────────

    // ─── Fetch Single Complaint by ID ─────────────────────────────────────────

    public void getComplaintById(String complaintId, ComplaintsCallback callback) {
        String token = getAccessToken();
        if (token == null) {
            postResult(() -> callback.onError("Session expired. Please login again."));
            return;
        }

        String url = SUPABASE_URL + "/rest/v1/complaints?select=*&id=eq." + complaintId;
        Request request = new Request.Builder()
                .url(url)
                .header("Authorization", "Bearer " + token)
                .header("apikey", SUPABASE_ANON_KEY)
                .header("Content-Type", "application/json")
                .get()
                .build();

        executeRequestWithRetry(request, new RequestCallback() {
            @Override
            public void onSuccess(String responseBody) {
                try {
                    com.google.gson.Gson gson = new com.google.gson.Gson();
                    java.util.List<Complaint> complaints = gson.fromJson(responseBody,
                            new com.google.gson.reflect.TypeToken<java.util.List<Complaint>>(){}.getType());
                    postResult(() -> callback.onSuccess(complaints != null ? complaints : new java.util.ArrayList<Complaint>()));
                } catch (Exception e) {
                    postResult(() -> callback.onError("Parse error: " + e.getMessage()));
                }
            }

            @Override
            public void onError(String error) {
                postResult(() -> callback.onError(error));
            }
        });
    }

    // ─── Admin: Get All Complaints ──────────────────────────────────────────────

    public void getAllComplaints(ComplaintsCallback callback) {
        String token = getAccessToken();
        if (token == null) {
            postResult(() -> callback.onError("Session expired. Please login again."));
            return;
        }

        String url = SUPABASE_URL + "/rest/v1/complaints?select=*&order=created_at.desc";
        Request request = new Request.Builder()
                .url(url)
                .header("Authorization", "Bearer " + token)
                .header("apikey", SUPABASE_ANON_KEY)
                .header("Content-Type", "application/json")
                .get()
                .build();

        executeRequestWithRetry(request, new RequestCallback() {
            @Override
            public void onSuccess(String responseBody) {
                try {
                    com.google.gson.Gson gson = new com.google.gson.Gson();
                    java.util.List<Complaint> complaints = gson.fromJson(responseBody,
                            new com.google.gson.reflect.TypeToken<java.util.List<Complaint>>(){}.getType());
                    postResult(() -> callback.onSuccess(complaints != null ? complaints : new java.util.ArrayList<Complaint>()));
                } catch (Exception e) {
                    postResult(() -> callback.onError("Parse error: " + e.getMessage()));
                }
            }

            @Override
            public void onError(String error) {
                postResult(() -> callback.onError(error));
            }
        });
    }

    // ─── Admin: Update Complaint Status ─────────────────────────────────────────

    public void updateComplaintStatus(String complaintId, String newStatus, SimpleCallback callback) {
        String token = getAccessToken();
        if (token == null) {
            postResult(() -> callback.onError("Session expired. Please login again."));
            return;
        }

        try {
            org.json.JSONObject body = new org.json.JSONObject();
            body.put("status", newStatus);

            RequestBody requestBody = RequestBody.create(body.toString(), JSON);
            Request request = new Request.Builder()
                    .url(SUPABASE_URL + "/rest/v1/complaints?id=eq." + complaintId)
                    .header("Authorization", "Bearer " + token)
                    .header("apikey", SUPABASE_ANON_KEY)
                    .header("Content-Type", "application/json")
                    .header("Prefer", "return=minimal")
                    .patch(requestBody)
                    .build();

            executeRequestWithRetry(request, new RequestCallback() {
                @Override
                public void onSuccess(String responseBody) {
                    postResult(() -> callback.onSuccess());
                }

                @Override
                public void onError(String error) {
                    postResult(() -> callback.onError(error));
                }
            });
        } catch (Exception e) {
            postResult(() -> callback.onError("JSON error: " + e.getMessage()));
        }
    }

    // ─── Admin: Insert Complaint Update ─────────────────────────────────────────

    public void insertComplaintUpdate(String complaintId,
                                       String previousStatus, String newStatus,
                                       String adminRemarks, String updatedBy,
                                       SimpleCallback callback) {
        String token = getAccessToken();
        if (token == null) {
            postResult(() -> callback.onError("Session expired. Please login again."));
            return;
        }

        try {
            org.json.JSONObject payload = new org.json.JSONObject();
            payload.put("complaint_id", complaintId);
            payload.put("previous_status", previousStatus);
            payload.put("new_status", newStatus);
            payload.put("admin_remarks", adminRemarks != null ? adminRemarks : "");
            payload.put("updated_by", updatedBy);

            RequestBody body = RequestBody.create(payload.toString(), JSON);
            Request request = new Request.Builder()
                    .url(SUPABASE_URL + "/rest/v1/complaint_updates")
                    .header("Authorization", "Bearer " + token)
                    .header("apikey", SUPABASE_ANON_KEY)
                    .header("Content-Type", "application/json")
                    .header("Prefer", "return=minimal")
                    .post(body)
                    .build();

            executeRequestWithRetry(request, new RequestCallback() {
                @Override
                public void onSuccess(String responseBody) {
                    postResult(() -> callback.onSuccess());
                }

                @Override
                public void onError(String error) {
                    postResult(() -> callback.onError(error));
                }
            });
        } catch (Exception e) {
            postResult(() -> callback.onError("JSON error: " + e.getMessage()));
        }
    }

    // ─── Admin: Get Complaint Updates ───────────────────────────────────────────

    public interface ComplaintUpdatesCallback {
        void onSuccess(java.util.List<ComplaintUpdate> updates);
        void onError(String error);
    }

    public void getComplaintUpdates(String complaintId, ComplaintUpdatesCallback callback) {
        String token = getAccessToken();
        if (token == null) {
            postResult(() -> callback.onError("Session expired. Please login again."));
            return;
        }

        String url = SUPABASE_URL + "/rest/v1/complaint_updates?select=*&complaint_id=eq." + complaintId + "&order=created_at.desc";
        Request request = new Request.Builder()
                .url(url)
                .header("Authorization", "Bearer " + token)
                .header("apikey", SUPABASE_ANON_KEY)
                .header("Content-Type", "application/json")
                .get()
                .build();

        executeRequestWithRetry(request, new RequestCallback() {
            @Override
            public void onSuccess(String responseBody) {
                try {
                    com.google.gson.Gson gson = new com.google.gson.Gson();
                    java.util.List<ComplaintUpdate> updates = gson.fromJson(responseBody,
                            new com.google.gson.reflect.TypeToken<java.util.List<ComplaintUpdate>>(){}.getType());
                    postResult(() -> callback.onSuccess(updates != null ? updates : new java.util.ArrayList<ComplaintUpdate>()));
                } catch (Exception e) {
                    postResult(() -> callback.onError("Parse error: " + e.getMessage()));
                }
            }

            @Override
            public void onError(String error) {
                postResult(() -> callback.onError(error));
            }
        });
    }

    public void cancelComplaint(String complaintId, SimpleCallback callback) {
        String token = getAccessToken();
        if (token == null) {
            postResult(() -> callback.onError("Session expired. Please login again."));
            return;
        }

        JSONObject body = new JSONObject();
        try {
            body.put("status", "cancelled");
        } catch (Exception ignored) {}

        RequestBody requestBody = RequestBody.create(body.toString(), JSON);
        Request request = new Request.Builder()
                .url(SUPABASE_URL + "/rest/v1/complaints?id=eq." + complaintId)
                .header("Authorization", "Bearer " + token)
                .header("apikey", SUPABASE_ANON_KEY)
                .header("Content-Type", "application/json")
                .header("Prefer", "return=minimal")
                .patch(requestBody)
                .build();

        executeRequestWithRetry(request, new RequestCallback() {
            @Override
            public void onSuccess(String responseBody) {
                postResult(() -> callback.onSuccess());
            }

            @Override
            public void onError(String error) {
                postResult(() -> callback.onError(error));
            }
        });
    }

    // ─── Utils ────────────────────────────────────────────────────────────────────

    public interface SimpleCallback {
        void onSuccess();
        void onError(String error);
    }

    private interface RequestCallback {
        void onSuccess(String responseBody);
        void onError(String error);
    }

    private void executeRequest(Request request, RequestCallback callback) {
        executeRequestWithRetry(request, callback, false);
    }

    /**
     * Executes an HTTP request with automatic token refresh and retry on 401.
     * On first 401, the token is refreshed and the request is retried once.
     */
    private void executeRequestWithRetry(Request request, RequestCallback callback) {
        executeRequestWithRetry(request, callback, true);
    }

    private void executeRequestWithRetry(Request request, RequestCallback callback, boolean allowRetry) {
        new Thread(() -> {
            try {
                Response response = client.newCall(request).execute();
                String responseBody = response.body() != null ? response.body().string() : "";

                if (response.isSuccessful()) {
                    callback.onSuccess(responseBody);
                } else if (response.code() == 401 && allowRetry) {
                    Log.d(TAG, "Got 401, refreshing token and retrying...");
                    String newToken = refreshAccessTokenSync();
                    if (newToken != null) {
                        // Rebuild request with fresh token and retry without retry flag
                        String auth = request.header("Authorization");
                        if (auth != null && auth.startsWith("Bearer ")) {
                            Request newRequest = request.newBuilder()
                                    .header("Authorization", "Bearer " + newToken)
                                    .build();
                            executeRequestWithRetry(newRequest, callback, false);
                            return;
                        }
                    }
                    // Refresh failed — report error
                    callback.onError("Session expired. Please login again.");
                } else {
                    Log.e(TAG, "Request failed: " + response.code() + " " + responseBody);
                    String message = "Request failed (" + response.code() + ")";
                    try {
                        JSONObject err = new JSONObject(responseBody);
                        if (err.has("message")) {
                            message = err.optString("message", message);
                        } else if (err.has("error")) {
                            message = err.optString("error", message);
                        }
                    } catch (Exception ignored) {}
                    callback.onError(message);
                }
            } catch (Exception e) {
                Log.e(TAG, "Request exception: " + e.getMessage());
                callback.onError("Network error: " + e.getMessage());
            }
        }).start();
    }

    // ─── Admin: Delete Complaint ───────────────────────────────────────────────

    public void deleteComplaint(String complaintId, SimpleCallback callback) {
        String token = getAccessToken();
        if (token == null) {
            postResult(() -> callback.onError("Session expired. Please login again."));
            return;
        }

        Request request = new Request.Builder()
                .url(SUPABASE_URL + "/rest/v1/complaints?id=eq." + complaintId)
                .header("Authorization", "Bearer " + token)
                .header("apikey", SUPABASE_ANON_KEY)
                .header("Content-Type", "application/json")
                .delete()
                .build();

        executeRequestWithRetry(request, new RequestCallback() {
            @Override
            public void onSuccess(String responseBody) {
                postResult(() -> callback.onSuccess());
            }

            @Override
            public void onError(String error) {
                postResult(() -> callback.onError(error));
            }
        });
    }

    // ─── Admin Role Check ────────────────────────────────────────────────────────

    public boolean isAdmin() {
        if (currentSession == null) return false;
        try {
            String[] parts = currentSession.accessToken.split("\\.");
            if (parts.length >= 2) {
                byte[] decoded = Base64.decode(parts[1], Base64.URL_SAFE);
                String json = new String(decoded, "UTF-8");
                JSONObject payload = new JSONObject(json);
                JSONObject appMetadata = payload.optJSONObject("app_metadata");
                if (appMetadata != null) {
                    String role = appMetadata.optString("role", "");
                    return "admin".equals(role);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "isAdmin check failed: " + e.getMessage());
        }
        return false;
    }

    /**
     * @deprecated Use getInstance().getCurrentUserId() instead.
     */
    @Deprecated
    public static String extractUserId(String accessToken) {
        try {
            String[] parts = accessToken.split("\\.");
            if (parts.length >= 2) {
                byte[] decoded = Base64.decode(parts[1], Base64.URL_SAFE);
                String json = new String(decoded, "UTF-8");
                return new JSONObject(json).optString("sub", "");
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to decode JWT: " + e.getMessage());
        }
        return "";
    }
}
