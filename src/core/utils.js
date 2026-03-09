import { toolInterface } from './dom.js';

const loadedScripts = new Set();
export function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (loadedScripts.has(src)) return resolve();
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            loadedScripts.add(src);
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

export function copyToClipboard(text, btnElement) {
    if (!text || text.includes('loading') || text.includes('not supported')) return;
    navigator.clipboard.writeText(text);
    const originalHtml = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    setTimeout(() => btnElement.innerHTML = originalHtml, 2000);
}

export function renderFileTool(options) {
    const {
        accept = "*",
        multiple = false,
        maxSize = 10 * 1024 * 1024,
        uploadText = "Choose a file or drag it here",
        uploadSubtext = "Maximum file size: 10MB",
        buttonText = "Process File",
        buttonIcon = "fa-gear",
        onProcess // async function(files, updateProgress)
    } = options;

    toolInterface.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; width: 100%;">
            <div id="tool-upload-area" class="file-upload-area">
                <input type="file" id="tool-input" class="file-input" accept="${accept}" ${multiple ? 'multiple' : ''}>
                <i class="fa-solid fa-cloud-arrow-up file-upload-icon"></i>
                <h3 class="file-upload-text">${uploadText}</h3>
                <p class="file-upload-subtext">${uploadSubtext}</p>
            </div>

            <div id="tool-preview" class="file-preview" style="flex-direction: column; align-items: stretch; display: none;">
                <div id="file-list" style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 250px; overflow-y: auto; padding-right: 0.5rem;"></div>
                <button id="tool-remove" class="btn" style="background-color: var(--text-secondary); margin-top: 1rem;">
                    <i class="fa-solid fa-trash-can"></i> Clear Selection
                </button>
            </div>

            <div id="tool-progress" class="progress-container">
                <div class="progress-bar">
                    <div id="tool-progress-fill" class="progress-fill"></div>
                </div>
                <div id="tool-progress-text" class="progress-text">Processing... 0%</div>
            </div>

            <button class="btn" id="tool-action-btn" style="width: 100%; margin-top: 1.5rem; font-size: 1.125rem; padding: 1rem; display: none;">
                <i class="fa-solid ${buttonIcon}"></i> ${buttonText}
            </button>
            
            <div id="tool-error" style="color: #ef4444; margin-top: 1rem; text-align: center; display: none; font-weight: 500;"></div>
        </div>
    `;

    const uploadArea = document.getElementById('tool-upload-area');
    const fileInput = document.getElementById('tool-input');
    const preview = document.getElementById('tool-preview');
    const fileList = document.getElementById('file-list');
    const removeBtn = document.getElementById('tool-remove');
    const actionBtn = document.getElementById('tool-action-btn');
    const progressContainer = document.getElementById('tool-progress');
    const progressFill = document.getElementById('tool-progress-fill');
    const progressText = document.getElementById('tool-progress-text');
    const errorMsg = document.getElementById('tool-error');

    let currentFiles = [];

    // Drag and Drop Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
    });

    uploadArea.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));
    fileInput.addEventListener('change', function() { handleFiles(this.files); });

    function handleFiles(files) {
        errorMsg.style.display = 'none';
        if (files.length === 0) return;
        
        const newFiles = Array.from(files);
        let validFiles = [];
        
        for (const file of newFiles) {
            if (file.size > maxSize) {
                showError(`File ${file.name} exceeds size limit.`);
                continue;
            }
            validFiles.push(file);
        }

        if (!multiple) validFiles = validFiles.slice(0, 1);
        
        if (validFiles.length > 0) {
            currentFiles = multiple ? [...currentFiles, ...validFiles] : validFiles;
            updateFilePreview();
        }
    }

    function updateFilePreview() {
        if (currentFiles.length === 0) {
            uploadArea.style.display = 'block';
            preview.style.display = 'none';
            actionBtn.style.display = 'none';
            return;
        }

        fileList.innerHTML = currentFiles.map(file => `
            <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: var(--bg-color); border-radius: 0.5rem; border: 1px solid var(--border-color);">
                <i class="fa-solid fa-file" style="color: var(--primary-color); font-size: 1.5rem;"></i>
                <div style="flex: 1; overflow: hidden;">
                    <div style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${file.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">${formatBytes(file.size)}</div>
                </div>
            </div>
        `).join('');

        uploadArea.style.display = multiple ? 'block' : 'none';
        preview.style.display = 'flex';
        actionBtn.style.display = 'inline-flex';
        progressContainer.classList.remove('active');
    }

    removeBtn.addEventListener('click', () => {
        currentFiles = [];
        fileInput.value = '';
        updateFilePreview();
        errorMsg.style.display = 'none';
    });

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    function updateProgress(percent, text) {
        progressFill.style.width = `${percent}%`;
        if (text) progressText.textContent = text;
    }

    actionBtn.addEventListener('click', async () => {
        if (currentFiles.length === 0) return;

        actionBtn.disabled = true;
        const originalHtml = actionBtn.innerHTML;
        actionBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        progressContainer.classList.add('active');
        errorMsg.style.display = 'none';
        updateProgress(0, 'Starting...');
        
        try {
            await onProcess(currentFiles, updateProgress);
            
            updateProgress(100, 'Done!');
            setTimeout(() => {
                actionBtn.disabled = false;
                actionBtn.innerHTML = originalHtml;
                progressContainer.classList.remove('active');
                updateProgress(0, '');
            }, 2000);
        } catch (err) {
            console.error(err);
            showError('An error occurred: ' + err.message);
            actionBtn.disabled = false;
            actionBtn.innerHTML = originalHtml;
            progressContainer.classList.remove('active');
        }
    });
}
