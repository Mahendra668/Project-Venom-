import { toolInterface } from '../core/dom.js';
import { copyToClipboard } from '../core/utils.js';

export function renderCaseConverter() {
    toolInterface.innerHTML = `
        <div class="input-group">
            <label for="cc-input">Enter your text:</label>
            <textarea id="cc-input" placeholder="Type or paste your text here..."></textarea>
        </div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.5rem;">
            <button class="btn" id="cc-upper">UPPERCASE</button>
            <button class="btn" id="cc-lower">lowercase</button>
            <button class="btn" id="cc-title">Title Case</button>
            <button class="btn" id="cc-sentence">Sentence case</button>
            <button class="btn" id="cc-copy" style="background-color: var(--text-secondary); margin-left: auto;">
                <i class="fa-regular fa-copy"></i> Copy
            </button>
        </div>
    `;

    const input = document.getElementById('cc-input');
    
    document.getElementById('cc-upper').onclick = () => input.value = input.value.toUpperCase();
    document.getElementById('cc-lower').onclick = () => input.value = input.value.toLowerCase();
    
    document.getElementById('cc-title').onclick = () => {
        input.value = input.value.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };
    
    document.getElementById('cc-sentence').onclick = () => {
        input.value = input.value.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
    };

    document.getElementById('cc-copy').onclick = () => {
        copyToClipboard(input.value, document.getElementById('cc-copy'));
    };
}

export function renderRemoveDuplicateLines() {
    toolInterface.innerHTML = `
        <div class="input-group">
            <label for="rdl-input">Enter your text:</label>
            <textarea id="rdl-input" placeholder="Paste your text with duplicate lines here..."></textarea>
        </div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.5rem;">
            <button class="btn" id="rdl-remove">Remove Duplicates</button>
            <button class="btn" id="rdl-copy" style="background-color: var(--text-secondary); margin-left: auto;">
                <i class="fa-regular fa-copy"></i> Copy
            </button>
        </div>
        <div id="rdl-stats" style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.875rem;"></div>
    `;

    const input = document.getElementById('rdl-input');
    const stats = document.getElementById('rdl-stats');
    
    document.getElementById('rdl-remove').onclick = () => {
        const lines = input.value.split('\n');
        const uniqueLines = [...new Set(lines)];
        input.value = uniqueLines.join('\n');
        
        const removed = lines.length - uniqueLines.length;
        stats.textContent = `Removed ${removed} duplicate line(s).`;
    };

    document.getElementById('rdl-copy').onclick = () => {
        copyToClipboard(input.value, document.getElementById('rdl-copy'));
    };
}

export function renderTextCompare() {
    toolInterface.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div class="input-group">
                <label for="tc-input1">Original Text:</label>
                <textarea id="tc-input1" placeholder="Paste original text here..."></textarea>
            </div>
            <div class="input-group">
                <label for="tc-input2">Changed Text:</label>
                <textarea id="tc-input2" placeholder="Paste changed text here..."></textarea>
            </div>
        </div>
        <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
            <button class="btn" id="tc-compare" style="width: 100%;">Compare Texts</button>
        </div>
        <div id="tc-result" style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 0.5rem; min-height: 100px; white-space: pre-wrap; font-family: monospace;">
            Comparison result will appear here...
        </div>
    `;

    document.getElementById('tc-compare').onclick = () => {
        const text1 = document.getElementById('tc-input1').value;
        const text2 = document.getElementById('tc-input2').value;
        const result = document.getElementById('tc-result');
        
        if (text1 === text2) {
            result.innerHTML = '<span style="color: #10b981;">The texts are identical.</span>';
            return;
        }
        
        // Simple line-by-line comparison for demonstration
        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        let diffHtml = '';
        
        const maxLines = Math.max(lines1.length, lines2.length);
        for (let i = 0; i < maxLines; i++) {
            const l1 = lines1[i] || '';
            const l2 = lines2[i] || '';
            
            if (l1 === l2) {
                diffHtml += `<div>${l1}</div>`;
            } else {
                if (l1) diffHtml += `<div style="background-color: rgba(239, 68, 68, 0.2); color: #ef4444; text-decoration: line-through;">- ${l1}</div>`;
                if (l2) diffHtml += `<div style="background-color: rgba(16, 185, 129, 0.2); color: #10b981;">+ ${l2}</div>`;
            }
        }
        
        result.innerHTML = diffHtml;
    };
}

export function renderTextSorter() {
    toolInterface.innerHTML = `
        <div class="input-group">
            <label for="ts-input">Enter text to sort (one item per line):</label>
            <textarea id="ts-input" placeholder="Line 1\nLine 2\nLine 3..."></textarea>
        </div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.5rem;">
            <button class="btn" id="ts-asc">Sort A-Z</button>
            <button class="btn" id="ts-desc">Sort Z-A</button>
            <button class="btn" id="ts-copy" style="background-color: var(--text-secondary); margin-left: auto;">
                <i class="fa-regular fa-copy"></i> Copy
            </button>
        </div>
    `;

    const input = document.getElementById('ts-input');
    
    document.getElementById('ts-asc').onclick = () => {
        const lines = input.value.split('\n').filter(l => l.trim() !== '');
        input.value = lines.sort((a, b) => a.localeCompare(b)).join('\n');
    };

    document.getElementById('ts-desc').onclick = () => {
        const lines = input.value.split('\n').filter(l => l.trim() !== '');
        input.value = lines.sort((a, b) => b.localeCompare(a)).join('\n');
    };

    document.getElementById('ts-copy').onclick = () => {
        copyToClipboard(input.value, document.getElementById('ts-copy'));
    };
}

export function renderReverseText() {
    toolInterface.innerHTML = `
        <div class="input-group">
            <label for="rt-input">Enter text to reverse:</label>
            <textarea id="rt-input" placeholder="Type something here..."></textarea>
        </div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.5rem;">
            <button class="btn" id="rt-chars">Reverse Characters</button>
            <button class="btn" id="rt-words">Reverse Words</button>
            <button class="btn" id="rt-lines">Reverse Lines</button>
            <button class="btn" id="rt-copy" style="background-color: var(--text-secondary); margin-left: auto;">
                <i class="fa-regular fa-copy"></i> Copy
            </button>
        </div>
    `;

    const input = document.getElementById('rt-input');
    
    document.getElementById('rt-chars').onclick = () => {
        input.value = input.value.split('').reverse().join('');
    };

    document.getElementById('rt-words').onclick = () => {
        input.value = input.value.split(' ').reverse().join(' ');
    };

    document.getElementById('rt-lines').onclick = () => {
        input.value = input.value.split('\n').reverse().join('\n');
    };

    document.getElementById('rt-copy').onclick = () => {
        copyToClipboard(input.value, document.getElementById('rt-copy'));
    };
}

export function renderCharacterFrequency() {
    toolInterface.innerHTML = `
        <div class="input-group">
            <label for="cf-input">Enter text to analyze:</label>
            <textarea id="cf-input" placeholder="Type something here..."></textarea>
        </div>
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 0.5rem;">
            <h4 style="margin-bottom: 1rem; color: var(--text-primary);">Frequency Analysis</h4>
            <div id="cf-result" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.5rem;">
                <span style="color: var(--text-secondary);">Results will appear here...</span>
            </div>
        </div>
    `;

    const input = document.getElementById('cf-input');
    const result = document.getElementById('cf-result');
    
    input.addEventListener('input', () => {
        const text = input.value;
        if (!text) {
            result.innerHTML = '<span style="color: var(--text-secondary);">Results will appear here...</span>';
            return;
        }

        const freq = {};
        for (let char of text) {
            // Display space as 'Space'
            const displayChar = char === ' ' ? 'Space' : char === '\n' ? 'Enter' : char;
            freq[displayChar] = (freq[displayChar] || 0) + 1;
        }

        // Sort by frequency descending
        const sortedFreq = Object.entries(freq).sort((a, b) => b[1] - a[1]);

        result.innerHTML = sortedFreq.map(([char, count]) => `
            <div style="background: var(--surface-color); padding: 0.5rem; border-radius: 0.25rem; border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <strong style="color: var(--primary-color); font-family: monospace;">${char}</strong>
                <span style="color: var(--text-secondary); font-size: 0.875rem;">${count}</span>
            </div>
        `).join('');
    });
}
