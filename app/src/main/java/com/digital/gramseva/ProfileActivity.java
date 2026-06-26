package com.digital.gramseva;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class ProfileActivity extends BaseActivity {

    private LinearLayout logoutConfirmation;
    private ImageView ivCheckHindi, ivCheckEnglish;
    private ImageView ivCheckNotifEnable, ivCheckNotifDisable;
    private TextView tvUserName, tvUserVillage, tvNameValue, tvMobileValue, tvEmailValue, tvVillageValue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        tvUserName = findViewById(R.id.tv_user_name);
        tvUserVillage = findViewById(R.id.tv_user_village);
        tvNameValue = findViewById(R.id.tv_name_value);
        tvMobileValue = findViewById(R.id.tv_mobile_value);
        tvEmailValue = findViewById(R.id.tv_email_value);
        tvVillageValue = findViewById(R.id.tv_village_value);

        ivCheckHindi = findViewById(R.id.iv_check_hindi);
        ivCheckEnglish = findViewById(R.id.iv_check_english);
        ivCheckNotifEnable = findViewById(R.id.iv_check_notif_enable);
        ivCheckNotifDisable = findViewById(R.id.iv_check_notif_disable);
        logoutConfirmation = findViewById(R.id.logout_confirmation);

        loadUserData();

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
        });

        findViewById(R.id.btn_menu).setOnClickListener(v -> {
            startActivity(new Intent(this, MenuActivity.class));
            overridePendingTransition(0, 0);
        });
        findViewById(R.id.btn_notifications).setOnClickListener(v -> {
            Toast.makeText(this, getString(R.string.notifications_coming_soon), Toast.LENGTH_SHORT).show();
        });

        findViewById(R.id.btn_edit_profile).setOnClickListener(v -> {
            startActivity(new Intent(this, RegisterActivity.class));
        });

        findViewById(R.id.item_name).setOnClickListener(v -> {
            startActivity(new Intent(this, RegisterActivity.class));
        });
        findViewById(R.id.item_mobile).setOnClickListener(v -> {
            startActivity(new Intent(this, RegisterActivity.class));
        });
        findViewById(R.id.item_email).setOnClickListener(v -> {
            startActivity(new Intent(this, RegisterActivity.class));
        });
        findViewById(R.id.item_village).setOnClickListener(v -> {
            startActivity(new Intent(this, RegisterActivity.class));
        });

        findViewById(R.id.item_education_schemes).setOnClickListener(v -> {
            startActivity(new Intent(this, EducationActivity.class));
        });
        findViewById(R.id.item_health_schemes).setOnClickListener(v -> {
            startActivity(new Intent(this, HealthCardActivity.class));
        });
        findViewById(R.id.item_agriculture_schemes).setOnClickListener(v -> {
            startActivity(new Intent(this, AgricultureActivity.class));
        });
        findViewById(R.id.item_housing_schemes).setOnClickListener(v -> {
            startActivity(new Intent(this, HousingActivity.class));
        });

        findViewById(R.id.item_language_hindi).setOnClickListener(v -> {
            setLanguage("hindi");
        });
        findViewById(R.id.item_language_english).setOnClickListener(v -> {
            setLanguage("english");
        });

        findViewById(R.id.item_notifications_enable).setOnClickListener(v -> {
            setNotification(true);
        });
        findViewById(R.id.item_notifications_disable).setOnClickListener(v -> {
            setNotification(false);
        });

        findViewById(R.id.item_logout).setOnClickListener(v -> {
            boolean isVisible = logoutConfirmation.getVisibility() == LinearLayout.VISIBLE;
            logoutConfirmation.setVisibility(isVisible ? LinearLayout.GONE : LinearLayout.VISIBLE);
        });

        findViewById(R.id.btn_logout_yes).setOnClickListener(v -> {
            Toast.makeText(this, getString(R.string.logging_out), Toast.LENGTH_SHORT).show();
            UserPreferences prefs = new UserPreferences(this);
            prefs.logout();
            Intent intent = new Intent(this, LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            finish();
        });

        findViewById(R.id.btn_logout_no).setOnClickListener(v -> {
            logoutConfirmation.setVisibility(LinearLayout.GONE);
        });
    }

    private void setLanguage(String lang) {
        UserPreferences prefs = new UserPreferences(this);
        prefs.setLanguage(lang);
        Intent intent = new Intent(this, SchemesActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
        finish();
    }

    private void loadUserData() {
        UserPreferences prefs = new UserPreferences(this);
        String name = prefs.getName();
        String mobile = prefs.getMobile();
        String email = prefs.getEmail();
        String village = prefs.getVillage();
        String district = prefs.getDistrict();

        if (!name.isEmpty()) {
            tvUserName.setText(name);
            tvNameValue.setText(name);
        } else {
            tvUserName.setText(getString(R.string.complete_profile));
        }
        if (!mobile.isEmpty()) {
            tvMobileValue.setText(mobile);
        } else {
            tvMobileValue.setText(getString(R.string.not_set));
        }
        if (!email.isEmpty()) {
            tvEmailValue.setText(email);
        } else {
            tvEmailValue.setText(getString(R.string.not_set));
        }
        String villageDisplay = village;
        if (!district.isEmpty()) {
            villageDisplay = village.isEmpty() ? district : village + ", " + district;
        }
        if (!villageDisplay.isEmpty()) {
            tvUserVillage.setText(getString(R.string.village_format, villageDisplay));
            tvVillageValue.setText(villageDisplay);
        } else {
            tvUserVillage.setText(getString(R.string.village_not_set));
            tvVillageValue.setText(getString(R.string.not_set));
        }

        String currentLang = prefs.getLanguage();
        if (currentLang.equals("hindi")) {
            ivCheckHindi.setVisibility(LinearLayout.VISIBLE);
            ivCheckHindi.setColorFilter(getColor(R.color.primary));
            ivCheckEnglish.setVisibility(LinearLayout.GONE);
        } else {
            ivCheckEnglish.setVisibility(LinearLayout.VISIBLE);
            ivCheckEnglish.setColorFilter(getColor(R.color.primary));
            ivCheckHindi.setVisibility(LinearLayout.GONE);
        }
    }

    private void setNotification(boolean enable) {
        if (enable) {
            ivCheckNotifEnable.setVisibility(LinearLayout.VISIBLE);
            ivCheckNotifEnable.setColorFilter(getColor(R.color.primary));
            ivCheckNotifDisable.setVisibility(LinearLayout.GONE);
            Toast.makeText(this, getString(R.string.notif_enabled), Toast.LENGTH_SHORT).show();
        } else {
            ivCheckNotifDisable.setVisibility(LinearLayout.VISIBLE);
            ivCheckNotifDisable.setColorFilter(getColor(R.color.error));
            ivCheckNotifEnable.setVisibility(LinearLayout.GONE);
            Toast.makeText(this, getString(R.string.notif_disabled), Toast.LENGTH_SHORT).show();
        }
    }
}
