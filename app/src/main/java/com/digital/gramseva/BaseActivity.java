package com.digital.gramseva;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;

public class BaseActivity extends AppCompatActivity {

    private static final String TAG = "BaseActivity";

    @Override
    protected void attachBaseContext(Context newBase) {
        // Restore Supabase session as early as possible
        UserPreferences prefs = new UserPreferences(newBase);
        SupabaseClient supabaseClient = SupabaseClient.getInstance();
        if (supabaseClient.getCurrentUser() == null && prefs.hasSupabaseSession()) {
            Log.d(TAG, "attachBaseContext: restoring session from prefs");
            supabaseClient.setSession(prefs.getAccessToken(), prefs.getRefreshToken());
        }

        String lang = prefs.getLanguage();
        Context context = LocaleHelper.setLocale(newBase, lang);
        super.attachBaseContext(context);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Double-check session restore in onCreate too
        SupabaseClient supabaseClient = SupabaseClient.getInstance();
        if (supabaseClient.getCurrentUser() == null) {
            UserPreferences prefs = new UserPreferences(this);
            if (prefs.hasSupabaseSession()) {
                Log.d(TAG, "onCreate: restoring session from prefs");
                supabaseClient.setSession(prefs.getAccessToken(), prefs.getRefreshToken());
            }
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "onResume: registering token/session listeners");

        SupabaseClient supabaseClient = SupabaseClient.getInstance();

        // Persist refreshed tokens to SharedPreferences
        supabaseClient.setTokenUpdateListener((accessToken, refreshToken) -> {
            UserPreferences prefs = new UserPreferences(this);
            prefs.setSupabaseSession(accessToken, refreshToken);
            Log.d(TAG, "Refreshed tokens persisted to SharedPreferences");
        });

        // Redirect to login when both tokens are invalid
        supabaseClient.setSessionExpiredListener(() -> {
            Log.d(TAG, "Session expired — redirecting to login");
            UserPreferences prefs = new UserPreferences(this);
            prefs.logout();
            Intent intent = new Intent(this, LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            finish();
        });
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d(TAG, "onPause: clearing token/session listeners");
        SupabaseClient supabaseClient = SupabaseClient.getInstance();
        supabaseClient.setTokenUpdateListener(null);
        supabaseClient.setSessionExpiredListener(null);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
    }
}
