import { toolInterface } from '../core/dom.js';

export function renderTextSummarizer() {
    toolInterface.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
                <div class="input-group">
                    <label for="ai-sum-input">Enter text to summarize:</label>
                    <textarea id="ai-sum-input" style="height: 300px;" placeholder="Paste a long article or text here..."></textarea>
                </div>
                <button class="btn" id="ai-sum-btn" style="width: 100%; margin-top: 1rem;">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Summarize Text
                </button>
            </div>
            <div>
                <div class="input-group">
                    <label>Summary:</label>
                    <div id="ai-sum-result" style="height: 300px; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 1rem; overflow-y: auto; color: var(--text-secondary);">
                        Summary will appear here...
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('ai-sum-btn').onclick = () => {
        const input = document.getElementById('ai-sum-input').value;
        const result = document.getElementById('ai-sum-result');
        
        if (!input.trim()) {
            result.innerHTML = '<span style="color: #ef4444;">Please enter some text to summarize.</span>';
            return;
        }
        
        result.innerHTML = '<div style="display: flex; align-items: center; gap: 0.5rem; color: var(--primary-color);"><i class="fa-solid fa-spinner fa-spin"></i> Analyzing text...</div>';
        
        // Simulate AI processing delay
        setTimeout(() => {
            const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
            
            if (sentences.length <= 3) {
                result.innerHTML = '<span style="color: var(--text-primary);">Text is too short to summarize. Here is the original text:</span><br><br>' + input;
                return;
            }
            
            // Mock summarization: pick the first, middle, and last sentence
            const summary = [
                sentences[0].trim() + '.',
                sentences[Math.floor(sentences.length / 2)].trim() + '.',
                sentences[sentences.length - 1].trim() + '.'
            ];
            
            result.innerHTML = `
                <h4 style="color: var(--text-primary); margin-bottom: 1rem;">Key Points:</h4>
                <ul style="padding-left: 1.5rem; color: var(--text-primary); display: flex; flex-direction: column; gap: 0.5rem;">
                    ${summary.map(s => `<li>${s}</li>`).join('')}
                </ul>
                <div style="margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                    <em>Note: This is a simulated summary for demonstration purposes.</em>
                </div>
            `;
        }, 1500);
    };
}

export function renderPromptGenerator() {
    toolInterface.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <div class="input-group" style="margin-bottom: 1.5rem;">
                <label for="pg-role">Act as a...</label>
                <select id="pg-role">
                    <option value="expert web developer">Expert Web Developer</option>
                    <option value="professional copywriter">Professional Copywriter</option>
                    <option value="data scientist">Data Scientist</option>
                    <option value="marketing strategist">Marketing Strategist</option>
                    <option value="fitness coach">Fitness Coach</option>
                </select>
            </div>
            
            <div class="input-group" style="margin-bottom: 1.5rem;">
                <label for="pg-task">Task Description:</label>
                <textarea id="pg-task" style="height: 100px;" placeholder="e.g., Write a landing page copy for a new SaaS product..."></textarea>
            </div>
            
            <div class="input-group" style="margin-bottom: 1.5rem;">
                <label for="pg-tone">Tone:</label>
                <select id="pg-tone">
                    <option value="professional and authoritative">Professional</option>
                    <option value="casual and friendly">Casual</option>
                    <option value="humorous and engaging">Humorous</option>
                    <option value="academic and detailed">Academic</option>
                </select>
            </div>
            
            <button class="btn" id="pg-generate" style="width: 100%; margin-bottom: 2rem;">Generate Prompt</button>
            
            <div class="input-group">
                <label>Generated Prompt:</label>
                <textarea id="pg-result" style="height: 150px; font-family: monospace;" readonly placeholder="Your optimized prompt will appear here..."></textarea>
            </div>
        </div>
    `;

    document.getElementById('pg-generate').onclick = () => {
        const role = document.getElementById('pg-role').value;
        const task = document.getElementById('pg-task').value;
        const tone = document.getElementById('pg-tone').value;
        const result = document.getElementById('pg-result');
        
        if (!task.trim()) {
            result.value = 'Please enter a task description.';
            return;
        }
        
        const prompt = `Act as an ${role}. 

Your task is: ${task}

Please ensure your response is written in a ${tone} tone. 
Format the output clearly using markdown, bullet points, and headings where appropriate.
Provide actionable insights and explain your reasoning.`;

        result.value = prompt;
    };
}
