package com.digital.gramseva;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Switch;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;

public class MenuActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);

        findViewById(R.id.btn_close_menu).setOnClickListener(v -> finish());

        findViewById(R.id.menu_home).setOnClickListener(v -> {
            startActivity(new Intent(this, SchemesActivity.class));
            overridePendingTransition(0, 0);
            finish();
        });

        findViewById(R.id.menu_profile).setOnClickListener(v -> {
            startActivity(new Intent(this, ProfileActivity.class));
            overridePendingTransition(0, 0);
            finish();
        });

        findViewById(R.id.menu_notifications).setOnClickListener(v -> {
            showNotificationDialog();
        });

        findViewById(R.id.menu_saved_schemes).setOnClickListener(v -> {
            startActivity(new Intent(this, SchemesActivity.class));
            overridePendingTransition(0, 0);
            finish();
        });

        findViewById(R.id.menu_complaints).setOnClickListener(v -> {
            startActivity(new Intent(this, ComplaintsActivity.class));
            overridePendingTransition(0, 0);
            finish();
        });
        findViewById(R.id.menu_emergency).setOnClickListener(v -> {
            startActivity(new Intent(this, EmergencyServicesActivity.class));
            overridePendingTransition(0, 0);
            finish();
        });

        findViewById(R.id.menu_language).setOnClickListener(v -> {
            String[] languages = {"Hindi", "English"};
            int checked = new UserPreferences(this).getLanguage().equals("hindi") ? 0 : 1;
                    new androidx.appcompat.app.AlertDialog.Builder(this)
                            .setTitle(getString(R.string.select_language))
                            .setSingleChoiceItems(languages, checked, (dialog, which) -> {
                                String lang = which == 0 ? "hindi" : "english";
                                new UserPreferences(this).setLanguage(lang);
                                dialog.dismiss();
                                Intent intent = new Intent(this, SchemesActivity.class);
                                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                                startActivity(intent);
                                finish();
                            })
                            .show();
        });

        findViewById(R.id.menu_about).setOnClickListener(v -> {
            startActivity(new Intent(this, AboutActivity.class));
            overridePendingTransition(0, 0);
            finish();
        });

        findViewById(R.id.menu_privacy).setOnClickListener(v -> {
            startActivity(new Intent(this, PrivacyPolicyActivity.class));
            overridePendingTransition(0, 0);
            finish();
        });

        findViewById(R.id.menu_logout).setOnClickListener(v -> {
            UserPreferences prefs = new UserPreferences(this);
            prefs.logout();
            Intent intent = new Intent(this, LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            finish();
        });
    }

    private void showNotificationDialog() {
        UserPreferences prefs = new UserPreferences(this);
        boolean current = prefs.isNotificationsEnabled();

        Switch switchView = new Switch(this);
        switchView.setChecked(current);
        switchView.setText(current ? getString(R.string.notif_enabled) : getString(R.string.notif_disabled));
        switchView.setPadding(48, 24, 48, 24);
        switchView.setOnCheckedChangeListener((buttonView, isChecked) -> {
            prefs.setNotificationsEnabled(isChecked);
            switchView.setText(isChecked ? getString(R.string.notif_enabled) : getString(R.string.notif_disabled));
            Toast.makeText(this, isChecked ? getString(R.string.notif_enabled) : getString(R.string.notif_disabled), Toast.LENGTH_SHORT).show();
        });

        new AlertDialog.Builder(this)
                .setTitle(getString(R.string.notifications))
                .setView(switchView)
                .setPositiveButton(getString(R.string.ok), null)
                .show();
    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(0, 0);
    }
}
