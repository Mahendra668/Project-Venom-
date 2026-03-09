import { toolInterface } from '../core/dom.js';
import { copyToClipboard, loadScript } from '../core/utils.js';

export function renderPasswordGenerator() {
    toolInterface.innerHTML = `
        <div style="max-width: 500px; margin: 0 auto; width: 100%;">
            <div class="result-box" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; background: var(--surface-color); border-color: var(--primary-color); border-width: 2px;">
                <span id="pg-result" style="font-family: monospace; font-size: 1.5rem; word-break: break-all; color: var(--text-primary); font-weight: 600;">Click Generate</span>
                <button class="btn" id="pg-copy" style="padding: 0.5rem 1rem; margin-left: 1rem;"><i class="fa-regular fa-copy"></i></button>
            </div>
            
            <div class="input-group" style="margin-bottom: 1.5rem;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    Password Length: <span id="pg-len-val" style="color: var(--primary-color); font-weight: 700;">16</span>
                </label>
                <input type="range" id="pg-length" min="4" max="64" value="16" style="width: 100%; accent-color: var(--primary-color);">
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; background: var(--bg-color); padding: 1.5rem; border-radius: 0.5rem; border: 1px solid var(--border-color);">
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-weight: 500;">
                    <input type="checkbox" id="pg-upper" checked style="width: 1.25rem; height: 1.25rem; accent-color: var(--primary-color);"> Include Uppercase (A-Z)
                </label>
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-weight: 500;">
                    <input type="checkbox" id="pg-lower" checked style="width: 1.25rem; height: 1.25rem; accent-color: var(--primary-color);"> Include Lowercase (a-z)
                </label>
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-weight: 500;">
                    <input type="checkbox" id="pg-numbers" checked style="width: 1.25rem; height: 1.25rem; accent-color: var(--primary-color);"> Include Numbers (0-9)
                </label>
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-weight: 500;">
                    <input type="checkbox" id="pg-symbols" checked style="width: 1.25rem; height: 1.25rem; accent-color: var(--primary-color);"> Include Symbols (!@#$%)
                </label>
            </div>
            
            <button class="btn" id="pg-generate" style="width: 100%; font-size: 1.125rem; padding: 1rem;">Generate Password</button>
        </div>
    `;

    const lengthSlider = document.getElementById('pg-length');
    const lengthVal = document.getElementById('pg-len-val');
    const result = document.getElementById('pg-result');
    
    lengthSlider.addEventListener('input', (e) => {
        lengthVal.textContent = e.target.value;
    });

    const generatePassword = () => {
        const length = parseInt(lengthSlider.value);
        const hasUpper = document.getElementById('pg-upper').checked;
        const hasLower = document.getElementById('pg-lower').checked;
        const hasNumbers = document.getElementById('pg-numbers').checked;
        const hasSymbols = document.getElementById('pg-symbols').checked;

        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+[]{}<>?/|';

        let chars = '';
        if (hasUpper) chars += upper;
        if (hasLower) chars += lower;
        if (hasNumbers) chars += numbers;
        if (hasSymbols) chars += symbols;

        if (chars === '') {
            result.textContent = 'Select at least one option';
            return;
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        result.textContent = password;
    };

    document.getElementById('pg-generate').onclick = generatePassword;
    
    document.getElementById('pg-copy').onclick = () => {
        if (result.textContent !== 'Click Generate' && result.textContent !== 'Select at least one option') {
            copyToClipboard(result.textContent, document.getElementById('pg-copy'));
        }
    };

    // Generate initial
    generatePassword();
}

export function renderAgeCalculator() {
    toolInterface.innerHTML = `
        <div style="max-width: 500px; margin: 0 auto; width: 100%;">
            <div class="input-group" style="margin-bottom: 1.5rem;">
                <label for="ac-dob">Date of Birth:</label>
                <input type="date" id="ac-dob" max="${new Date().toISOString().split('T')[0]}" style="font-size: 1.125rem;">
            </div>
            <button class="btn" id="ac-calculate" style="width: 100%; margin-bottom: 2rem; font-size: 1.125rem; padding: 1rem;">Calculate Age</button>
            
            <div id="ac-result" style="display: none; flex-direction: column; gap: 1rem;">
                <div class="result-box" style="text-align: center; background: var(--primary-color); color: white; border: none;">
                    <h3 id="ac-years" style="font-size: 4rem; line-height: 1; font-weight: 700;">0</h3>
                    <p style="font-weight: 500; font-size: 1.25rem; opacity: 0.9;">Years Old</p>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="result-box" style="text-align: center;">
                        <h4 id="ac-months" style="font-size: 2rem; color: var(--primary-color); line-height: 1; font-weight: 700;">0</h4>
                        <p style="font-size: 1rem; color: var(--text-secondary); margin-top: 0.5rem; font-weight: 500;">Months</p>
                    </div>
                    <div class="result-box" style="text-align: center;">
                        <h4 id="ac-days" style="font-size: 2rem; color: var(--primary-color); line-height: 1; font-weight: 700;">0</h4>
                        <p style="font-size: 1rem; color: var(--text-secondary); margin-top: 0.5rem; font-weight: 500;">Days</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('ac-calculate').onclick = () => {
        const dobInput = document.getElementById('ac-dob').value;
        if (!dobInput) return;

        const dob = new Date(dobInput);
        const today = new Date();
        
        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        let days = today.getDate() - dob.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        document.getElementById('ac-years').textContent = years;
        document.getElementById('ac-months').textContent = months;
        document.getElementById('ac-days').textContent = days;
        document.getElementById('ac-result').style.display = 'flex';
    };
}

export function renderQrGenerator() {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js').then(() => {
        const input = document.getElementById('qr-input');
        if (input && input.value) input.dispatchEvent(new Event('input'));
    });

    toolInterface.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 2rem; align-items: start;">
            <div style="flex: 1; min-width: 280px;">
                <div class="input-group">
                    <label for="qr-input">Text or URL:</label>
                    <textarea id="qr-input" style="height: 150px;" placeholder="Enter text or URL to generate QR code..."></textarea>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <div class="input-group" style="flex: 1;">
                        <label for="qr-size">Size (px):</label>
                        <input type="number" id="qr-size" value="256" min="100" max="1000">
                    </div>
                    <div class="input-group" style="flex: 1;">
                        <label for="qr-color">Color:</label>
                        <input type="color" id="qr-color" value="#000000" style="height: 42px; padding: 0.25rem;">
                    </div>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; background: var(--surface-color); padding: 1.5rem; border-radius: 0.5rem; border: 1px solid var(--border-color);">
                <div id="qrcode" style="background: white; padding: 1rem; border-radius: 0.5rem; min-width: 256px; min-height: 256px; display: flex; justify-content: center; align-items: center;">
                    <span style="color: var(--text-secondary);">QR Code will appear here</span>
                </div>
                <button id="qr-download" class="btn" style="width: 100%;" disabled>
                    <i class="fa-solid fa-download"></i> Download Image
                </button>
            </div>
        </div>
    `;

    const input = document.getElementById('qr-input');
    const sizeInput = document.getElementById('qr-size');
    const colorInput = document.getElementById('qr-color');
    const qrContainer = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('qr-download');
    let qrcode = null;

    const generateQR = () => {
        if (!window.QRCode) {
            qrContainer.innerHTML = '<span style="color: var(--text-secondary);">Loading QR Code library...</span>';
            return;
        }

        const text = input.value.trim();
        qrContainer.innerHTML = '';
        
        if (!text) {
            qrContainer.innerHTML = '<span style="color: var(--text-secondary);">QR Code will appear here</span>';
            downloadBtn.disabled = true;
            return;
        }

        const size = parseInt(sizeInput.value) || 256;
        const color = colorInput.value;

        qrcode = new window.QRCode(qrContainer, {
            text: text,
            width: size,
            height: size,
            colorDark : color,
            colorLight : "#ffffff",
            correctLevel : window.QRCode.CorrectLevel.H
        });
        
        downloadBtn.disabled = false;
    };

    input.addEventListener('input', generateQR);
    sizeInput.addEventListener('change', generateQR);
    colorInput.addEventListener('input', generateQR);

    downloadBtn.addEventListener('click', () => {
        const img = qrContainer.querySelector('img');
        if (img) {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
                window.saveAs(blob, 'qrcode.png');
            });
        }
    });
}

export function renderUnitConverter() {
    toolInterface.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <div class="input-group" style="margin-bottom: 1.5rem;">
                <label for="uc-category">Category:</label>
                <select id="uc-category" style="font-size: 1.125rem;">
                    <option value="length">Length</option>
                    <option value="weight">Weight</option>
                    <option value="temperature">Temperature</option>
                </select>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center;">
                <div class="input-group">
                    <label for="uc-from-val">From:</label>
                    <input type="number" id="uc-from-val" value="1" style="margin-bottom: 0.5rem;">
                    <select id="uc-from-unit"></select>
                </div>
                
                <div style="margin-top: 1.5rem; color: var(--text-secondary);">
                    <i class="fa-solid fa-equals" style="font-size: 1.5rem;"></i>
                </div>
                
                <div class="input-group">
                    <label for="uc-to-val">To:</label>
                    <input type="number" id="uc-to-val" readonly style="margin-bottom: 0.5rem; background: var(--bg-color);">
                    <select id="uc-to-unit"></select>
                </div>
            </div>
        </div>
    `;

    const units = {
        length: {
            m: { name: 'Meters', factor: 1 },
            km: { name: 'Kilometers', factor: 1000 },
            cm: { name: 'Centimeters', factor: 0.01 },
            mm: { name: 'Millimeters', factor: 0.001 },
            in: { name: 'Inches', factor: 0.0254 },
            ft: { name: 'Feet', factor: 0.3048 },
            yd: { name: 'Yards', factor: 0.9144 },
            mi: { name: 'Miles', factor: 1609.34 }
        },
        weight: {
            kg: { name: 'Kilograms', factor: 1 },
            g: { name: 'Grams', factor: 0.001 },
            mg: { name: 'Milligrams', factor: 0.000001 },
            lb: { name: 'Pounds', factor: 0.453592 },
            oz: { name: 'Ounces', factor: 0.0283495 }
        },
        temperature: {
            c: { name: 'Celsius' },
            f: { name: 'Fahrenheit' },
            k: { name: 'Kelvin' }
        }
    };

    const categorySelect = document.getElementById('uc-category');
    const fromVal = document.getElementById('uc-from-val');
    const toVal = document.getElementById('uc-to-val');
    const fromUnit = document.getElementById('uc-from-unit');
    const toUnit = document.getElementById('uc-to-unit');

    const updateUnits = () => {
        const cat = categorySelect.value;
        const options = Object.entries(units[cat]).map(([key, val]) => `<option value="${key}">${val.name}</option>`).join('');
        fromUnit.innerHTML = options;
        toUnit.innerHTML = options;
        
        if (cat === 'length') { fromUnit.value = 'm'; toUnit.value = 'ft'; }
        if (cat === 'weight') { fromUnit.value = 'kg'; toUnit.value = 'lb'; }
        if (cat === 'temperature') { fromUnit.value = 'c'; toUnit.value = 'f'; }
        
        calculate();
    };

    const calculate = () => {
        const cat = categorySelect.value;
        const val = parseFloat(fromVal.value);
        
        if (isNaN(val)) {
            toVal.value = '';
            return;
        }

        const from = fromUnit.value;
        const to = toUnit.value;

        if (cat === 'temperature') {
            let c;
            if (from === 'c') c = val;
            else if (from === 'f') c = (val - 32) * 5/9;
            else if (from === 'k') c = val - 273.15;

            let result;
            if (to === 'c') result = c;
            else if (to === 'f') result = (c * 9/5) + 32;
            else if (to === 'k') result = c + 273.15;
            
            toVal.value = result.toFixed(2);
        } else {
            const baseVal = val * units[cat][from].factor;
            const result = baseVal / units[cat][to].factor;
            toVal.value = result.toPrecision(6).replace(/\.?0+$/, '');
        }
    };

    categorySelect.addEventListener('change', updateUnits);
    fromVal.addEventListener('input', calculate);
    fromUnit.addEventListener('change', calculate);
    toUnit.addEventListener('change', calculate);

    updateUnits();
}

export function renderCurrencyConverter() {
    toolInterface.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <div id="cc-loading" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem; color: var(--primary-color);"></i>
                <p>Fetching live exchange rates...</p>
            </div>
            <div id="cc-content" style="display: none;">
                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center;">
                    <div class="input-group">
                        <label for="cc-from-val">Amount:</label>
                        <input type="number" id="cc-from-val" value="1" style="margin-bottom: 0.5rem;">
                        <select id="cc-from-curr"></select>
                    </div>
                    
                    <div style="margin-top: 1.5rem; color: var(--text-secondary); cursor: pointer;" id="cc-swap">
                        <i class="fa-solid fa-right-left" style="font-size: 1.5rem; padding: 0.5rem; border-radius: 50%; background: var(--border-color);"></i>
                    </div>
                    
                    <div class="input-group">
                        <label for="cc-to-val">Converted:</label>
                        <input type="number" id="cc-to-val" readonly style="margin-bottom: 0.5rem; background: var(--bg-color);">
                        <select id="cc-to-curr"></select>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-secondary);" id="cc-info">
                </div>
            </div>
        </div>
    `;

    const loading = document.getElementById('cc-loading');
    const content = document.getElementById('cc-content');
    const fromVal = document.getElementById('cc-from-val');
    const toVal = document.getElementById('cc-to-val');
    const fromCurr = document.getElementById('cc-from-curr');
    const toCurr = document.getElementById('cc-to-curr');
    const swapBtn = document.getElementById('cc-swap');
    const info = document.getElementById('cc-info');

    let rates = {};

    fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(res => res.json())
        .then(data => {
            rates = data.rates;
            const currencies = Object.keys(rates).sort();
            const options = currencies.map(c => `<option value="${c}">${c}</option>`).join('');
            
            fromCurr.innerHTML = options;
            toCurr.innerHTML = options;
            
            fromCurr.value = 'USD';
            toCurr.value = 'EUR';
            
            loading.style.display = 'none';
            content.style.display = 'block';
            
            info.textContent = `Last updated: ${new Date(data.time_last_updated * 1000).toLocaleString()}`;
            
            calculate();
        })
        .catch(err => {
            loading.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Failed to load exchange rates. Please check your connection.';
            loading.style.color = '#ef4444';
        });

    const calculate = () => {
        const val = parseFloat(fromVal.value);
        if (isNaN(val)) {
            toVal.value = '';
            return;
        }

        const from = fromCurr.value;
        const to = toCurr.value;
        
        // Convert to USD first (base), then to target
        const baseVal = val / rates[from];
        const result = baseVal * rates[to];
        
        toVal.value = result.toFixed(2);
    };

    fromVal.addEventListener('input', calculate);
    fromCurr.addEventListener('change', calculate);
    toCurr.addEventListener('change', calculate);
    
    swapBtn.addEventListener('click', () => {
        const temp = fromCurr.value;
        fromCurr.value = toCurr.value;
        toCurr.value = temp;
        calculate();
    });
}

export function renderWordCounter() {
    toolInterface.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: var(--surface-color); padding: 1rem; border-radius: 0.5rem; border: 1px solid var(--border-color); text-align: center;">
                <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);" id="wc-words">0</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 500;">Words</div>
            </div>
            <div style="background: var(--surface-color); padding: 1rem; border-radius: 0.5rem; border: 1px solid var(--border-color); text-align: center;">
                <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);" id="wc-chars">0</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 500;">Characters</div>
            </div>
            <div style="background: var(--surface-color); padding: 1rem; border-radius: 0.5rem; border: 1px solid var(--border-color); text-align: center;">
                <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);" id="wc-sentences">0</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 500;">Sentences</div>
            </div>
            <div style="background: var(--surface-color); padding: 1rem; border-radius: 0.5rem; border: 1px solid var(--border-color); text-align: center;">
                <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);" id="wc-paragraphs">0</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 500;">Paragraphs</div>
            </div>
        </div>
        
        <div class="input-group" style="height: 400px;">
            <textarea id="wc-input" style="height: 100%; font-size: 1.125rem; line-height: 1.6; padding: 1rem;" placeholder="Start typing or paste your text here..."></textarea>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 1rem; color: var(--text-secondary); font-size: 0.875rem;">
            <span id="wc-reading-time">Reading time: 0 min</span>
            <span id="wc-speaking-time">Speaking time: 0 min</span>
        </div>
    `;

    const input = document.getElementById('wc-input');
    const wordsEl = document.getElementById('wc-words');
    const charsEl = document.getElementById('wc-chars');
    const sentencesEl = document.getElementById('wc-sentences');
    const paragraphsEl = document.getElementById('wc-paragraphs');
    const readingTimeEl = document.getElementById('wc-reading-time');
    const speakingTimeEl = document.getElementById('wc-speaking-time');

    input.addEventListener('input', () => {
        const text = input.value;
        
        // Characters
        charsEl.textContent = text.length;
        
        if (!text.trim()) {
            wordsEl.textContent = '0';
            sentencesEl.textContent = '0';
            paragraphsEl.textContent = '0';
            readingTimeEl.textContent = 'Reading time: 0 min';
            speakingTimeEl.textContent = 'Speaking time: 0 min';
            return;
        }

        // Words
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        wordsEl.textContent = wordCount;

        // Sentences
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        sentencesEl.textContent = sentences.length;

        // Paragraphs
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
        paragraphsEl.textContent = paragraphs.length;

        // Reading time (avg 200 words per minute)
        const readingTime = Math.ceil(wordCount / 200);
        readingTimeEl.textContent = `Reading time: ${readingTime} min`;

        // Speaking time (avg 130 words per minute)
        const speakingTime = Math.ceil(wordCount / 130);
        speakingTimeEl.textContent = `Speaking time: ${speakingTime} min`;
    });
}

export function renderRandomNumberGenerator() {
    toolInterface.innerHTML = `
        <div style="max-width: 500px; margin: 0 auto; width: 100%;">
            <div class="result-box" style="display: flex; justify-content: center; align-items: center; margin-bottom: 2rem; background: var(--surface-color); border-color: var(--primary-color); border-width: 2px; min-height: 120px;">
                <span id="rng-result" style="font-size: 4rem; font-weight: 700; color: var(--primary-color); line-height: 1;">-</span>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div class="input-group">
                    <label for="rng-min">Minimum:</label>
                    <input type="number" id="rng-min" value="1" style="font-size: 1.125rem;">
                </div>
                <div class="input-group">
                    <label for="rng-max">Maximum:</label>
                    <input type="number" id="rng-max" value="100" style="font-size: 1.125rem;">
                </div>
            </div>
            
            <button class="btn" id="rng-generate" style="width: 100%; font-size: 1.125rem; padding: 1rem;">
                <i class="fa-solid fa-dice"></i> Generate Number
            </button>
        </div>
    `;

    document.getElementById('rng-generate').onclick = () => {
        const min = parseInt(document.getElementById('rng-min').value);
        const max = parseInt(document.getElementById('rng-max').value);
        const resultEl = document.getElementById('rng-result');
        
        if (isNaN(min) || isNaN(max)) {
            resultEl.textContent = 'Err';
            resultEl.style.fontSize = '2rem';
            return;
        }
        
        if (min > max) {
            resultEl.textContent = 'Min > Max';
            resultEl.style.fontSize = '2rem';
            return;
        }
        
        resultEl.style.fontSize = '4rem';
        
        // Add a little rolling animation
        let rolls = 0;
        const maxRolls = 10;
        const interval = setInterval(() => {
            resultEl.textContent = Math.floor(Math.random() * (max - min + 1)) + min;
            rolls++;
            if (rolls >= maxRolls) {
                clearInterval(interval);
                // Final result
                resultEl.textContent = Math.floor(Math.random() * (max - min + 1)) + min;
            }
        }, 50);
    };
}

export function renderPomodoroTimer() {
    toolInterface.innerHTML = `
        <div style="max-width: 400px; margin: 0 auto; text-align: center;">
            <div style="font-size: 6rem; font-weight: 700; color: var(--primary-color); font-variant-numeric: tabular-nums; line-height: 1; margin-bottom: 2rem;" id="pt-display">25:00</div>
            
            <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem;">
                <button class="btn" id="pt-start" style="width: 120px;"><i class="fa-solid fa-play"></i> Start</button>
                <button class="btn" id="pt-pause" style="width: 120px; display: none;"><i class="fa-solid fa-pause"></i> Pause</button>
                <button class="btn" id="pt-reset" style="width: 120px; background-color: var(--text-secondary);"><i class="fa-solid fa-rotate-right"></i> Reset</button>
            </div>
            
            <div style="display: flex; justify-content: center; gap: 0.5rem;">
                <button class="btn" id="pt-mode-work" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Work (25m)</button>
                <button class="btn" id="pt-mode-short" style="padding: 0.5rem 1rem; font-size: 0.875rem; background-color: var(--surface-color); color: var(--text-primary); border: 1px solid var(--border-color);">Short Break (5m)</button>
                <button class="btn" id="pt-mode-long" style="padding: 0.5rem 1rem; font-size: 0.875rem; background-color: var(--surface-color); color: var(--text-primary); border: 1px solid var(--border-color);">Long Break (15m)</button>
            </div>
        </div>
    `;

    let timeLeft = 25 * 60;
    let timerId = null;
    let isRunning = false;
    
    const display = document.getElementById('pt-display');
    const startBtn = document.getElementById('pt-start');
    const pauseBtn = document.getElementById('pt-pause');
    const resetBtn = document.getElementById('pt-reset');
    
    const modeWork = document.getElementById('pt-mode-work');
    const modeShort = document.getElementById('pt-mode-short');
    const modeLong = document.getElementById('pt-mode-long');
    
    let currentModeTime = 25 * 60;

    const updateDisplay = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const setMode = (btn, minutes) => {
        [modeWork, modeShort, modeLong].forEach(b => {
            b.style.backgroundColor = 'var(--surface-color)';
            b.style.color = 'var(--text-primary)';
            b.style.border = '1px solid var(--border-color)';
        });
        btn.style.backgroundColor = 'var(--primary-color)';
        btn.style.color = 'white';
        btn.style.border = 'none';
        
        currentModeTime = minutes * 60;
        timeLeft = currentModeTime;
        updateDisplay();
        pauseTimer();
    };

    const startTimer = () => {
        if (isRunning) return;
        isRunning = true;
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerId);
                isRunning = false;
                startBtn.style.display = 'block';
                pauseBtn.style.display = 'none';
                alert('Timer finished!');
                timeLeft = currentModeTime;
                updateDisplay();
            }
        }, 1000);
    };

    const pauseTimer = () => {
        clearInterval(timerId);
        isRunning = false;
        startBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
    };

    const resetTimer = () => {
        pauseTimer();
        timeLeft = currentModeTime;
        updateDisplay();
    };

    startBtn.onclick = startTimer;
    pauseBtn.onclick = pauseTimer;
    resetBtn.onclick = resetTimer;
    
    modeWork.onclick = () => setMode(modeWork, 25);
    modeShort.onclick = () => setMode(modeShort, 5);
    modeLong.onclick = () => setMode(modeLong, 15);
}

export function renderCountdownTimer() {
    toolInterface.innerHTML = `
        <div style="max-width: 400px; margin: 0 auto; text-align: center;">
            <div style="font-size: 5rem; font-weight: 700; color: var(--primary-color); font-variant-numeric: tabular-nums; line-height: 1; margin-bottom: 2rem;" id="cd-display">00:00:00</div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                <div class="input-group">
                    <label>Hours</label>
                    <input type="number" id="cd-h" value="0" min="0" max="99">
                </div>
                <div class="input-group">
                    <label>Minutes</label>
                    <input type="number" id="cd-m" value="5" min="0" max="59">
                </div>
                <div class="input-group">
                    <label>Seconds</label>
                    <input type="number" id="cd-s" value="0" min="0" max="59">
                </div>
            </div>
            
            <div style="display: flex; justify-content: center; gap: 1rem;">
                <button class="btn" id="cd-start" style="width: 120px;"><i class="fa-solid fa-play"></i> Start</button>
                <button class="btn" id="cd-pause" style="width: 120px; display: none;"><i class="fa-solid fa-pause"></i> Pause</button>
                <button class="btn" id="cd-reset" style="width: 120px; background-color: var(--text-secondary);"><i class="fa-solid fa-rotate-right"></i> Reset</button>
            </div>
        </div>
    `;

    let timeLeft = 0;
    let timerId = null;
    let isRunning = false;
    
    const display = document.getElementById('cd-display');
    const startBtn = document.getElementById('cd-start');
    const pauseBtn = document.getElementById('cd-pause');
    const resetBtn = document.getElementById('cd-reset');
    
    const inputH = document.getElementById('cd-h');
    const inputM = document.getElementById('cd-m');
    const inputS = document.getElementById('cd-s');

    const updateDisplay = () => {
        const h = Math.floor(timeLeft / 3600);
        const m = Math.floor((timeLeft % 3600) / 60);
        const s = timeLeft % 60;
        display.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const getSecondsFromInputs = () => {
        const h = parseInt(inputH.value) || 0;
        const m = parseInt(inputM.value) || 0;
        const s = parseInt(inputS.value) || 0;
        return (h * 3600) + (m * 60) + s;
    };

    const startTimer = () => {
        if (isRunning) return;
        
        if (timeLeft === 0) {
            timeLeft = getSecondsFromInputs();
            if (timeLeft === 0) return;
        }
        
        isRunning = true;
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        
        updateDisplay();
        
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerId);
                isRunning = false;
                startBtn.style.display = 'block';
                pauseBtn.style.display = 'none';
                alert('Time is up!');
            }
        }, 1000);
    };

    const pauseTimer = () => {
        clearInterval(timerId);
        isRunning = false;
        startBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
    };

    const resetTimer = () => {
        pauseTimer();
        timeLeft = 0;
        display.textContent = "00:00:00";
    };

    startBtn.onclick = startTimer;
    pauseBtn.onclick = pauseTimer;
    resetBtn.onclick = resetTimer;
    
    // Update display when inputs change if not running
    [inputH, inputM, inputS].forEach(input => {
        input.addEventListener('input', () => {
            if (!isRunning) {
                timeLeft = getSecondsFromInputs();
                updateDisplay();
            }
        });
    });
}

export function renderRandomNamePicker() {
    toolInterface.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
                <div class="input-group">
                    <label for="rnp-input">Enter names (one per line):</label>
                    <textarea id="rnp-input" style="height: 300px;" placeholder="Alice\nBob\nCharlie..."></textarea>
                </div>
                <button class="btn" id="rnp-pick" style="width: 100%; margin-top: 1rem; font-size: 1.125rem; padding: 1rem;">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Pick a Name
                </button>
            </div>
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background: var(--surface-color); border: 2px dashed var(--border-color); border-radius: 0.5rem; padding: 2rem; text-align: center;">
                <h3 style="color: var(--text-secondary); margin-bottom: 1rem;">Selected Name</h3>
                <div id="rnp-result" style="font-size: 3rem; font-weight: 700; color: var(--primary-color); word-break: break-all;">?</div>
            </div>
        </div>
    `;

    document.getElementById('rnp-pick').onclick = () => {
        const input = document.getElementById('rnp-input').value;
        const names = input.split('\n').map(n => n.trim()).filter(n => n !== '');
        const resultEl = document.getElementById('rnp-result');
        
        if (names.length === 0) {
            resultEl.textContent = 'No names provided';
            resultEl.style.fontSize = '1.5rem';
            return;
        }
        
        resultEl.style.fontSize = '3rem';
        
        // Rolling animation
        let rolls = 0;
        const maxRolls = 15;
        const interval = setInterval(() => {
            resultEl.textContent = names[Math.floor(Math.random() * names.length)];
            rolls++;
            if (rolls >= maxRolls) {
                clearInterval(interval);
                // Final result
                resultEl.textContent = names[Math.floor(Math.random() * names.length)];
                
                // Add a little pop animation
                resultEl.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    resultEl.style.transform = 'scale(1)';
                }, 200);
            }
        }, 50);
    };
}
