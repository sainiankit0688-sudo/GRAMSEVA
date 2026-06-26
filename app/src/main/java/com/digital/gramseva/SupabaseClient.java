package com.digital.gramseva;

import android.os.Handler;
import android.os.Looper;

import org.json.JSONObject;

import java.io.IOException;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class SupabaseClient {

    // TODO: Replace these with your actual Supabase project URL and anon key
    private static final String SUPABASE_URL = "https://puokblwalpyinsdqughx.supabase.co";
    private static final String SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private final OkHttpClient client;

    public SupabaseClient() {
        client = new OkHttpClient();
    }

    public interface AuthCallback {
        void onSuccess(String accessToken, String refreshToken, String email, String name);
        void onError(String error);
    }

    public void signInWithGoogleIdToken(String idToken, AuthCallback callback) {
        String json = "{\"id_token\": \"" + idToken + "\", \"gotrue_meta_security\": {}}";

        RequestBody body = RequestBody.create(json, JSON);
        Request request = new Request.Builder()
                .url(SUPABASE_URL + "/auth/v1/token?grant_type=id_token")
                .header("apikey", SUPABASE_ANON_KEY)
                .header("Content-Type", "application/json")
                .post(body)
                .build();

        new Thread(() -> {
            try {
                Response response = client.newCall(request).execute();
                String responseBody = response.body() != null ? response.body().string() : "";

                if (response.isSuccessful()) {
                    JSONObject obj = new JSONObject(responseBody);
                    String accessToken = obj.getString("access_token");
                    String refreshToken = obj.getString("refresh_token");
                    JSONObject user = obj.getJSONObject("user");
                    JSONObject userMetadata = user.getJSONObject("user_metadata");
                    String email = userMetadata.optString("email", "");
                    String name = userMetadata.optString("full_name", "User");

                    postResult(() -> callback.onSuccess(accessToken, refreshToken, email, name));
                } else {
                    postResult(() -> callback.onError("Auth failed: " + responseBody));
                }
            } catch (Exception e) {
                postResult(() -> callback.onError("Error: " + e.getMessage()));
            }
        }).start();
    }

    private void postResult(Runnable runnable) {
        new Handler(Looper.getMainLooper()).post(runnable);
    }
}
