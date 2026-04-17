from typing import Optional

def get_recent_transcript(transcript: str, word_limit: int) -> str:
    words = transcript.strip().split()
    if len(words) <= word_limit:
        return transcript.strip()
    return ' '.join(words[-word_limit:])


def build_suggestion_prompt(transcript: str, context_window_words: int) -> str:
    recent = get_recent_transcript(transcript, context_window_words)

    return f"""You are a real-time meeting intelligence assistant. You are silently listening to a live conversation and your job is to surface exactly 3 suggestions that would be most useful to the listener RIGHT NOW.

Here is the recent conversation transcript:
<transcript>
{recent}
</transcript>

Analyze the transcript carefully and generate exactly 3 suggestions. Each suggestion must be one of these types based on what is most useful given the current context:

- QUESTION TO ASK: A specific, insightful question the listener could ask right now to deepen understanding or move the conversation forward
- TALKING POINT: A relevant point, fact, or perspective worth raising in the current discussion
- ANSWER: A direct answer to a question that was just asked in the conversation
- FACT CHECK: A claim made in the conversation that should be verified, with the correct information
- CLARIFICATION: Something that was said that needs clarification, with the clearer explanation

Rules:
- Choose the types that make the most sense for what is happening RIGHT NOW in the conversation
- Do not always return the same 3 types. Read the context and pick the most useful mix.
- Each preview must be useful and informative on its own without needing to click
- Be specific to what was actually said, not generic
- If the transcript is very short or unclear, still return 3 useful suggestions based on what you can infer

Respond ONLY with valid JSON in this exact format, no explanation, no markdown:
{{
  "cards": [
    {{
      "type": "QUESTION TO ASK",
      "title": "Short actionable title under 10 words",
      "preview": "A useful, specific preview that delivers value on its own in 1-2 sentences"
    }},
    {{
      "type": "TALKING POINT",
      "title": "Short actionable title under 10 words",
      "preview": "A useful, specific preview that delivers value on its own in 1-2 sentences"
    }},
    {{
      "type": "ANSWER",
      "title": "Short actionable title under 10 words",
      "preview": "A useful, specific preview that delivers value on its own in 1-2 sentences"
    }}
  ]
}}"""


def build_chat_prompt(transcript: str, user_message: str, card_context: Optional[str] = None) -> str:
    card_section = ''
    if card_context:
        card_section = f"""
The user clicked a suggestion card with this context:
<card_context>
{card_context}
</card_context>
Use this as additional grounding for your answer alongside the transcript.
"""

    return f"""You are a real-time meeting intelligence assistant with access to the full conversation transcript.

<transcript>
{transcript}
</transcript>
{card_section}
The user asks: {user_message}

Instructions:
- Be concise and direct. 3-5 sentences maximum unless a list is genuinely needed.
- Reference specific things from the transcript where relevant.
- Use simple markdown only: bold for key terms, bullet points if listing 3+ items.
- Never use tables. Never pad with unnecessary explanation.
- Lead with the answer, not the context."""
    return f"""You are a real-time meeting intelligence assistant with access to the full conversation transcript.

<transcript>
{transcript}
</transcript>

The user asks: {user_message}

Instructions:
- Be concise and direct. 3-5 sentences maximum unless a list is genuinely needed.
- Reference specific things from the transcript where relevant.
- Use simple markdown only: bold for key terms, bullet points if listing 3+ items.
- Never use tables. Never pad with unnecessary explanation.
- Lead with the answer, not the context."""