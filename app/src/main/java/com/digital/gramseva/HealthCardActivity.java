package com.digital.gramseva;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.util.Random;

public class HealthCardActivity extends BaseActivity {

    private EditText inputName, inputDob, inputAadhaar, inputAddress;
    private LinearLayout formSection, cardSection, liveStatus;
    private TextView tvStatus, tvCardNumber, tvName, tvGender, tvDob, tvAddress, tvValidity;
    private TextView btnGenderMale, btnGenderFemale;
    private Button btnActivate, btnDeactivate;

    private String selectedGender = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_health_card);

        inputName = findViewById(R.id.input_name);
        inputDob = findViewById(R.id.input_dob);
        inputAadhaar = findViewById(R.id.input_aadhaar);
        inputAddress = findViewById(R.id.input_address);
        formSection = findViewById(R.id.form_section);
        cardSection = findViewById(R.id.card_section);
        liveStatus = findViewById(R.id.live_status);
        tvStatus = findViewById(R.id.tv_status);
        tvCardNumber = findViewById(R.id.tv_card_number);
        tvName = findViewById(R.id.tv_name);
        tvGender = findViewById(R.id.tv_gender);
        tvDob = findViewById(R.id.tv_dob);
        tvAddress = findViewById(R.id.tv_address);
        tvValidity = findViewById(R.id.tv_validity);
        btnGenderMale = findViewById(R.id.btn_gender_male);
        btnGenderFemale = findViewById(R.id.btn_gender_female);
        btnActivate = findViewById(R.id.btn_activate);
        btnDeactivate = findViewById(R.id.btn_deactivate);

        findViewById(R.id.btn_back).setOnClickListener(v -> finish());

        findViewById(R.id.btn_notifications).setOnClickListener(v ->
                Toast.makeText(this, getString(R.string.no_notifications), Toast.LENGTH_SHORT).show()
        );

        btnGenderMale.setOnClickListener(v -> selectGender("Male"));
        btnGenderFemale.setOnClickListener(v -> selectGender("Female"));

        btnActivate.setOnClickListener(v -> activateCard());
        btnDeactivate.setOnClickListener(v -> deactivateCard());

        findViewById(R.id.nav_home).setOnClickListener(v -> {
            startActivity(new Intent(this, SchemesActivity.class));
            finish();
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
    }

    private void selectGender(String gender) {
        selectedGender = gender;
        btnGenderMale.setBackgroundResource(
                gender.equals("Male") ? R.drawable.bg_primary_button : R.drawable.bg_outline_button
        );
        btnGenderMale.setTextColor(
                gender.equals("Male") ? getColor(R.color.on_primary) : getColor(R.color.primary)
        );
        btnGenderFemale.setBackgroundResource(
                gender.equals("Female") ? R.drawable.bg_primary_button : R.drawable.bg_outline_button
        );
        btnGenderFemale.setTextColor(
                gender.equals("Female") ? getColor(R.color.on_primary) : getColor(R.color.primary)
        );
    }

    private void activateCard() {
        String name = inputName.getText().toString().trim();
        String dob = inputDob.getText().toString().trim();
        String aadhaar = inputAadhaar.getText().toString().trim();
        String address = inputAddress.getText().toString().trim();

        if (TextUtils.isEmpty(name)) {
            inputName.setError(getString(R.string.name_required));
            inputName.requestFocus();
            return;
        }
        if (TextUtils.isEmpty(selectedGender)) {
            Toast.makeText(this, getString(R.string.select_gender), Toast.LENGTH_SHORT).show();
            return;
        }
        if (TextUtils.isEmpty(dob)) {
            inputDob.setError(getString(R.string.dob_required));
            inputDob.requestFocus();
            return;
        }
        if (TextUtils.isEmpty(aadhaar) || aadhaar.length() < 12) {
            inputAadhaar.setError(getString(R.string.aadhaar_required));
            inputAadhaar.requestFocus();
            return;
        }
        if (TextUtils.isEmpty(address)) {
            inputAddress.setError(getString(R.string.address_required));
            inputAddress.requestFocus();
            return;
        }

        String cardNumber = "ABHA-" + aadhaar.substring(0, 4) + "-"
                + aadhaar.substring(4, 8) + "-" + aadhaar.substring(8, 12);
        String validity = "31-12-" + (2028 + new Random().nextInt(3));

        tvCardNumber.setText(cardNumber);
        tvName.setText(name);
        tvGender.setText(selectedGender);
        tvDob.setText(dob);
        tvAddress.setText(address);
        tvValidity.setText(validity);

        tvStatus.setText(getString(R.string.status_live_active));
        tvStatus.setTextColor(getColor(R.color.primary));
        liveStatus.setBackgroundTintList(
                android.content.res.ColorStateList.valueOf(getColor(R.color.on_primary_container))
        );

        formSection.setVisibility(View.GONE);
        cardSection.setVisibility(View.VISIBLE);

        Toast.makeText(this, getString(R.string.card_activated), Toast.LENGTH_LONG).show();
    }

    private void deactivateCard() {
        formSection.setVisibility(View.VISIBLE);
        cardSection.setVisibility(View.GONE);

        selectedGender = "";
        btnGenderMale.setBackgroundResource(R.drawable.bg_outline_button);
        btnGenderMale.setTextColor(getColor(R.color.primary));
        btnGenderFemale.setBackgroundResource(R.drawable.bg_outline_button);
        btnGenderFemale.setTextColor(getColor(R.color.primary));

        tvStatus.setText(getString(R.string.not_activated));
        tvStatus.setTextColor(getColor(R.color.on_error_container));
        liveStatus.setBackgroundTintList(
                android.content.res.ColorStateList.valueOf(getColor(R.color.error_container))
        );

        Toast.makeText(this, getString(R.string.card_deactivated), Toast.LENGTH_SHORT).show();
    }
}
