package com.digital.gramseva;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

public class EducationActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_education);

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
        findViewById(R.id.nav_emergency).setOnClickListener(v -> {
            startActivity(new Intent(this, EmergencyServicesActivity.class));
            overridePendingTransition(0, 0);
        });
        findViewById(R.id.nav_profile).setOnClickListener(v -> {
            startActivity(new Intent(this, ProfileActivity.class));
            overridePendingTransition(0, 0);
        });

        findViewById(R.id.card_scholarships).setOnClickListener(v ->
                startActivity(new Intent(this, ScholarshipActivity.class))
        );

        findViewById(R.id.card_courses).setOnClickListener(v ->
                startActivity(new Intent(this, CoursesActivity.class))
        );

        findViewById(R.id.card_exams).setOnClickListener(v ->
                startActivity(new Intent(this, GovtExamsActivity.class))
        );

        findViewById(R.id.card_career).setOnClickListener(v ->
                startActivity(new Intent(this, CareerGuidanceActivity.class))
        );
    }

    private void openDetail(String title, String[] items) {
        Intent intent = new Intent(this, AgricultureDetailActivity.class);
        intent.putExtra("title", title);
        intent.putExtra("items", items);
        startActivity(intent);
    }
}
