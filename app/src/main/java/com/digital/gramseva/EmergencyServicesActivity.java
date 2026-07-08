package com.digital.gramseva;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Toast;

public class EmergencyServicesActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_emergency_services);

        findViewById(R.id.nav_home).setOnClickListener(v -> {
            startActivity(new Intent(this, SchemesActivity.class));
            overridePendingTransition(0, 0);
        });
        findViewById(R.id.nav_complaints).setOnClickListener(v -> {
            startActivity(new Intent(this, ComplaintsActivity.class));
            overridePendingTransition(0, 0);
        });
        findViewById(R.id.nav_emergency).setOnClickListener(v -> {
        });
        findViewById(R.id.nav_profile).setOnClickListener(v -> {
            startActivity(new Intent(this, ProfileActivity.class));
            overridePendingTransition(0, 0);
        });

        findViewById(R.id.btn_back).setOnClickListener(v -> finish());

        findViewById(R.id.btn_more).setOnClickListener(v ->
                Toast.makeText(this, getString(R.string.more_options), Toast.LENGTH_SHORT).show()
        );

        // Existing emergency services
        findViewById(R.id.btn_call_ambulance).setOnClickListener(v -> dialNumber("108"));
        findViewById(R.id.btn_call_police).setOnClickListener(v -> dialNumber("112"));
        findViewById(R.id.btn_call_women).setOnClickListener(v -> dialNumber("1091"));

        findViewById(R.id.card_ambulance).setOnClickListener(v -> dialNumber("108"));
        findViewById(R.id.card_police).setOnClickListener(v -> dialNumber("112"));
        findViewById(R.id.card_women_helpline).setOnClickListener(v -> dialNumber("1091"));

        // New helplines
        findViewById(R.id.btn_call_fire).setOnClickListener(v -> dialNumber("101"));
        findViewById(R.id.card_fire).setOnClickListener(v -> dialNumber("101"));

        findViewById(R.id.btn_call_child).setOnClickListener(v -> dialNumber("1098"));
        findViewById(R.id.card_child).setOnClickListener(v -> dialNumber("1098"));

        findViewById(R.id.btn_call_health).setOnClickListener(v -> dialNumber("104"));
        findViewById(R.id.card_health_helpline).setOnClickListener(v -> dialNumber("104"));

        findViewById(R.id.btn_call_kisan).setOnClickListener(v -> dialNumber("18001801551"));
        findViewById(R.id.card_kisan).setOnClickListener(v -> dialNumber("18001801551"));

        findViewById(R.id.btn_call_railway).setOnClickListener(v -> dialNumber("139"));
        findViewById(R.id.card_railway).setOnClickListener(v -> dialNumber("139"));

        findViewById(R.id.btn_call_cyber).setOnClickListener(v -> dialNumber("1930"));
        findViewById(R.id.card_cyber).setOnClickListener(v -> dialNumber("1930"));

        // Nearby services - open maps
        findViewById(R.id.card_nearby_hospital).setOnClickListener(v ->
                openMapSearch("hospitals+near+me")
        );

        findViewById(R.id.card_nearby_police).setOnClickListener(v ->
                openMapSearch("police+stations+near+me")
        );

        // SMS and share
        findViewById(R.id.btn_sms).setOnClickListener(v -> {
            Intent smsIntent = new Intent(Intent.ACTION_SENDTO);
            smsIntent.setData(Uri.parse("smsto:112"));
            smsIntent.putExtra("sms_body", getString(R.string.emergency_sms_body));
            startActivity(smsIntent);
        });

        findViewById(R.id.btn_share_loc).setOnClickListener(v -> {
            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("text/plain");
            shareIntent.putExtra(Intent.EXTRA_TEXT, getString(R.string.share_location_text));
            startActivity(Intent.createChooser(shareIntent, getString(R.string.share_location_chooser)));
        });
    }

    private void dialNumber(String number) {
        Intent dialIntent = new Intent(Intent.ACTION_DIAL);
        dialIntent.setData(Uri.parse("tel:" + number));
        startActivity(dialIntent);
    }

    private void openMapSearch(String query) {
        Uri gmmIntentUri = Uri.parse("geo:0,0?q=" + query);
        Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
        mapIntent.setPackage("com.google.android.apps.maps");
        if (mapIntent.resolveActivity(getPackageManager()) != null) {
            startActivity(mapIntent);
        } else {
            mapIntent.setPackage(null);
            startActivity(mapIntent);
        }
    }
}
