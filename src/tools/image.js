import { loadScript, renderFileTool } from '../core/utils.js';

export function renderImageCompressor() {
    renderFileTool({
        accept: 'image/*',
        multiple: true,
        uploadText: 'Choose images to compress',
        buttonText: 'Compress Images',
        buttonIcon: 'fa-compress',
        onProcess: async (files, updateProgress) => {
            updateProgress(5, 'Loading required libraries...');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
            
            if (!window.JSZip) throw new Error("JSZip failed to load");
            
            const zip = new window.JSZip();
            const isMultiple = files.length > 1;
            
            for (let i = 0; i < files.length; i++) {
                updateProgress((i / files.length) * 90, `Compressing image ${i + 1} of ${files.length}...`);
                const file = files[i];
                
                const compressedBlob = await new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob(resolve, 'image/jpeg', 0.6); // 60% quality
                    };
                    img.src = URL.createObjectURL(file);
                });
                
                if (isMultiple) {
                    zip.file(file.name.replace(/\.[^/.]+$/, ".jpg"), compressedBlob);
                } else {
                    window.saveAs(compressedBlob, file.name.replace(/\.[^/.]+$/, "_compressed.jpg"));
                    return;
                }
            }
            
            if (isMultiple) {
                updateProgress(90, 'Zipping files...');
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                window.saveAs(zipBlob, 'compressed_images.zip');
            }
        }
    });
}

export function renderResizeImage() {
    renderFileTool({
        accept: 'image/*',
        multiple: false,
        uploadText: 'Choose an image to resize',
        buttonText: 'Resize Image',
        buttonIcon: 'fa-expand',
        onProcess: async (files, updateProgress) => {
            updateProgress(10, 'Reading image...');
            const file = files[0];
            
            const resizedBlob = await new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    // Resize to 50% for demonstration
                    canvas.width = img.width * 0.5;
                    canvas.height = img.height * 0.5;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(resolve, file.type);
                };
                img.src = URL.createObjectURL(file);
            });
            
            updateProgress(90, 'Downloading...');
            window.saveAs(resizedBlob, file.name.replace(/\.[^/.]+$/, "_resized" + file.name.match(/\.[^/.]+$/)[0]));
        }
    });
}

export function renderImageToPdf() {
    renderFileTool({
        accept: 'image/*',
        multiple: true,
        uploadText: 'Choose images to convert to PDF',
        buttonText: 'Generate PDF',
        buttonIcon: 'fa-images',
        onProcess: async (files, updateProgress) => {
            updateProgress(5, 'Loading required libraries...');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            
            if (!window.jspdf) throw new Error("jsPDF failed to load");
            
            updateProgress(10, 'Initializing PDF...');
            const doc = new window.jspdf.jsPDF();
            
            for (let i = 0; i < files.length; i++) {
                updateProgress(10 + (i / files.length) * 80, `Adding image ${i + 1} of ${files.length}...`);
                const file = files[i];
                
                const imgData = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
                
                const imgProps = doc.getImageProperties(imgData);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                if (i > 0) doc.addPage();
                doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            }
            
            updateProgress(95, 'Saving PDF...');
            doc.save('images.pdf');
        }
    });
}
