package com.digital.gramseva;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

public class AgricultureActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_agriculture);

        findViewById(R.id.btn_back).setOnClickListener(v -> finish());
        findViewById(R.id.btn_notifications).setOnClickListener(v -> {
            Toast.makeText(this, getString(R.string.notifications_coming_soon), Toast.LENGTH_SHORT).show();
        });

        findViewById(R.id.nav_home).setOnClickListener(v -> {
            startActivity(new Intent(this, SchemesActivity.class));
            overridePendingTransition(0, 0);
        });
        findViewById(R.id.nav_complaints).setOnClickListener(v -> {
            startActivity(new Intent(this, ComplaintsActivity.class));
            overridePendingTransition(0, 0);
        });
        findViewById(R.id.nav_services).setOnClickListener(v -> {
            startActivity(new Intent(this, JobAlertsActivity.class));
            overridePendingTransition(0, 0);
        });
        findViewById(R.id.nav_profile).setOnClickListener(v -> {
            startActivity(new Intent(this, ProfileActivity.class));
            overridePendingTransition(0, 0);
        });

        findViewById(R.id.card_govt_schemes).setOnClickListener(v ->
                openDetail(getString(R.string.govt_schemes), new String[]{
                        getString(R.string.pm_kisan),
                        getString(R.string.kcc),
                        getString(R.string.pm_fasal_bima),
                        getString(R.string.soil_health_card)
                })
        );

        findViewById(R.id.card_crop_info).setOnClickListener(v ->
                openDetail(getString(R.string.crop_info), new String[]{
                        getString(R.string.crop_wheat), getString(R.string.crop_rice), getString(R.string.crop_mustard), getString(R.string.crop_sugarcane),
                        getString(R.string.crop_potato), getString(R.string.crop_maize), getString(R.string.crop_gram), getString(R.string.crop_arhar)
                })
        );

        findViewById(R.id.card_weather).setOnClickListener(v ->
                openDetail(getString(R.string.weather_updates), new String[]{
                        getString(R.string.weather_temp),
                        getString(R.string.weather_rain),
                        getString(R.string.weather_humidity),
                        getString(R.string.weather_7day)
                })
        );

        findViewById(R.id.card_mandi_rates).setOnClickListener(v ->
                openDetail(getString(R.string.mandi_rates), new String[]{
                        getString(R.string.mandi_wheat),
                        getString(R.string.mandi_rice),
                        getString(R.string.mandi_mustard),
                        getString(R.string.mandi_sugarcane),
                        getString(R.string.mandi_potato),
                        getString(R.string.mandi_maize)
                })
        );

        findViewById(R.id.card_fertilizer).setOnClickListener(v ->
                openDetail(getString(R.string.fertilizer_guide), new String[]{
                        getString(R.string.fertilizer_urea),
                        getString(R.string.fertilizer_dap),
                        getString(R.string.fertilizer_npk),
                        getString(R.string.fertilizer_potash),
                        getString(R.string.fertilizer_zinc)
                })
        );
    }

    private void openDetail(String title, String[] items) {
        Intent intent = new Intent(this, AgricultureDetailActivity.class);
        intent.putExtra("title", title);
        intent.putExtra("items", items);
        startActivity(intent);
    }
}
