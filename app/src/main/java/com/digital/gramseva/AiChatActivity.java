package com.digital.gramseva;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.button.MaterialButton;

import java.util.ArrayList;
import java.util.List;

public class AiChatActivity extends BaseActivity {

    private RecyclerView recyclerChat;
    private EditText etMessage;
    private MaterialButton btnSend;
    private ProgressBar progressTyping;
    private TextView tvWelcomeHint;

    private ChatAdapter adapter;
    private final List<ChatMessage> messages = new ArrayList<>();
    private final GeminiClient geminiClient = new GeminiClient();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ai_chat);

        recyclerChat = findViewById(R.id.recycler_chat);
        etMessage = findViewById(R.id.et_message);
        btnSend = findViewById(R.id.btn_send);
        progressTyping = findViewById(R.id.progress_typing);
        tvWelcomeHint = findViewById(R.id.tv_welcome_hint);

        adapter = new ChatAdapter(messages);
        recyclerChat.setLayoutManager(new LinearLayoutManager(this));
        recyclerChat.setAdapter(adapter);

        findViewById(R.id.btn_back).setOnClickListener(v -> finish());

        btnSend.setOnClickListener(v -> sendMessage());

        etMessage.setOnEditorActionListener((v, actionId, event) -> {
            sendMessage();
            return true;
        });
    }

    private void sendMessage() {
        String text = etMessage.getText().toString().trim();
        if (text.isEmpty()) return;

        etMessage.setText("");
        tvWelcomeHint.setVisibility(View.GONE);

        messages.add(new ChatMessage(text, ChatMessage.TYPE_SENT));
        adapter.notifyItemInserted(messages.size() - 1);
        recyclerChat.smoothScrollToPosition(messages.size() - 1);

        progressTyping.setVisibility(View.VISIBLE);

        geminiClient.sendMessage(text, new GeminiClient.GeminiCallback() {
            @Override
            public void onSuccess(String response) {
                progressTyping.setVisibility(View.GONE);
                messages.add(new ChatMessage(response, ChatMessage.TYPE_RECEIVED));
                adapter.notifyItemInserted(messages.size() - 1);
                recyclerChat.smoothScrollToPosition(messages.size() - 1);
            }

            @Override
            public void onError(String error) {
                progressTyping.setVisibility(View.GONE);
                Toast.makeText(AiChatActivity.this, error, Toast.LENGTH_SHORT).show();
                messages.add(new ChatMessage("Sorry, I couldn't process your request. Please try again.", ChatMessage.TYPE_RECEIVED));
                adapter.notifyItemInserted(messages.size() - 1);
                recyclerChat.smoothScrollToPosition(messages.size() - 1);
            }
        });
    }
}
