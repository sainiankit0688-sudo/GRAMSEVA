package com.digital.gramseva;

import android.os.Handler;
import android.os.Looper;

import com.digital.gramseva.BuildConfig;

import org.json.JSONArray;
import org.json.JSONObject;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import java.util.concurrent.TimeUnit;

public class GeminiClient {

    private static final String GROQ_API_KEY = BuildConfig.GROQ_API_KEY;
    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL = "llama-3.3-70b-versatile";

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    private final OkHttpClient client;

    public GeminiClient() {
        client = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
    }

    public interface GeminiCallback {
        void onSuccess(String response);
        void onError(String error);
    }

    public void sendMessage(String message, GeminiCallback callback) {
        new Thread(() -> {
            try {
                // System message
                JSONObject systemMsg = new JSONObject();
                systemMsg.put("role", "system");
                systemMsg.put("content",
                        "You are GramSeva AI Assistant, a helpful assistant for a rural governance app called GramSeva. "
                        + "Answer questions about Indian government schemes, eligibility, documents, and rural services. "
                        + "Keep answers concise, helpful, and in simple language. "
                        + "You can answer in Hindi or English based on the user's language.");

                // User message
                JSONObject userMsg = new JSONObject();
                userMsg.put("role", "user");
                userMsg.put("content", message);

                JSONArray messages = new JSONArray();
                messages.put(systemMsg);
                messages.put(userMsg);

                // Build request body
                JSONObject requestBody = new JSONObject();
                requestBody.put("model", MODEL);
                requestBody.put("messages", messages);
                requestBody.put("max_tokens", 500);
                requestBody.put("temperature", 0.7);

                RequestBody body = RequestBody.create(requestBody.toString(), JSON);
                Request request = new Request.Builder()
                        .url(GROQ_URL)
                        .header("Authorization", "Bearer " + GROQ_API_KEY)
                        .header("Content-Type", "application/json")
                        .post(body)
                        .build();

                Response response = client.newCall(request).execute();
                String responseBody = response.body() != null ? response.body().string() : "";

                if (response.isSuccessful()) {
                    JSONObject obj = new JSONObject(responseBody);
                    String reply = obj
                            .getJSONArray("choices")
                            .getJSONObject(0)
                            .getJSONObject("message")
                            .getString("content");
                    postResult(() -> callback.onSuccess(reply));
                } else {
                    String errorMsg = "Server error " + response.code();
                    try {
                        JSONObject errObj = new JSONObject(responseBody);
                        errorMsg = errObj.getJSONObject("error").getString("message");
                    } catch (Exception ignored) {}
                    final String finalError = errorMsg;
                    postResult(() -> callback.onError(finalError));
                }

            } catch (Exception e) {
                postResult(() -> callback.onError("Network error: " + e.getMessage()));
            }
        }).start();
    }

    private void postResult(Runnable runnable) {
        new Handler(Looper.getMainLooper()).post(runnable);
    }
}
