package com.digital.gramseva;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

public class LoginActivity extends AppCompatActivity {

    // TODO: Replace with your Google Web Client ID from Google Cloud Console
    private static final String GOOGLE_CLIENT_ID = "YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com";

    private EditText inputEmail, inputPassword;
    private GoogleSignInClient googleSignInClient;
    private SupabaseClient supabaseClient;

    private final ActivityResultLauncher<Intent> googleSignInLauncher =
            registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
                Intent data = result.getData();
                if (data != null) {
                    Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
                    try {
                        GoogleSignInAccount account = task.getResult(ApiException.class);
                        handleGoogleSignInResult(account);
                    } catch (ApiException e) {
                        Toast.makeText(this, "Google Sign-In failed: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                }
            });

    @Override
    protected void attachBaseContext(Context newBase) {
        Context context = LocaleHelper.setLocale(newBase, "english");
        super.attachBaseContext(context);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        supabaseClient = new SupabaseClient();

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(GOOGLE_CLIENT_ID)
                .requestEmail()
                .build();
        googleSignInClient = GoogleSignIn.getClient(this, gso);

        inputEmail = findViewById(R.id.input_email);
        inputPassword = findViewById(R.id.input_password);
        Button btnSignIn = findViewById(R.id.btn_signin);
        Button btnGoogleSignIn = findViewById(R.id.btn_google_signin);

        btnSignIn.setOnClickListener(v -> attemptLogin());

        btnGoogleSignIn.setOnClickListener(v -> {
            Intent signInIntent = googleSignInClient.getSignInIntent();
            googleSignInLauncher.launch(signInIntent);
        });

        findViewById(R.id.btn_create_account).setOnClickListener(v -> {
            startActivity(new Intent(this, RegisterActivity.class));
        });
    }

    private void handleGoogleSignInResult(GoogleSignInAccount account) {
        String idToken = account.getIdToken();
        if (idToken == null) {
            Toast.makeText(this, "Failed to get ID token", Toast.LENGTH_SHORT).show();
            return;
        }

        Toast.makeText(this, "Signing in with Google...", Toast.LENGTH_SHORT).show();

        supabaseClient.signInWithGoogleIdToken(idToken, new SupabaseClient.AuthCallback() {
            @Override
            public void onSuccess(String accessToken, String refreshToken, String email, String name) {
                UserPreferences prefs = new UserPreferences(LoginActivity.this);
                String fullName = account.getDisplayName() != null ? account.getDisplayName() : name;
                prefs.saveUser(fullName, "", email != null ? email : "", "", "", "");
                prefs.setSupabaseSession(accessToken, refreshToken);

                Toast.makeText(LoginActivity.this, "Welcome, " + fullName + "!", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(LoginActivity.this, SchemesActivity.class));
                finish();
            }

            @Override
            public void onError(String error) {
                Toast.makeText(LoginActivity.this, error, Toast.LENGTH_LONG).show();
            }
        });
    }

    private void attemptLogin() {
        String email = inputEmail.getText().toString().trim();
        String password = inputPassword.getText().toString().trim();

        if (TextUtils.isEmpty(email)) {
            inputEmail.setError(getString(R.string.email_required));
            inputEmail.requestFocus();
            return;
        }

        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            inputEmail.setError(getString(R.string.enter_valid_email));
            inputEmail.requestFocus();
            return;
        }

        if (TextUtils.isEmpty(password)) {
            inputPassword.setError(getString(R.string.password_required));
            inputPassword.requestFocus();
            return;
        }

        if (password.length() < 6) {
            inputPassword.setError(getString(R.string.password_min_length));
            inputPassword.requestFocus();
            return;
        }

        UserPreferences prefs = new UserPreferences(this);
        String savedEmail = prefs.getEmail();
        String savedPassword = prefs.getPassword();

        if (savedEmail.equals(email) && !TextUtils.isEmpty(savedPassword)) {
            if (savedPassword.equals(password)) {
                startActivity(new Intent(LoginActivity.this, SchemesActivity.class));
                finish();
            } else {
                Toast.makeText(this, R.string.invalid_credentials, Toast.LENGTH_SHORT).show();
            }
        } else {
            prefs.saveUser("", "", email, password, "", "");
            Toast.makeText(this, R.string.account_created, Toast.LENGTH_SHORT).show();
            startActivity(new Intent(LoginActivity.this, SchemesActivity.class));
            finish();
        }
    }
}
