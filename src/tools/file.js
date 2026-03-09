import { renderFileTool } from '../core/utils.js';
import { toolInterface } from '../core/dom.js';

export function renderFileMetadataViewer() {
    renderFileTool({
        accept: '*/*',
        multiple: false,
        uploadText: 'Choose any file to view metadata',
        buttonText: 'View Metadata',
        buttonIcon: 'fa-circle-info',
        onProcess: async (files, updateProgress) => {
            const file = files[0];
            
            toolInterface.innerHTML = `
                <div style="max-width: 600px; margin: 0 auto;">
                    <h3 style="margin-bottom: 1.5rem; color: var(--text-primary);"><i class="fa-solid fa-file"></i> File Information</h3>
                    <div style="background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 0.5rem; overflow: hidden;">
                        <div style="display: grid; grid-template-columns: 150px 1fr; border-bottom: 1px solid var(--border-color);">
                            <div style="padding: 1rem; background: var(--bg-color); font-weight: 600; color: var(--text-secondary);">Name</div>
                            <div style="padding: 1rem; color: var(--text-primary); word-break: break-all;">${file.name}</div>
                        </div>
                        <div style="display: grid; grid-template-columns: 150px 1fr; border-bottom: 1px solid var(--border-color);">
                            <div style="padding: 1rem; background: var(--bg-color); font-weight: 600; color: var(--text-secondary);">Size</div>
                            <div style="padding: 1rem; color: var(--text-primary);">${formatBytes(file.size)}</div>
                        </div>
                        <div style="display: grid; grid-template-columns: 150px 1fr; border-bottom: 1px solid var(--border-color);">
                            <div style="padding: 1rem; background: var(--bg-color); font-weight: 600; color: var(--text-secondary);">Type</div>
                            <div style="padding: 1rem; color: var(--text-primary);">${file.type || 'Unknown'}</div>
                        </div>
                        <div style="display: grid; grid-template-columns: 150px 1fr;">
                            <div style="padding: 1rem; background: var(--bg-color); font-weight: 600; color: var(--text-secondary);">Last Modified</div>
                            <div style="padding: 1rem; color: var(--text-primary);">${new Date(file.lastModified).toLocaleString()}</div>
                        </div>
                    </div>
                    <button class="btn" style="margin-top: 1.5rem; width: 100%;" onclick="window.closeTool()">Back to Tools</button>
                </div>
            `;
        }
    });
}

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
