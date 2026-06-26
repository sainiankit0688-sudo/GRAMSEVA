package com.digital.gramseva;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.location.Address;
import android.location.Criteria;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.view.Gravity;
import android.view.View;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class ComplaintsActivity extends BaseActivity {

    private EditText inputDescription, inputOtherCategory;
    private LinearLayout complaintsContainer;
    private UserPreferences prefs;
    private String selectedCategory = "";
    private String photoUri = "";
    private View selectedCategoryView = null;

    private ImageView ivPhotoPreview;
    private FrameLayout photoPreviewContainer;
    private View uploadArea;
    private ImageView ivCameraIcon;
    private TextView tvUploadText;

    private TextView tvLocation, btnGetLocation;
    private String currentLat = "", currentLng = "";

    private static final int REQUEST_CAMERA = 1001;
    private static final int REQUEST_GALLERY = 1002;
    private static final int REQUEST_LOCATION_PERM = 1003;
    private static final int REQUEST_CAMERA_PERM = 1004;

    private String currentPhotoPath = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_complaints);

        prefs = new UserPreferences(this);
        inputDescription = findViewById(R.id.input_description);
        complaintsContainer = findViewById(R.id.complaints_list_container);

        inputOtherCategory = findViewById(R.id.input_other_category);
        uploadArea = findViewById(R.id.upload_area);
        ivCameraIcon = findViewById(R.id.iv_camera_icon);
        tvUploadText = findViewById(R.id.tv_upload_text);
        ivPhotoPreview = findViewById(R.id.iv_photo_preview);
        photoPreviewContainer = findViewById(R.id.photo_preview_container);
        tvLocation = findViewById(R.id.tv_location);
        btnGetLocation = findViewById(R.id.btn_get_location);

        findViewById(R.id.nav_home).setOnClickListener(v -> {
            startActivity(new Intent(this, SchemesActivity.class));
            overridePendingTransition(0, 0);
        });
        findViewById(R.id.nav_complaints).setOnClickListener(v -> { });
        findViewById(R.id.nav_services).setOnClickListener(v -> {
            startActivity(new Intent(this, JobAlertsActivity.class));
            overridePendingTransition(0, 0);
        });
        findViewById(R.id.nav_profile).setOnClickListener(v -> {
            startActivity(new Intent(this, ProfileActivity.class));
            overridePendingTransition(0, 0);
        });

        findViewById(R.id.btn_menu).setOnClickListener(v -> {
            startActivity(new Intent(this, MenuActivity.class));
            overridePendingTransition(0, 0);
        });
        findViewById(R.id.btn_notifications).setOnClickListener(v -> {
            Toast.makeText(this, getString(R.string.notifications_coming_soon), Toast.LENGTH_SHORT).show();
        });

        findViewById(R.id.category_road).setOnClickListener(v -> selectCategory(v, "road"));
        findViewById(R.id.category_water).setOnClickListener(v -> selectCategory(v, "water"));
        findViewById(R.id.category_electricity).setOnClickListener(v -> selectCategory(v, "electricity"));
        findViewById(R.id.category_other).setOnClickListener(v -> selectCategory(v, "other"));

        uploadArea.setOnClickListener(v -> showPhotoOptions());
        findViewById(R.id.btn_remove_photo).setOnClickListener(v -> removePhoto());
        btnGetLocation.setOnClickListener(v -> fetchLocation());

        findViewById(R.id.btn_submit_complaint).setOnClickListener(v -> submitComplaint());

        loadComplaints();
    }

    private void selectCategory(View view, String category) {
        if (selectedCategoryView != null) {
            selectedCategoryView.setBackgroundResource(R.drawable.bg_input);
        }
        view.setBackgroundResource(R.drawable.bg_selected);
        selectedCategoryView = view;
        selectedCategory = category;

        if (category.equals("other")) {
            inputOtherCategory.setVisibility(View.VISIBLE);
            inputOtherCategory.requestFocus();
        } else {
            inputOtherCategory.setVisibility(View.GONE);
            inputOtherCategory.setText("");
        }
    }

    private void showPhotoOptions() {
        String[] options = {getString(R.string.take_photo), getString(R.string.choose_from_gallery)};
        new androidx.appcompat.app.AlertDialog.Builder(this)
                .setTitle(getString(R.string.attach_photo))
                .setItems(options, (dialog, which) -> {
                    if (which == 0) {
                        openCamera();
                    } else {
                        openGallery();
                    }
                })
                .show();
    }

    private void openCamera() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.CAMERA}, REQUEST_CAMERA_PERM);
                return;
            }
        }
        dispatchCameraIntent();
    }

    private void dispatchCameraIntent() {
        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (intent.resolveActivity(getPackageManager()) != null) {
            File photoFile = null;
            try {
                photoFile = createImageFile();
            } catch (IOException e) {
                Toast.makeText(this, getString(R.string.photo_error), Toast.LENGTH_SHORT).show();
                return;
            }
            if (photoFile != null) {
                Uri photoURI = FileProvider.getUriForFile(this, "com.digital.gramseva.fileprovider", photoFile);
                intent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);
                startActivityForResult(intent, REQUEST_CAMERA);
            }
        }
    }

    private File createImageFile() throws IOException {
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
        String imageFileName = "CMP_" + timeStamp;
        File storageDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        File image = File.createTempFile(imageFileName, ".jpg", storageDir);
        currentPhotoPath = image.getAbsolutePath();
        return image;
    }

    private void openGallery() {
        if (Build.VERSION.SDK_INT >= 33) {
            if (checkSelfPermission(Manifest.permission.READ_MEDIA_IMAGES) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.READ_MEDIA_IMAGES}, REQUEST_GALLERY);
                return;
            }
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, REQUEST_GALLERY);
                return;
            }
        }
        dispatchGalleryIntent();
    }

    private void dispatchGalleryIntent() {
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        intent.setType("image/*");
        startActivityForResult(intent, REQUEST_GALLERY);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            if (requestCode == REQUEST_CAMERA_PERM) {
                dispatchCameraIntent();
            } else if (requestCode == REQUEST_GALLERY) {
                dispatchGalleryIntent();
            } else if (requestCode == REQUEST_LOCATION_PERM) {
                fetchLocation();
            }
        } else {
            Toast.makeText(this, getString(R.string.permission_denied), Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK) {
            if (requestCode == REQUEST_CAMERA) {
                if (currentPhotoPath != null && !currentPhotoPath.isEmpty()) {
                    photoUri = currentPhotoPath;
                    showPhotoPreview(Uri.fromFile(new File(currentPhotoPath)));
                }
            } else if (requestCode == REQUEST_GALLERY && data != null) {
                Uri uri = data.getData();
                if (uri != null) {
                    photoUri = uri.toString();
                    showPhotoPreview(uri);
                }
            }
        }
    }

    private void showPhotoPreview(Uri uri) {
        uploadArea.setVisibility(View.GONE);
        photoPreviewContainer.setVisibility(View.VISIBLE);
        ivPhotoPreview.setImageURI(uri);
    }

    private void removePhoto() {
        photoUri = "";
        currentPhotoPath = "";
        photoPreviewContainer.setVisibility(View.GONE);
        uploadArea.setVisibility(View.VISIBLE);
        if (currentPhotoPath != null && !currentPhotoPath.isEmpty()) {
            new File(currentPhotoPath).delete();
        }
    }

    private void fetchLocation() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, REQUEST_LOCATION_PERM);
                return;
            }
        }
        Toast.makeText(this, getString(R.string.getting_location), Toast.LENGTH_SHORT).show();
        LocationManager lm = (LocationManager) getSystemService(LOCATION_SERVICE);
        try {
            Criteria criteria = new Criteria();
            criteria.setAccuracy(Criteria.ACCURACY_FINE);
            String provider = lm.getBestProvider(criteria, true);
            if (provider == null) {
                criteria.setAccuracy(Criteria.ACCURACY_COARSE);
                provider = lm.getBestProvider(criteria, true);
            }
            if (provider == null) {
                Toast.makeText(this, getString(R.string.enable_gps), Toast.LENGTH_SHORT).show();
                return;
            }
            lm.requestSingleUpdate(provider, new LocationListener() {
                @Override
                public void onLocationChanged(Location location) {
                    currentLat = String.valueOf(location.getLatitude());
                    currentLng = String.valueOf(location.getLongitude());
                    try {
                        Geocoder geocoder = new Geocoder(ComplaintsActivity.this, Locale.getDefault());
                        List<Address> addresses = geocoder.getFromLocation(location.getLatitude(), location.getLongitude(), 1);
                        if (addresses != null && !addresses.isEmpty()) {
                            String address = addresses.get(0).getAddressLine(0);
                            tvLocation.setText(getString(R.string.location_found, currentLat, currentLng) + "\n" + address);
                        } else {
                            tvLocation.setText(getString(R.string.location_found, currentLat, currentLng));
                        }
                    } catch (Exception e) {
                        tvLocation.setText(getString(R.string.location_found, currentLat, currentLng));
                    }
                    tvLocation.setTextColor(getColor(R.color.on_surface));
                    btnGetLocation.setText(R.string.change_location);

                    String uri = "geo:" + currentLat + "," + currentLng + "?q=" + currentLat + "," + currentLng;
                    Intent mapIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(uri));
                    mapIntent.setPackage("com.google.android.apps.maps");
                    if (mapIntent.resolveActivity(getPackageManager()) != null) {
                        startActivity(mapIntent);
                    } else {
                        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(uri)));
                    }
                }

                @Override
                public void onStatusChanged(String provider, int status, android.os.Bundle extras) { }

                @Override
                public void onProviderEnabled(String provider) { }

                @Override
                public void onProviderDisabled(String provider) {
                    Toast.makeText(ComplaintsActivity.this, getString(R.string.enable_gps), Toast.LENGTH_SHORT).show();
                }
            }, null);
        } catch (SecurityException e) {
            Toast.makeText(this, getString(R.string.location_error), Toast.LENGTH_SHORT).show();
        }
    }

    private void submitComplaint() {
        String description = inputDescription.getText().toString().trim();
        if (selectedCategory.isEmpty()) {
            Toast.makeText(this, getString(R.string.select_category), Toast.LENGTH_SHORT).show();
            return;
        }
        if (selectedCategory.equals("other")) {
            String customCategory = inputOtherCategory.getText().toString().trim();
            if (customCategory.isEmpty()) {
                Toast.makeText(this, getString(R.string.other_category_hint), Toast.LENGTH_SHORT).show();
                inputOtherCategory.requestFocus();
                return;
            }
            selectedCategory = customCategory;
        }
        if (description.isEmpty()) {
            Toast.makeText(this, getString(R.string.describe_issue), Toast.LENGTH_SHORT).show();
            return;
        }

        prefs.saveComplaint(selectedCategory, description,
                photoUri.isEmpty() ? null : photoUri,
                currentLat.isEmpty() ? null : currentLat,
                currentLng.isEmpty() ? null : currentLng);

        inputDescription.setText("");
        selectedCategory = "";
        photoUri = "";
        currentLat = "";
        currentLng = "";
        currentPhotoPath = "";
        inputOtherCategory.setText("");
        inputOtherCategory.setVisibility(View.GONE);
        removePhoto();
        tvLocation.setText(R.string.tap_to_add_location);
        tvLocation.setTextColor(getColor(R.color.outline));
        btnGetLocation.setText(R.string.get_location);
        if (selectedCategoryView != null) {
            selectedCategoryView.setBackgroundResource(R.drawable.bg_input);
            selectedCategoryView = null;
        }

        Toast.makeText(this, getString(R.string.complaint_submitted), Toast.LENGTH_SHORT).show();
        loadComplaints();
    }

    private void loadComplaints() {
        complaintsContainer.removeAllViews();
        List<String[]> complaints = prefs.getComplaints();

        if (complaints.isEmpty()) {
            TextView emptyView = new TextView(this);
            emptyView.setText(getString(R.string.no_complaints));
            emptyView.setTextColor(getColor(R.color.outline));
            emptyView.setPadding(0, getResources().getDimensionPixelSize(R.dimen.spacing_stack_lg), 0, getResources().getDimensionPixelSize(R.dimen.spacing_stack_lg));
            emptyView.setGravity(Gravity.CENTER);
            complaintsContainer.addView(emptyView);
            return;
        }

        for (int i = 0; i < complaints.size(); i++) {
            String[] c = complaints.get(i);
            if (c.length < 6) continue;

            String id = c[0];
            String category = c[1];
            String description = c[2];
            String date = c[3];
            String status = c[4];

            View item = getLayoutInflater().inflate(R.layout.item_complaint, complaintsContainer, false);

            ImageView icon = item.findViewById(R.id.item_icon);
            TextView title = item.findViewById(R.id.item_title);
            TextView detail = item.findViewById(R.id.item_detail);
            TextView desc = item.findViewById(R.id.item_desc);
            TextView statusBadge = item.findViewById(R.id.item_status);

            int iconRes;
            String titleText;
            switch (category) {
                case "road":
                    iconRes = R.drawable.ic_road;
                    titleText = getString(R.string.road_complaint);
                    break;
                case "water":
                    iconRes = R.drawable.ic_water;
                    titleText = getString(R.string.water_complaint);
                    break;
                case "electricity":
                    iconRes = R.drawable.ic_bolt;
                    titleText = getString(R.string.electricity_complaint);
                    break;
                default:
                    iconRes = R.drawable.ic_more_horiz;
                    titleText = getString(R.string.other_complaint);
                    break;
            }
            icon.setImageResource(iconRes);
            title.setText(titleText);

            String locStr = "";
            if (c.length >= 8 && !c[6].isEmpty() && !c[7].isEmpty()) {
                locStr = " | " + getString(R.string.location_abbr) + ": " + c[6].substring(0, Math.min(6, c[6].length())) + "," + c[7].substring(0, Math.min(6, c[7].length()));
            }
            detail.setText(getString(R.string.complaint_date_id, date, id) + locStr);
            desc.setText(description);

            switch (status) {
                case "pending":
                    statusBadge.setBackgroundTintList(android.content.res.ColorStateList.valueOf(Color.parseColor("#FFF3E0")));
                    statusBadge.setTextColor(getColor(R.color.secondary_container));
                    statusBadge.setText(getString(R.string.status_pending));
                    break;
                case "approved":
                    statusBadge.setBackgroundTintList(android.content.res.ColorStateList.valueOf(getColor(R.color.on_primary_container)));
                    statusBadge.setTextColor(getColor(R.color.primary_container));
                    statusBadge.setText(getString(R.string.status_approved));
                    break;
                case "action_required":
                    statusBadge.setBackgroundTintList(android.content.res.ColorStateList.valueOf(getColor(R.color.error_container)));
                    statusBadge.setTextColor(getColor(R.color.on_error_container));
                    statusBadge.setText(getString(R.string.status_action_required));
                    break;
                default:
                    statusBadge.setBackgroundTintList(android.content.res.ColorStateList.valueOf(Color.parseColor("#FFF3E0")));
                    statusBadge.setTextColor(getColor(R.color.secondary_container));
                    statusBadge.setText(getString(R.string.status_pending));
                    break;
            }

            complaintsContainer.addView(item);

            if (i < complaints.size() - 1) {
                View divider = new View(this);
                int margin = getResources().getDimensionPixelSize(R.dimen.spacing_stack_sm);
                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT, 1);
                params.setMargins(0, margin, 0, margin);
                divider.setLayoutParams(params);
                divider.setBackgroundColor(getColor(R.color.outline_variant));
                complaintsContainer.addView(divider);
            }
        }
    }
}