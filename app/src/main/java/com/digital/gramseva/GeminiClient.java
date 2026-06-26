package com.digital.gramseva;

import android.os.Handler;
import android.os.Looper;

import org.json.JSONObject;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class GeminiClient {

    // Use 10.0.2.2 for Android emulator to reach host machine
    // Change this to your computer's local IP when running on a physical device
    private static final String BASE_URL = "http://10.0.2.2:3000";
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private final OkHttpClient client;

    public GeminiClient() {
        client = new OkHttpClient();
    }

    public interface GeminiCallback {
        void onSuccess(String response);
        void onError(String error);
    }

    public void sendMessage(String message, GeminiCallback callback) {
        String json = "{\"message\": \"" + escapeJson(message) + "\"}";

        RequestBody body = RequestBody.create(json, JSON);
        Request request = new Request.Builder()
                .url(BASE_URL + "/api/gemini")
                .header("Content-Type", "application/json")
                .post(body)
                .build();

        new Thread(() -> {
            try {
                Response response = client.newCall(request).execute();
                String responseBody = response.body() != null ? response.body().string() : "";

                if (response.isSuccessful()) {
                    JSONObject obj = new JSONObject(responseBody);
                    String reply = obj.optString("reply", "");
                    postResult(() -> callback.onSuccess(reply));
                } else {
                    postResult(() -> callback.onError("Server error: " + responseBody));
                }
            } catch (Exception e) {
                postResult(() -> callback.onError("Error: " + e.getMessage()));
            }
        }).start();
    }

    private String escapeJson(String s) {
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    private void postResult(Runnable runnable) {
        new Handler(Looper.getMainLooper()).post(runnable);
    }
}
