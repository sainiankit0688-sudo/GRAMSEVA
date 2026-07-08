package com.digital.gramseva;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
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
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class ComplaintsActivity extends BaseActivity {

    private static final String TAG = "ComplaintsActivity";
    private static final int REQUEST_CAMERA = 1001;
    private static final int REQUEST_GALLERY = 1002;
    private static final int REQUEST_LOCATION_PERM = 1003;
    private static final int REQUEST_CAMERA_PERM = 1004;

    private EditText inputDescription, inputOtherCategory;
    private LinearLayout complaintsContainer;
    private UserPreferences prefs;
    private SupabaseClient supabaseClient;
    private SupabaseClient.UserInfo currentUser;
    private String selectedCategory = "";
    private String photoUri = "";
    private View selectedCategoryView = null;

    private ImageView ivPhotoPreview;
    private FrameLayout photoPreviewContainer;
    private View uploadArea;
    private ImageView ivCameraIcon;
    private TextView tvUploadText;

    private TextView tvLocation, btnGetLocation;
    private String currentLat = "", currentLng = "", currentAddress = "";
    private String currentPhotoPath = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_complaints);

        prefs = new UserPreferences(this);
        supabaseClient = SupabaseClient.getInstance();
        currentUser = supabaseClient.getCurrentUser();

        // ── Debug logging ─────────────────────────────────────────────────────────
        Log.d(TAG, "=== ComplaintsActivity onCreate ===");
        SupabaseClient.Session session = supabaseClient.getCurrentSession();
        if (currentUser != null) {
            Log.d(TAG, "currentUser: id=" + currentUser.id);
            Log.d(TAG, "currentUser: email=" + currentUser.email);
            Log.d(TAG, "currentUser: name=" + currentUser.name);
            Log.d(TAG, "currentUser.id=" + currentUser.id);
        } else {
            Log.w(TAG, "currentUser: null — attempting restore from saved preferences");
            if (prefs.hasSupabaseSession()) {
                supabaseClient.setSession(prefs.getAccessToken(), prefs.getRefreshToken());
                currentUser = supabaseClient.getCurrentUser();
                if (currentUser != null) {
                    Log.d(TAG, "currentUser restored: id=" + currentUser.id + " email=" + currentUser.email);
                }
            }
        }
        if (session != null) {
            Log.d(TAG, "currentSession: accessToken=" + session.accessToken.substring(0, Math.min(10, session.accessToken.length())) + "...");
            Log.d(TAG, "session expiry: " + session.expiresAt + " (epoch seconds)");
        } else {
            Log.w(TAG, "currentSession: null");
        }
        Log.d(TAG, "hasValidSession: " + supabaseClient.hasValidSession());
        // ───────────────────────────────────────────────────────────────────────────

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
        findViewById(R.id.nav_emergency).setOnClickListener(v -> {
            startActivity(new Intent(this, EmergencyServicesActivity.class));
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

    // ─── Category Selection ────────────────────────────────────────────────────────

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

    // ─── Photo ─────────────────────────────────────────────────────────────────────

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
    }

    // ─── Location ──────────────────────────────────────────────────────────────────

    private void fetchLocation() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                    && checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                }, REQUEST_LOCATION_PERM);
                return;
            }
        }

        Toast.makeText(this, getString(R.string.getting_location), Toast.LENGTH_SHORT).show();

        com.google.android.gms.location.FusedLocationProviderClient fusedClient =
                com.google.android.gms.location.LocationServices.getFusedLocationProviderClient(this);

        // Build high accuracy location request
        com.google.android.gms.location.LocationRequest locationRequest =
                new com.google.android.gms.location.LocationRequest.Builder(
                        com.google.android.gms.location.Priority.PRIORITY_HIGH_ACCURACY, 1000)
                        .setMaxUpdates(1)
                        .setWaitForAccurateLocation(false)
                        .build();

        com.google.android.gms.location.LocationCallback locationCallback =
                new com.google.android.gms.location.LocationCallback() {
                    @Override
                    public void onLocationResult(com.google.android.gms.location.LocationResult result) {
                        fusedClient.removeLocationUpdates(this);
                        if (result != null && result.getLastLocation() != null) {
                            updateLocationUI(result.getLastLocation());
                        } else {
                            Toast.makeText(ComplaintsActivity.this,
                                    "Location not found. Please try again.", Toast.LENGTH_SHORT).show();
                        }
                    }
                };

        try {
            // Try last known location first
            fusedClient.getLastLocation().addOnSuccessListener(location -> {
                if (location != null) {
                    updateLocationUI(location);
                } else {
                    // Request fresh location update
                    try {
                        fusedClient.requestLocationUpdates(locationRequest, locationCallback, getMainLooper());
                    } catch (SecurityException e) {
                        Toast.makeText(this, getString(R.string.location_error), Toast.LENGTH_SHORT).show();
                    }
                }
            }).addOnFailureListener(e -> {
                try {
                    fusedClient.requestLocationUpdates(locationRequest, locationCallback, getMainLooper());
                } catch (SecurityException ex) {
                    Toast.makeText(this, getString(R.string.location_error), Toast.LENGTH_SHORT).show();
                }
            });
        } catch (SecurityException e) {
            Toast.makeText(this, getString(R.string.location_error), Toast.LENGTH_SHORT).show();
        }
    }

    private void updateLocationUI(android.location.Location location) {
        currentLat = String.valueOf(location.getLatitude());
        currentLng = String.valueOf(location.getLongitude());
        currentAddress = "";
        try {
            Geocoder geocoder = new Geocoder(ComplaintsActivity.this, Locale.getDefault());
            List<Address> addresses = geocoder.getFromLocation(location.getLatitude(), location.getLongitude(), 1);
            if (addresses != null && !addresses.isEmpty()) {
                currentAddress = addresses.get(0).getAddressLine(0);
                tvLocation.setText(getString(R.string.location_found, currentLat, currentLng) + "\n" + currentAddress);
            } else {
                tvLocation.setText(getString(R.string.location_found, currentLat, currentLng));
            }
        } catch (Exception e) {
            tvLocation.setText(getString(R.string.location_found, currentLat, currentLng));
        }
        tvLocation.setTextColor(getColor(R.color.on_surface));
        btnGetLocation.setText(R.string.change_location);
    }

    // ─── Submit ────────────────────────────────────────────────────────────────────

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

        // ── Get authenticated user from singleton ──────────────────────────────────
        currentUser = supabaseClient.getCurrentUser();

        if (currentUser == null || currentUser.id.isEmpty()) {
            if (prefs.hasSupabaseSession()) {
                supabaseClient.setSession(prefs.getAccessToken(), prefs.getRefreshToken());
                currentUser = supabaseClient.getCurrentUser();
            }
        }

        String accessToken = prefs.getAccessToken();
        if (accessToken.isEmpty() && supabaseClient.getCurrentSession() != null) {
            accessToken = supabaseClient.getCurrentSession().accessToken;
            String refreshToken = supabaseClient.getCurrentSession().refreshToken;
            prefs.setSupabaseSession(accessToken, refreshToken != null ? refreshToken : "");
        }

        // If no Supabase session — save locally for email/password users
        if (currentUser == null || currentUser.id.isEmpty() || accessToken.isEmpty()) {
            prefs.saveComplaint(selectedCategory, description, photoUri.isEmpty() ? null : photoUri,
                    currentLat.isEmpty() ? null : currentLat, currentLng.isEmpty() ? null : currentLng);
            resetForm();
            Toast.makeText(this, getString(R.string.complaint_submitted), Toast.LENGTH_SHORT).show();
            loadComplaints();
            return;
        }

        String userId = currentUser.id;

        findViewById(R.id.btn_submit_complaint).setEnabled(false);
        Toast.makeText(this, getString(R.string.submitting), Toast.LENGTH_SHORT).show();

        final String finalUserId = userId;
        final String cat = selectedCategory;
        final double lat = currentLat.isEmpty() ? 0 : Double.parseDouble(currentLat);
        final double lng = currentLng.isEmpty() ? 0 : Double.parseDouble(currentLng);
        final String addr = currentAddress;
        final String desc = description;

        Log.d(TAG, String.format("submitComplaint: category=%s, userId=%s, lat=%.4f, lng=%.4f, hasPhoto=%s",
                cat, finalUserId, lat, lng, !photoUri.isEmpty()));

        if (photoUri.isEmpty()) {
            insertComplaint(finalUserId, cat, desc, null, lat, lng, addr);
        } else {
            String photoPath = resolvePhotoFilePath(photoUri);
            if (photoPath == null) {
                Log.e(TAG, "submitComplaint: could not resolve photo path: " + photoUri);
                insertComplaint(finalUserId, cat, desc, null, lat, lng, addr);
            } else {
                Log.d(TAG, "submitComplaint: uploading photo from " + photoPath);
                supabaseClient.uploadPhoto(finalUserId, photoPath, new SupabaseClient.UploadCallback() {
                    @Override
                    public void onSuccess(String publicUrl) {
                        Log.d(TAG, "uploadPhoto success: " + publicUrl);
                        insertComplaint(finalUserId, cat, desc, publicUrl, lat, lng, addr);
                    }

                    @Override
                    public void onError(String error) {
                        Log.e(TAG, "uploadPhoto failed: " + error);
                        findViewById(R.id.btn_submit_complaint).setEnabled(true);
                        Toast.makeText(ComplaintsActivity.this,
                                getString(R.string.photo_upload_failed) + ": " + error,
                                Toast.LENGTH_LONG).show();
                    }
                });
            }
        }
    }

    private void insertComplaint(String userId, String category,
                                  String description, String photoUrl,
                                  double lat, double lng, String address) {
        Complaint complaint = new Complaint(userId, category, description, photoUrl, lat, lng, address, "Pending");
        Log.d(TAG, "insertComplaint: sending to Supabase");

        supabaseClient.insertComplaint(complaint, new SupabaseClient.InsertCallback() {
            @Override
            public void onSuccess(Complaint inserted) {
                Log.d(TAG, "insertComplaint success: id=" + inserted.getId());
                resetForm();
                findViewById(R.id.btn_submit_complaint).setEnabled(true);
                Toast.makeText(ComplaintsActivity.this,
                        getString(R.string.complaint_submitted),
                        Toast.LENGTH_SHORT).show();
                loadComplaints();
            }

            @Override
            public void onError(String error) {
                Log.e(TAG, "insertComplaint failed: " + error);
                findViewById(R.id.btn_submit_complaint).setEnabled(true);
                Toast.makeText(ComplaintsActivity.this,
                        "Supabase error: " + error,
                        Toast.LENGTH_LONG).show();
            }
        });
    }

    private String resolvePhotoFilePath(String uriString) {
        if (uriString == null || uriString.isEmpty()) return null;
        if (uriString.startsWith("file://")) {
            return uriString.substring(7);
        }
        if (uriString.startsWith("/")) {
            return uriString;
        }
        if (uriString.startsWith("content://")) {
            try {
                InputStream is = getContentResolver().openInputStream(Uri.parse(uriString));
                if (is == null) return null;
                File tempFile = File.createTempFile("upload_", ".jpg", getCacheDir());
                FileOutputStream os = new FileOutputStream(tempFile);
                byte[] buffer = new byte[4096];
                int read;
                while ((read = is.read(buffer)) != -1) {
                    os.write(buffer, 0, read);
                }
                os.close();
                is.close();
                Log.d(TAG, "resolvePhotoFilePath: copied content:// to " + tempFile.getAbsolutePath());
                return tempFile.getAbsolutePath();
            } catch (Exception e) {
                Log.e(TAG, "resolvePhotoFilePath: " + e.getMessage());
                return null;
            }
        }
        return null;
    }

    private void resetForm() {
        inputDescription.setText("");
        selectedCategory = "";
        photoUri = "";
        currentLat = "";
        currentLng = "";
        currentAddress = "";
        currentPhotoPath = "";
        inputOtherCategory.setText("");
        inputOtherCategory.setVisibility(View.GONE);
        photoPreviewContainer.setVisibility(View.GONE);
        uploadArea.setVisibility(View.VISIBLE);
        tvLocation.setText(R.string.tap_to_add_location);
        tvLocation.setTextColor(getColor(R.color.outline));
        btnGetLocation.setText(R.string.get_location);
        if (selectedCategoryView != null) {
            selectedCategoryView.setBackgroundResource(R.drawable.bg_input);
            selectedCategoryView = null;
        }
    }

    // ─── Load Complaints (Supabase only) ───────────────────────────────────────────

    private void loadComplaints() {
        currentUser = supabaseClient.getCurrentUser();
        if (currentUser == null || currentUser.id.isEmpty()) {
            Log.w(TAG, "loadComplaints: no authenticated user");
            showEmptyView();
            return;
        }

        Log.d(TAG, "loadComplaints: fetching complaints for userId=" + currentUser.id);
        supabaseClient.getUserComplaints(new SupabaseClient.ComplaintsCallback() {
            @Override
            public void onSuccess(List<Complaint> complaints) {
                Log.d(TAG, "loadComplaints success: " + (complaints != null ? complaints.size() : 0) + " items");
                runOnUiThread(() -> displayComplaints(complaints));
            }

            @Override
            public void onError(String error) {
                Log.e(TAG, "loadComplaints failed: " + error);
                runOnUiThread(() -> {
                    Toast.makeText(ComplaintsActivity.this,
                            "Failed to load complaints: " + error,
                            Toast.LENGTH_LONG).show();
                    showEmptyView();
                });
            }
        });
    }

    private void displayComplaints(List<Complaint> complaints) {
        complaintsContainer.removeAllViews();

        if (complaints == null || complaints.isEmpty()) {
            showEmptyView();
            return;
        }

        for (int i = 0; i < complaints.size(); i++) {
            Complaint c = complaints.get(i);
            String id = c.getId() != null ? c.getId().substring(0, Math.min(8, c.getId().length())) : "";
            String category = c.getCategory() != null ? c.getCategory() : "";
            String description = c.getDescription() != null ? c.getDescription() : "";
            String date = c.getCreatedAt() != null ? c.getCreatedAt().substring(0, 10) : "";
            String status = c.getStatus() != null ? c.getStatus().toLowerCase() : "pending";

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
            if (c.getLatitude() != null && c.getLatitude() != 0 && c.getLongitude() != null && c.getLongitude() != 0) {
                locStr = " | " + getString(R.string.location_abbr) + ": " +
                        String.format(Locale.US, "%.4f", c.getLatitude()) + "," +
                        String.format(Locale.US, "%.4f", c.getLongitude());
            }
            detail.setText(getString(R.string.complaint_date_id, date, id) + locStr);
            desc.setText(description);

            TextView btnCancel = item.findViewById(R.id.btn_cancel);

            switch (status) {
                case "pending":
                    statusBadge.setBackgroundTintList(android.content.res.ColorStateList.valueOf(Color.parseColor("#FFF3E0")));
                    statusBadge.setTextColor(getColor(R.color.secondary_container));
                    statusBadge.setText(getString(R.string.status_pending));
                    btnCancel.setVisibility(View.VISIBLE);
                    final String cancelId = c.getId();
                    btnCancel.setOnClickListener(v -> cancelSupabaseComplaint(cancelId));
                    break;
                case "approved":
                    statusBadge.setBackgroundTintList(android.content.res.ColorStateList.valueOf(getColor(R.color.on_primary_container)));
                    statusBadge.setTextColor(getColor(R.color.primary_container));
                    statusBadge.setText(getString(R.string.status_approved));
                    btnCancel.setVisibility(View.GONE);
                    break;
                case "action_required":
                    statusBadge.setBackgroundTintList(android.content.res.ColorStateList.valueOf(getColor(R.color.error_container)));
                    statusBadge.setTextColor(getColor(R.color.on_error_container));
                    statusBadge.setText(getString(R.string.status_action_required));
                    btnCancel.setVisibility(View.GONE);
                    break;
                case "cancelled":
                    statusBadge.setBackgroundTintList(android.content.res.ColorStateList.valueOf(Color.parseColor("#E0E0E0")));
                    statusBadge.setTextColor(Color.parseColor("#757575"));
                    statusBadge.setText(getString(R.string.status_cancelled));
                    btnCancel.setVisibility(View.GONE);
                    break;
                default:
                    statusBadge.setBackgroundTintList(android.content.res.ColorStateList.valueOf(Color.parseColor("#FFF3E0")));
                    statusBadge.setTextColor(getColor(R.color.secondary_container));
                    statusBadge.setText(getString(R.string.status_pending));
                    btnCancel.setVisibility(View.GONE);
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

    // ─── Cancel ────────────────────────────────────────────────────────────────────

    private void cancelSupabaseComplaint(String complaintId) {
        new androidx.appcompat.app.AlertDialog.Builder(this)
                .setTitle(getString(R.string.cancel_complaint_title))
                .setMessage(getString(R.string.cancel_complaint_message))
                .setPositiveButton(getString(R.string.yes_cancel), (dialog, which) -> {
                    Log.d(TAG, "cancelComplaint: id=" + complaintId);
                    supabaseClient.cancelComplaint(complaintId, new SupabaseClient.SimpleCallback() {
                        @Override
                        public void onSuccess() {
                            Log.d(TAG, "cancelComplaint success: " + complaintId);
                            runOnUiThread(() -> {
                                Toast.makeText(ComplaintsActivity.this,
                                        getString(R.string.complaint_cancelled),
                                        Toast.LENGTH_SHORT).show();
                                loadComplaints();
                            });
                        }

                        @Override
                        public void onError(String error) {
                            Log.e(TAG, "cancelComplaint failed: " + error);
                            runOnUiThread(() -> {
                                Toast.makeText(ComplaintsActivity.this,
                                        "Failed to cancel: " + error,
                                        Toast.LENGTH_LONG).show();
                            });
                        }
                    });
                })
                .setNegativeButton(getString(R.string.no), null)
                .show();
    }

    // ─── Empty State ───────────────────────────────────────────────────────────────

    private void showEmptyView() {
        complaintsContainer.removeAllViews();
        TextView emptyView = new TextView(this);
        emptyView.setText(getString(R.string.no_complaints));
        emptyView.setTextColor(getColor(R.color.outline));
        emptyView.setPadding(0, getResources().getDimensionPixelSize(R.dimen.spacing_stack_lg), 0, getResources().getDimensionPixelSize(R.dimen.spacing_stack_lg));
        emptyView.setGravity(Gravity.CENTER);
        complaintsContainer.addView(emptyView);
    }
}
