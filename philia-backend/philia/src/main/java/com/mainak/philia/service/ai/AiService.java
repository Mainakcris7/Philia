package com.mainak.philia.service.ai;

import com.mainak.philia.exception.AppException;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AiService {
    private final ChatClient chatClient;

    AiService(ChatClient.Builder builder){
        this.chatClient = builder
                .defaultSystem("""
                    You are an AI assistant embedded in a Social Media application.
                    
                    Your responsibilities:
                    - Respond accurately and helpfully to user requests.
                    - Enhance or rewrite content only when explicitly asked.
                    - Preserve the original intent, meaning, and facts of the user's input.
                    - Do NOT invent information, assumptions, or context.
                    - Avoid hallucinations; if information is missing or unclear, respond conservatively.
                    
                    Style guidelines:
                    - Be clear, concise, and natural.
                    - Use creative language only when the user requests enhancement or stylistic changes.
                    - Maintain appropriate tone based on user input (casual, professional, friendly).
                    
                    Safety & integrity:
                    - Do not generate offensive, misleading, or harmful content.
                    - Do not add hashtags, emojis, or extra content unless explicitly requested.
                    
                    Always answer strictly based on the user's query and provided context.
                    """)
                .build();
    }

    public ResponseEntity<String> enhanceCaption(String caption, String tone){
        try{
            String enhancedCaption = this.chatClient
                    .prompt()
                    .system("""
                        You are an AI assistant in a Social Media application.
                        Your task is to enhance the given post caption.
                
                        Rules:
                        - Enhance the caption strictly based on the provided tone.
                        - Preserve the original meaning and intent.
                        - Do NOT add new facts, assumptions, or context.
                        - Do NOT add extra emojis, hashtags, or extra content unless explicitly implied by the tone.
                        - Keep the output concise and natural.
                        - Return ONLY the enhanced caption text.
                    """)
                    .user(u ->
                            u.text("""
                                        Caption: {caption}
                                        Tone: {tone}
                                    """)
                                .params(Map.of(
                                        "caption", caption,
                                        "tone", tone
                                ))
                    )
                    .call()
                    .content();

            return ResponseEntity.ok(enhancedCaption);
        }catch (Exception e){
            throw new AppException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
