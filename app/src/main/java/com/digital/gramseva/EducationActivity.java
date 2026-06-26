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
        findViewById(R.id.nav_services).setOnClickListener(v -> {
            startActivity(new Intent(this, JobAlertsActivity.class));
            overridePendingTransition(0, 0);
        });
        findViewById(R.id.nav_profile).setOnClickListener(v -> {
            startActivity(new Intent(this, ProfileActivity.class));
            overridePendingTransition(0, 0);
        });

        findViewById(R.id.card_scholarships).setOnClickListener(v ->
                openDetail(getString(R.string.education_scholarships), new String[]{
                        getString(R.string.scholarship_up),
                        getString(R.string.scholarship_national),
                        getString(R.string.scholarship_post_matric)
                })
        );

        findViewById(R.id.card_courses).setOnClickListener(v ->
                openDetail(getString(R.string.courses), new String[]{
                        getString(R.string.course_computer),
                        getString(R.string.course_dm),
                        getString(R.string.course_english)
                })
        );

        findViewById(R.id.card_exams).setOnClickListener(v ->
                openDetail(getString(R.string.govt_exams), new String[]{
                        getString(R.string.exam_pet),
                        getString(R.string.exam_ssc),
                        getString(R.string.exam_railway),
                        getString(R.string.exam_police)
                })
        );

        findViewById(R.id.card_study_material).setOnClickListener(v ->
                openDetail(getString(R.string.study_material), new String[]{
                        getString(R.string.study_notes),
                        getString(R.string.study_syllabus),
                        getString(R.string.study_previous_papers),
                        getString(R.string.study_pdf_books)
                })
        );

        findViewById(R.id.card_career).setOnClickListener(v ->
                openDetail(getString(R.string.career_guidance), new String[]{
                        getString(R.string.career_after_10th),
                        getString(R.string.career_after_12th),
                        getString(R.string.career_graduation)
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
