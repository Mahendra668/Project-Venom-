import { toolInterface } from '../core/dom.js';
import { copyToClipboard, loadScript } from '../core/utils.js';

export function renderJsonFormatter() {
    toolInterface.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; min-height: 400px;">
            <div class="input-group" style="height: 100%;">
                <label for="json-input">Input JSON:</label>
                <textarea id="json-input" style="height: 100%; font-family: monospace;" placeholder='{"enter": "your json here"}'></textarea>
            </div>
            <div class="input-group" style="height: 100%;">
                <label for="json-output">Formatted JSON:</label>
                <textarea id="json-output" style="height: 100%; font-family: monospace;" readonly></textarea>
            </div>
        </div>
        <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem; align-items: center; flex-wrap: wrap;">
            <button class="btn" id="json-format">Format / Beautify</button>
            <button class="btn" id="json-minify">Minify</button>
            <span id="json-error" style="color: #ef4444; font-weight: 500; margin-left: 1rem;"></span>
            <button class="btn" id="json-copy" style="background-color: var(--text-secondary); margin-left: auto;">
                <i class="fa-regular fa-copy"></i> Copy
            </button>
        </div>
    `;

    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const error = document.getElementById('json-error');

    // Instant formatting on input if valid
    input.addEventListener('input', () => {
        try {
            if(!input.value.trim()) {
                output.value = '';
                error.textContent = '';
                return;
            }
            const parsed = JSON.parse(input.value);
            output.value = JSON.stringify(parsed, null, 4);
            error.textContent = '';
        } catch (e) {
            // Do not show error on every keystroke, let user type
        }
    });

    document.getElementById('json-format').onclick = () => {
        try {
            error.textContent = '';
            if(!input.value.trim()) return;
            const parsed = JSON.parse(input.value);
            output.value = JSON.stringify(parsed, null, 4);
        } catch (e) {
            error.textContent = 'Invalid JSON: ' + e.message;
        }
    };

    document.getElementById('json-minify').onclick = () => {
        try {
            error.textContent = '';
            if(!input.value.trim()) return;
            const parsed = JSON.parse(input.value);
            output.value = JSON.stringify(parsed);
        } catch (e) {
            error.textContent = 'Invalid JSON: ' + e.message;
        }
    };

    document.getElementById('json-copy').onclick = () => {
        copyToClipboard(output.value, document.getElementById('json-copy'));
    };
}

export function renderBase64Tool() {
    toolInterface.innerHTML = `
        <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; padding: 1rem; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 0.5rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 500;">
                <input type="radio" name="b64-mode" value="encode" checked style="accent-color: var(--primary-color); width: 1.25rem; height: 1.25rem;"> Encode to Base64
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 500;">
                <input type="radio" name="b64-mode" value="decode" style="accent-color: var(--primary-color); width: 1.25rem; height: 1.25rem;"> Decode from Base64
            </label>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; min-height: 300px;">
            <div class="input-group" style="height: 100%;">
                <label for="b64-input">Input:</label>
                <textarea id="b64-input" style="height: 100%; font-family: monospace;" placeholder="Type or paste text here..."></textarea>
            </div>
            <div class="input-group" style="height: 100%;">
                <label for="b64-output" style="display: flex; justify-content: space-between; align-items: center;">
                    Result:
                    <button id="b64-copy" class="btn" style="padding: 0.25rem 0.75rem; font-size: 0.875rem; background-color: var(--text-secondary);">
                        <i class="fa-regular fa-copy"></i> Copy
                    </button>
                </label>
                <textarea id="b64-output" style="height: 100%; font-family: monospace;" readonly></textarea>
            </div>
        </div>
    `;

    const input = document.getElementById('b64-input');
    const output = document.getElementById('b64-output');
    const radios = document.getElementsByName('b64-mode');
    const copyBtn = document.getElementById('b64-copy');

    const process = () => {
        const mode = Array.from(radios).find(r => r.checked).value;
        const text = input.value;
        
        if (!text) {
            output.value = '';
            return;
        }

        try {
            if (mode === 'encode') {
                output.value = btoa(unescape(encodeURIComponent(text)));
            } else {
                output.value = decodeURIComponent(escape(atob(text)));
            }
        } catch (e) {
            output.value = 'Invalid input for decoding.';
        }
    };

    input.addEventListener('input', process);
    radios.forEach(r => r.addEventListener('change', process));

    copyBtn.onclick = () => {
        if (output.value === 'Invalid input for decoding.') return;
        copyToClipboard(output.value, copyBtn);
    };
}

export function renderUuidGenerator() {
    toolInterface.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; width: 100%; text-align: center;">
            <div class="result-box" style="margin-bottom: 2rem; border-color: var(--primary-color); border-width: 2px; display: flex; justify-content: space-between; align-items: center; background: var(--surface-color);">
                <span id="uuid-result" style="font-family: monospace; font-size: 1.5rem; font-weight: 600; color: var(--text-primary); word-break: break-all;"></span>
                <button class="btn" id="uuid-copy" style="padding: 0.75rem 1.25rem; margin-left: 1rem;"><i class="fa-regular fa-copy"></i></button>
            </div>
            <button class="btn" id="uuid-generate" style="font-size: 1.125rem; padding: 1rem 2rem;">
                <i class="fa-solid fa-arrows-rotate"></i> Generate New UUID
            </button>
        </div>
    `;

    const result = document.getElementById('uuid-result');
    const copyBtn = document.getElementById('uuid-copy');
    const generateBtn = document.getElementById('uuid-generate');

    const generate = () => {
        result.textContent = crypto.randomUUID ? crypto.randomUUID() : 'UUID generation not supported in this browser.';
    };

    generateBtn.onclick = generate;

    copyBtn.onclick = () => {
        copyToClipboard(result.textContent, copyBtn);
    };

    // Generate initial UUID
    generate();
}

export function renderHashGenerator() {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js').then(() => {
        const input = document.getElementById('hash-input');
        if (input) input.dispatchEvent(new Event('input'));
    });

    toolInterface.innerHTML = `
        <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; padding: 1rem; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 0.5rem; flex-wrap: wrap;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 500;">
                <input type="radio" name="hash-algo" value="MD5" checked style="accent-color: var(--primary-color); width: 1.25rem; height: 1.25rem;"> MD5
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 500;">
                <input type="radio" name="hash-algo" value="SHA1" style="accent-color: var(--primary-color); width: 1.25rem; height: 1.25rem;"> SHA-1
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 500;">
                <input type="radio" name="hash-algo" value="SHA256" style="accent-color: var(--primary-color); width: 1.25rem; height: 1.25rem;"> SHA-256
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 500;">
                <input type="radio" name="hash-algo" value="SHA512" style="accent-color: var(--primary-color); width: 1.25rem; height: 1.25rem;"> SHA-512
            </label>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; min-height: 300px;">
            <div class="input-group" style="height: 100%;">
                <label for="hash-input">Input Text:</label>
                <textarea id="hash-input" style="height: 100%; font-family: monospace;" placeholder="Type or paste text here..."></textarea>
            </div>
            <div class="input-group" style="height: 100%;">
                <label for="hash-output" style="display: flex; justify-content: space-between; align-items: center;">
                    Hash Result:
                    <button id="hash-copy" class="btn" style="padding: 0.25rem 0.75rem; font-size: 0.875rem; background-color: var(--text-secondary);">
                        <i class="fa-regular fa-copy"></i> Copy
                    </button>
                </label>
                <textarea id="hash-output" style="height: 100%; font-family: monospace; word-break: break-all;" readonly></textarea>
            </div>
        </div>
    `;

    const input = document.getElementById('hash-input');
    const output = document.getElementById('hash-output');
    const radios = document.getElementsByName('hash-algo');
    const copyBtn = document.getElementById('hash-copy');

    const updateHash = () => {
        if (!window.CryptoJS) {
            output.value = "CryptoJS library loading...";
            return;
        }
        
        const text = input.value;
        const algo = Array.from(radios).find(r => r.checked).value;
        
        if (!text) {
            output.value = '';
            return;
        }
        
        let hash = '';
        switch(algo) {
            case 'MD5': hash = window.CryptoJS.MD5(text).toString(); break;
            case 'SHA1': hash = window.CryptoJS.SHA1(text).toString(); break;
            case 'SHA256': hash = window.CryptoJS.SHA256(text).toString(); break;
            case 'SHA512': hash = window.CryptoJS.SHA512(text).toString(); break;
        }
        output.value = hash;
    };

    input.addEventListener('input', updateHash);
    radios.forEach(r => r.addEventListener('change', updateHash));

    copyBtn.onclick = () => {
        copyToClipboard(output.value, copyBtn);
    };
}
