// Prompt templates for AI processing
const EXTRACT_QUESTION_PROMPT = `You are helping a student in an online class. The following is a transcript of a live conversation between a teacher and the student. Your job is to extract only the **most recent question** the teacher asked.

Instructions:
- Only return the **latest full question** from the teacher.
- Ignore greetings, statements, or anything that is not a question.
- If no question is found, return: 'No question detected.'

Transcript:
"""
{{transcript}}
"""

Extracted Question:`;

const GENERATE_ANSWER_PROMPT = `You are a smart AI assistant helping a student answer questions during a class. Based on a teacher's question, generate a clear, correct, and short answer that the student can say out loud or read.

Rules:
- Be accurate and concise.
- Use a tone suitable for a student answering a teacher.
- If the question is unclear or cannot be answered, say: "I'm not sure about that yet."

Question:
"{{question}}"

Answer:`;

class PromptHandler {
    static extractQuestion(transcript) {
        const prompt = EXTRACT_QUESTION_PROMPT.replace('{{transcript}}', transcript);
        return this.callAI(prompt);
    }

    static generateAnswer(question) {
        const prompt = GENERATE_ANSWER_PROMPT.replace('{{question}}', question);
        return this.callAI(prompt);
    }

    static async callAI(prompt) {
        // TODO: Implement actual AI API call here
        // This is a placeholder for the actual AI service integration
        try {
            // You would replace this with your actual AI service call
            // For example, using OpenAI's API or another service
            return "AI response placeholder";
        } catch (error) {
            console.error('Error calling AI service:', error);
            throw error;
        }
    }
}

export { PromptHandler }; 