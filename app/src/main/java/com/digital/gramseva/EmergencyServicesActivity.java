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

        findViewById(R.id.btn_back).setOnClickListener(v -> finish());

        findViewById(R.id.btn_more).setOnClickListener(v ->
                Toast.makeText(this, getString(R.string.more_options), Toast.LENGTH_SHORT).show()
        );

        findViewById(R.id.btn_call_ambulance).setOnClickListener(v ->
                dialNumber("108")
        );

        findViewById(R.id.btn_call_police).setOnClickListener(v ->
                dialNumber("112")
        );

        findViewById(R.id.btn_call_women).setOnClickListener(v ->
                dialNumber("1091")
        );

        findViewById(R.id.card_ambulance).setOnClickListener(v ->
                dialNumber("108")
        );

        findViewById(R.id.card_police).setOnClickListener(v ->
                dialNumber("112")
        );

        findViewById(R.id.card_women_helpline).setOnClickListener(v ->
                dialNumber("1091")
        );

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
}
