package com.digital.gramseva;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

public class SplashActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        new Handler().postDelayed(() -> {
            UserPreferences prefs = new UserPreferences(this);
            if (prefs.hasSupabaseSession()) {
                Log.d("SplashActivity", "Restoring Supabase session from saved preferences");
                SupabaseClient.getInstance().setSession(
                    prefs.getAccessToken(),
                    prefs.getRefreshToken()
                );
                startActivity(new Intent(SplashActivity.this, SchemesActivity.class));
            } else {
                startActivity(new Intent(SplashActivity.this, LoginActivity.class));
            }
            finish();
        }, 2000);
    }
}
