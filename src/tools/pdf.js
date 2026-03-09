import { loadScript, renderFileTool } from '../core/utils.js';

export function renderPdfToWord() {
    renderFileTool({
        accept: '.pdf',
        multiple: false,
        uploadText: 'Choose a PDF file or drag it here',
        buttonText: 'Convert to Word',
        buttonIcon: 'fa-file-word',
        onProcess: async (files, updateProgress) => {
            updateProgress(5, 'Loading required libraries...');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
            if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }
            await loadScript('https://unpkg.com/docx@8.5.0/build/index.js');
            
            if (!window.pdfjsLib || !window.docx) throw new Error('Required libraries failed to load.');
            
            const arrayBuffer = await files[0].arrayBuffer();
            updateProgress(10, 'Reading PDF...');
            const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
            const numPages = pdf.numPages;
            const docChildren = [];
            
            for (let i = 1; i <= numPages; i++) {
                updateProgress(10 + Math.floor((i / numPages) * 70), `Extracting page ${i} of ${numPages}...`);
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                let lastY = -1;
                let currentParagraph = [];
                
                for (const item of textContent.items) {
                    if (lastY !== -1 && Math.abs(lastY - item.transform[5]) > 5) {
                        if (currentParagraph.length > 0) {
                            docChildren.push(new window.docx.Paragraph({ children: [new window.docx.TextRun(currentParagraph.join(' '))] }));
                            currentParagraph = [];
                        }
                    }
                    if (item.str.trim() !== '') currentParagraph.push(item.str);
                    lastY = item.transform[5];
                }
                
                if (currentParagraph.length > 0) {
                    docChildren.push(new window.docx.Paragraph({ children: [new window.docx.TextRun(currentParagraph.join(' '))] }));
                }
                if (i < numPages) {
                    docChildren.push(new window.docx.Paragraph({ children: [new window.docx.PageBreak()] }));
                }
            }

            updateProgress(90, 'Generating Word Document...');
            const doc = new window.docx.Document({
                sections: [{ properties: {}, children: docChildren.length > 0 ? docChildren : [new window.docx.Paragraph({ children: [new window.docx.TextRun("No text found.")] })] }]
            });

            const blob = await window.docx.Packer.toBlob(doc);
            window.saveAs(blob, files[0].name.replace(/\.pdf$/i, '.docx'));
        }
    });
}

export function renderWordToPdf() {
    renderFileTool({
        accept: '.docx',
        multiple: false,
        uploadText: 'Choose a Word document or drag it here',
        buttonText: 'Convert to PDF',
        buttonIcon: 'fa-file-pdf',
        onProcess: async (files, updateProgress) => {
            updateProgress(10, 'Loading required libraries...');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.21/mammoth.browser.min.js');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
            
            if (!window.mammoth || !window.jspdf) throw new Error("Libraries failed to load.");
            updateProgress(20, 'Reading Word document...');
            const arrayBuffer = await files[0].arrayBuffer();
            const result = await window.mammoth.convertToHtml({arrayBuffer});
            updateProgress(50, 'Generating PDF...');
            
            const doc = new window.jspdf.jsPDF();
            
            const hiddenDiv = document.createElement('div');
            hiddenDiv.innerHTML = result.value || "No content found.";
            hiddenDiv.style.width = '800px';
            hiddenDiv.style.padding = '20px';
            hiddenDiv.style.position = 'absolute';
            hiddenDiv.style.left = '-9999px';
            document.body.appendChild(hiddenDiv);
            
            await new Promise((resolve, reject) => {
                doc.html(hiddenDiv, {
                    callback: function (doc) {
                        doc.save(files[0].name.replace(/\.docx$/i, '.pdf'));
                        document.body.removeChild(hiddenDiv);
                        resolve();
                    },
                    x: 10, y: 10, width: 190, windowWidth: 800
                }).catch(err => {
                    document.body.removeChild(hiddenDiv);
                    reject(err);
                });
            });
        }
    });
}

export function renderMergePdf() {
    renderFileTool({
        accept: '.pdf',
        multiple: true,
        uploadText: 'Choose PDF files to merge',
        uploadSubtext: 'Select multiple files to combine them',
        buttonText: 'Merge PDFs',
        buttonIcon: 'fa-object-group',
        onProcess: async (files, updateProgress) => {
            updateProgress(5, 'Loading required libraries...');
            await loadScript('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js');
            
            if (!window.PDFLib) throw new Error("PDFLib failed to load");
            if (files.length < 2) throw new Error("Please select at least 2 PDF files.");
            
            updateProgress(10, 'Initializing...');
            const mergedPdf = await window.PDFLib.PDFDocument.create();
            
            for (let i = 0; i < files.length; i++) {
                updateProgress(10 + (i / files.length) * 80, `Merging file ${i + 1} of ${files.length}...`);
                const pdfBytes = await files[i].arrayBuffer();
                const pdf = await window.PDFLib.PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            
            updateProgress(95, 'Saving merged PDF...');
            const mergedPdfBytes = await mergedPdf.save();
            window.saveAs(new Blob([mergedPdfBytes], { type: 'application/pdf' }), 'merged.pdf');
        }
    });
}

export function renderCompressPdf() {
    renderFileTool({
        accept: '.pdf',
        multiple: false,
        uploadText: 'Choose a PDF to compress',
        buttonText: 'Compress PDF',
        buttonIcon: 'fa-compress',
        onProcess: async (files, updateProgress) => {
            updateProgress(5, 'Loading required libraries...');
            await loadScript('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js');
            
            if (!window.PDFLib) throw new Error("Libraries failed to load");
            
            updateProgress(10, 'Reading PDF...');
            const pdfBytes = await files[0].arrayBuffer();
            const pdf = await window.PDFLib.PDFDocument.load(pdfBytes);
            
            // Basic compression by removing unnecessary objects
            updateProgress(50, 'Compressing PDF...');
            
            const compressedPdfBytes = await pdf.save({
                useObjectStreams: false,
                addDefaultPage: false,
                objectsPerTick: 50,
            });
            
            updateProgress(95, 'Downloading...');
            window.saveAs(new Blob([compressedPdfBytes], { type: 'application/pdf' }), files[0].name.replace(/\.pdf$/i, '_compressed.pdf'));
        }
    });
}

export function renderSplitPdf() {
    renderFileTool({
        accept: '.pdf',
        multiple: false,
        uploadText: 'Choose a PDF to split',
        buttonText: 'Split PDF (ZIP)',
        buttonIcon: 'fa-object-ungroup',
        onProcess: async (files, updateProgress) => {
            updateProgress(5, 'Loading required libraries...');
            await loadScript('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
            
            if (!window.PDFLib || !window.JSZip) throw new Error("Libraries failed to load");
            
            updateProgress(10, 'Reading PDF...');
            const pdfBytes = await files[0].arrayBuffer();
            const pdf = await window.PDFLib.PDFDocument.load(pdfBytes);
            const numPages = pdf.getPageCount();
            
            const zip = new window.JSZip();
            
            for (let i = 0; i < numPages; i++) {
                updateProgress(10 + (i / numPages) * 70, `Splitting page ${i + 1} of ${numPages}...`);
                const newPdf = await window.PDFLib.PDFDocument.create();
                const [copiedPage] = await newPdf.copyPages(pdf, [i]);
                newPdf.addPage(copiedPage);
                const newPdfBytes = await newPdf.save();
                zip.file(`page_${i + 1}.pdf`, newPdfBytes);
            }
            
            updateProgress(85, 'Zipping files...');
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            updateProgress(95, 'Downloading...');
            window.saveAs(zipBlob, files[0].name.replace(/\.pdf$/i, '_split.zip'));
        }
    });
}
