package com.digital.gramseva;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

public class SchemesActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_schemes);

        findViewById(R.id.nav_home).setOnClickListener(v -> {
        });
        findViewById(R.id.nav_services).setOnClickListener(v -> {
            startActivity(new Intent(this, JobAlertsActivity.class));
            overridePendingTransition(0, 0);
        });
        findViewById(R.id.nav_complaints).setOnClickListener(v -> {
            startActivity(new Intent(this, ComplaintsActivity.class));
            overridePendingTransition(0, 0);
        });
        findViewById(R.id.nav_profile).setOnClickListener(v -> {
            startActivity(new Intent(this, ProfileActivity.class));
            overridePendingTransition(0, 0);
        });

        findViewById(R.id.category_education).setOnClickListener(v -> {
            startActivity(new Intent(this, EducationActivity.class));
        });
        findViewById(R.id.category_health).setOnClickListener(v -> {
            startActivity(new Intent(this, HealthCardActivity.class));
        });
        findViewById(R.id.category_agriculture).setOnClickListener(v -> {
            startActivity(new Intent(this, AgricultureActivity.class));
        });
        findViewById(R.id.category_housing).setOnClickListener(v -> {
            startActivity(new Intent(this, HousingActivity.class));
        });
        findViewById(R.id.category_emergency).setOnClickListener(v -> {
            startActivity(new Intent(this, EmergencyServicesActivity.class));
        });

        findViewById(R.id.btn_menu).setOnClickListener(v -> {
            startActivity(new Intent(this, MenuActivity.class));
            overridePendingTransition(0, 0);
        });

        findViewById(R.id.btn_notifications).setOnClickListener(v -> {
            Toast.makeText(this, getString(R.string.notifications_coming_soon), Toast.LENGTH_SHORT).show();
        });

        findViewById(R.id.card_ask_ai).setOnClickListener(v -> {
            startActivity(new Intent(this, AiChatActivity.class));
        });

        findViewById(R.id.fab_ai).setOnClickListener(v -> {
            startActivity(new Intent(this, AiChatActivity.class));
        });
    }
}
