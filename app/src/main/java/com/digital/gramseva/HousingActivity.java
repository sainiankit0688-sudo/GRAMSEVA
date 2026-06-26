package com.digital.gramseva;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

public class HousingActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_housing);

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

        findViewById(R.id.card_housing_schemes).setOnClickListener(v ->
                openDetail(getString(R.string.housing_schemes_card), new String[]{
                        getString(R.string.pm_awas)
                })
        );

        findViewById(R.id.card_housing_documents).setOnClickListener(v ->
                openDetail(getString(R.string.housing_documents), new String[]{
                        getString(R.string.doc_aadhaar),
                        getString(R.string.doc_bank_passbook),
                        getString(R.string.doc_income),
                        getString(R.string.doc_residence)
                })
        );

        findViewById(R.id.card_beneficiary).setOnClickListener(v ->
                openDetail(getString(R.string.beneficiary_lists), new String[]{
                        getString(R.string.pmay_beneficiary)
                })
        );

        findViewById(R.id.card_apply_process).setOnClickListener(v ->
                openDetail(getString(R.string.apply_process), new String[]{
                        getString(R.string.pmay_apply_guide)
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
