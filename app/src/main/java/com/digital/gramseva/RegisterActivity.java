package com.digital.gramseva;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class RegisterActivity extends BaseActivity {

    private EditText inputName, inputMobile, inputEmail, inputPassword, inputVillage, inputDistrict;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        inputName = findViewById(R.id.input_name);
        inputMobile = findViewById(R.id.input_mobile);
        inputEmail = findViewById(R.id.input_email);
        inputPassword = findViewById(R.id.input_password);
        inputVillage = findViewById(R.id.input_village);
        inputDistrict = findViewById(R.id.input_district);

        UserPreferences prefs = new UserPreferences(this);
        boolean isEditing = prefs.isLoggedIn();

        if (isEditing) {
            inputName.setText(prefs.getName());
            inputMobile.setText(prefs.getMobile());
            inputEmail.setText(prefs.getEmail());
            inputVillage.setText(prefs.getVillage());
            inputDistrict.setText(prefs.getDistrict());
            ((Button) findViewById(R.id.btn_register)).setText(getString(R.string.save_profile));
            ((Button) findViewById(R.id.btn_back_to_login)).setText(getString(R.string.back_to_profile));
        }

        findViewById(R.id.btn_register).setOnClickListener(v -> attemptRegister());
        findViewById(R.id.btn_back_to_login).setOnClickListener(v -> {
            if (isEditing) {
                finish();
            } else {
                startActivity(new Intent(this, LoginActivity.class));
                finish();
            }
        });
    }

    private void attemptRegister() {
        String name = inputName.getText().toString().trim();
        String mobile = inputMobile.getText().toString().trim();
        String email = inputEmail.getText().toString().trim();
        String village = inputVillage.getText().toString().trim();
        String district = inputDistrict.getText().toString().trim();

        if (TextUtils.isEmpty(name)) {
            inputName.setError(getString(R.string.name_required));
            inputName.requestFocus();
            return;
        }
        if (TextUtils.isEmpty(mobile)) {
            inputMobile.setError(getString(R.string.mobile_required));
            inputMobile.requestFocus();
            return;
        }
        if (TextUtils.isEmpty(email)) {
            inputEmail.setError(getString(R.string.email_required));
            inputEmail.requestFocus();
            return;
        }
        if (TextUtils.isEmpty(village)) {
            inputVillage.setError(getString(R.string.village_required));
            inputVillage.requestFocus();
            return;
        }
        if (TextUtils.isEmpty(district)) {
            inputDistrict.setError(getString(R.string.district_required));
            inputDistrict.requestFocus();
            return;
        }

        UserPreferences prefs = new UserPreferences(this);
        boolean isEditing = prefs.isLoggedIn();

        String password = inputPassword.getText().toString().trim();
        if (TextUtils.isEmpty(password)) {
            if (isEditing) {
                password = prefs.getPassword();
            } else {
                inputPassword.setError(getString(R.string.password_required_register));
                inputPassword.requestFocus();
                return;
            }
        }

        if (password.length() < 6) {
            inputPassword.setError(getString(R.string.password_min_length));
            inputPassword.requestFocus();
            return;
        }

        prefs.saveUser(name, mobile, email, password, village, district);

        Toast.makeText(this, isEditing ? getString(R.string.profile_saved) : getString(R.string.account_created), Toast.LENGTH_SHORT).show();
        if (isEditing) {
            finish();
        } else {
            startActivity(new Intent(this, SchemesActivity.class));
            finish();
        }
    }
}
