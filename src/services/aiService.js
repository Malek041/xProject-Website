const N8N_WEBHOOK_URL = 'https://malekt041.app.n8n.cloud/webhook/ai-sop'; // Use your actual webhook URL here

/**
 * Service to handle communication with n8n AI backend
 * 
 * Expected n8n Response Schema:
 * {
 *   message: string,       // The next question or response
 *   inputType: string,     // 'text', 'multi-select', 'dynamic-steps', 'select', etc.
 *   inputAction: string,   // The action identifier for the next step
 *   options: Array<{label, value, icon?, action?}>, // For select/multi-select
 *   dataUpdate: Object,    // Optional: partial documentData to update
 *   trackUpdate: string,   // Optional: 'revenue' or 'growth'
 *   phaseUpdate: string    // Optional: 'define', 'assign', 'extract', etc.
 * }
 */
export const aiService = {
    /**
     * Send user input to n8n for dynamic question generation, intent recognition, etc.
     * @param {Object} context - Current state of the application
     * @param {string} userInput - The user's last input
     * @returns {Promise<Object>} - The next question and suggested options from AI
     */
    processInput: async (context, userInput) => {
        if (!N8N_WEBHOOK_URL) {
            console.warn('n8n Webhook URL is not defined. Falling back to static logic.');
            return null;
        }

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'process_input',
                    userInput,
                    context: {
                        phase: context.phase,
                        systemTrack: context.systemTrack,
                        documentData: context.documentData,
                        currentProjectId: context.currentProjectId
                    }
                }),
            });

            if (!response.ok) {
                throw new Error(`n8n Request failed: ${response.statusText}`);
            }

            const rawData = await response.json();

            // n8n often sends an array [ { ... } ], we want the first object
            let aiResponse = Array.isArray(rawData) ? rawData[0] : rawData;

            // If n8n sends the response inside an 'output' field (stringified), parse it
            if (aiResponse && typeof aiResponse.output === 'string') {
                try {
                    aiResponse = JSON.parse(aiResponse.output);
                } catch (e) {
                    console.warn('Failed to parse stringified AI output:', e);
                }
            } else if (aiResponse && aiResponse.output && typeof aiResponse.output === 'object') {
                aiResponse = aiResponse.output;
            }

            return aiResponse;
        } catch (error) {
            console.error('AI Service Error:', error);
            return null;
        }
    },

    /**
     * Trigger generation of a business framework draft
     * @param {Object} context - Current context data
     */
    generateFramework: async (context) => {
        if (!N8N_WEBHOOK_URL) return null;

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'generate_framework',
                    context: {
                        documentData: context.documentData,
                        phase: context.phase
                    }
                }),
            });

            return await response.json();
        } catch (error) {
            console.error('AI Generation Error:', error);
            return null;
        }
    }
};
