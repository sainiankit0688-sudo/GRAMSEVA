package com.digital.gramseva;

import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

public class AgricultureDetailActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_agriculture_detail);

        String title = getIntent().getStringExtra("title");
        String[] items = getIntent().getStringArrayExtra("items");

        TextView tvTitle = findViewById(R.id.tv_title);
        tvTitle.setText(title);

        findViewById(R.id.btn_back).setOnClickListener(v -> finish());

        ListView listView = findViewById(R.id.list_items);
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, 0, items) {
            @Override
            public View getView(int position, View convertView, android.view.ViewGroup parent) {
                if (convertView == null) {
                    convertView = getLayoutInflater().inflate(R.layout.item_agriculture_list, parent, false);
                }
                TextView tv = convertView.findViewById(android.R.id.text1);
                tv.setText(getItem(position));

                View divider = convertView.findViewById(R.id.divider);
                divider.setVisibility(position == getCount() - 1 ? View.GONE : View.VISIBLE);

                return convertView;
            }
        };
        listView.setAdapter(adapter);

        listView.setOnItemClickListener((AdapterView<?> parent, View view, int position, long id) -> {
            String item = items[position];
            Toast.makeText(this, item, Toast.LENGTH_SHORT).show();
        });
    }
}
