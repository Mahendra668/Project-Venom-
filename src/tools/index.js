import { renderPdfToWord, renderWordToPdf, renderMergePdf, renderSplitPdf, renderCompressPdf } from './pdf.js';
import { renderImageCompressor, renderImageToPdf, renderResizeImage } from './image.js';
import { renderCaseConverter, renderRemoveDuplicateLines, renderTextCompare, renderTextSorter, renderReverseText, renderCharacterFrequency } from './text.js';
import { renderJsonFormatter, renderBase64Tool, renderUuidGenerator, renderHashGenerator } from './developer.js';
import { renderPasswordGenerator, renderAgeCalculator, renderUnitConverter, renderQrGenerator, renderCurrencyConverter, renderWordCounter, renderRandomNumberGenerator, renderPomodoroTimer, renderCountdownTimer, renderRandomNamePicker } from './utility.js';
import { renderTextSummarizer, renderPromptGenerator } from './ai.js';
import { renderFileMetadataViewer } from './file.js';

export const toolsData = [
    {
        id: 'pdf-to-word',
        name: 'PDF to Word',
        category: 'File & Document Tools',
        icon: 'fa-file-word',
        description: 'Convert PDF documents to editable Word files.',
        render: renderPdfToWord
    },
    {
        id: 'word-to-pdf',
        name: 'Word to PDF',
        category: 'File & Document Tools',
        icon: 'fa-file-pdf',
        description: 'Convert Word documents to PDF format.',
        render: renderWordToPdf
    },
    {
        id: 'merge-pdf',
        name: 'Merge PDF',
        category: 'File & Document Tools',
        icon: 'fa-object-group',
        description: 'Combine multiple PDFs into a single document.',
        render: renderMergePdf
    },
    {
        id: 'split-pdf',
        name: 'Split PDF',
        category: 'File & Document Tools',
        icon: 'fa-object-ungroup',
        description: 'Extract pages from your PDF or split it into smaller PDFs.',
        render: renderSplitPdf
    },
    {
        id: 'compress-pdf',
        name: 'Compress PDF',
        category: 'File & Document Tools',
        icon: 'fa-compress',
        description: 'Reduce the file size of your PDF documents.',
        render: renderCompressPdf
    },
    {
        id: 'file-metadata',
        name: 'File Metadata Viewer',
        category: 'File & Document Tools',
        icon: 'fa-circle-info',
        description: 'Display file information such as size, type, and last modified date.',
        render: renderFileMetadataViewer
    },
    {
        id: 'image-compressor',
        name: 'Image Compressor',
        category: 'Image Tools',
        icon: 'fa-compress',
        description: 'Reduce image file size without losing quality.',
        render: renderImageCompressor
    },
    {
        id: 'resize-image',
        name: 'Resize Image',
        category: 'Image Tools',
        icon: 'fa-expand',
        description: 'Change the dimensions of your images easily.',
        render: renderResizeImage
    },
    {
        id: 'image-to-pdf',
        name: 'Image to PDF',
        category: 'Image Tools',
        icon: 'fa-images',
        description: 'Convert JPG, PNG, and other images to PDF.',
        render: renderImageToPdf
    },
    {
        id: 'word-counter',
        name: 'Word Counter',
        category: 'Text Productivity Tools',
        icon: 'fa-keyboard',
        description: 'Count words, characters, sentences, and paragraphs in real-time.',
        render: renderWordCounter
    },
    {
        id: 'case-converter',
        name: 'Case Converter',
        category: 'Text Productivity Tools',
        icon: 'fa-font',
        description: 'Convert text to UPPERCASE, lowercase, Title Case, etc.',
        render: renderCaseConverter
    },
    {
        id: 'remove-duplicate-lines',
        name: 'Remove Duplicate Lines',
        category: 'Text Productivity Tools',
        icon: 'fa-list',
        description: 'Quickly remove duplicate lines from your text.',
        render: renderRemoveDuplicateLines
    },
    {
        id: 'text-compare',
        name: 'Text Compare',
        category: 'Text Productivity Tools',
        icon: 'fa-code-compare',
        description: 'Compare two text snippets and find the differences.',
        render: renderTextCompare
    },
    {
        id: 'text-sorter',
        name: 'Text Sorter',
        category: 'Text Productivity Tools',
        icon: 'fa-arrow-down-a-z',
        description: 'Sort text lines alphabetically or numerically.',
        render: renderTextSorter
    },
    {
        id: 'reverse-text',
        name: 'Reverse Text',
        category: 'Text Productivity Tools',
        icon: 'fa-arrow-right-arrow-left',
        description: 'Reverse characters or words in your text.',
        render: renderReverseText
    },
    {
        id: 'character-frequency',
        name: 'Character Frequency',
        category: 'Text Productivity Tools',
        icon: 'fa-chart-bar',
        description: 'Analyze the frequency of characters in your text.',
        render: renderCharacterFrequency
    },
    {
        id: 'json-formatter',
        name: 'JSON Formatter',
        category: 'Developer Tools',
        icon: 'fa-code',
        description: 'Format, validate, and beautify JSON data.',
        render: renderJsonFormatter
    },
    {
        id: 'base64-encoder',
        name: 'Base64 Encoder/Decoder',
        category: 'Developer Tools',
        icon: 'fa-hashtag',
        description: 'Encode text to Base64 or decode Base64 to text.',
        render: renderBase64Tool
    },
    {
        id: 'uuid-generator',
        name: 'UUID Generator',
        category: 'Developer Tools',
        icon: 'fa-fingerprint',
        description: 'Generate random UUIDs (Universally Unique Identifiers).',
        render: renderUuidGenerator
    },
    {
        id: 'hash-generator',
        name: 'Hash Generator',
        category: 'Developer Tools',
        icon: 'fa-lock',
        description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text.',
        render: renderHashGenerator
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        category: 'Everyday Utility Tools',
        icon: 'fa-key',
        description: 'Create strong, secure, and random passwords.',
        render: renderPasswordGenerator
    },
    {
        id: 'qr-generator',
        name: 'QR Code Generator',
        category: 'Everyday Utility Tools',
        icon: 'fa-qrcode',
        description: 'Generate QR codes for URLs, text, or contact info.',
        render: renderQrGenerator
    },
    {
        id: 'age-calculator',
        name: 'Age Calculator',
        category: 'Everyday Utility Tools',
        icon: 'fa-calendar-days',
        description: 'Calculate your exact age in years, months, and days.',
        render: renderAgeCalculator
    },
    {
        id: 'unit-converter',
        name: 'Unit Converter',
        category: 'Everyday Utility Tools',
        icon: 'fa-ruler',
        description: 'Convert between different units of measurement.',
        render: renderUnitConverter
    },
    {
        id: 'currency-converter',
        name: 'Currency Converter',
        category: 'Everyday Utility Tools',
        icon: 'fa-money-bill-transfer',
        description: 'Convert between different currencies using live exchange rates.',
        render: renderCurrencyConverter
    },
    {
        id: 'random-number-generator',
        name: 'Random Number Generator',
        category: 'Everyday Utility Tools',
        icon: 'fa-dice',
        description: 'Generate random numbers within a specified range.',
        render: renderRandomNumberGenerator
    },
    {
        id: 'pomodoro-timer',
        name: 'Pomodoro Timer',
        category: 'Everyday Utility Tools',
        icon: 'fa-stopwatch',
        description: 'Boost productivity with a 25-minute focus timer.',
        render: renderPomodoroTimer
    },
    {
        id: 'countdown-timer',
        name: 'Countdown Timer',
        category: 'Everyday Utility Tools',
        icon: 'fa-hourglass-half',
        description: 'Set a custom countdown timer for your tasks.',
        render: renderCountdownTimer
    },
    {
        id: 'random-name-picker',
        name: 'Random Name Picker',
        category: 'Everyday Utility Tools',
        icon: 'fa-users',
        description: 'Pick a random name from a list of names.',
        render: renderRandomNamePicker
    },
    {
        id: 'text-summarizer',
        name: 'Text Summarizer',
        category: 'AI-Inspired Tools',
        icon: 'fa-wand-magic-sparkles',
        description: 'Summarize long text into key points (Simulated AI).',
        render: renderTextSummarizer
    },
    {
        id: 'prompt-generator',
        name: 'Prompt Generator',
        category: 'AI-Inspired Tools',
        icon: 'fa-lightbulb',
        description: 'Generate effective prompts for AI tools.',
        render: renderPromptGenerator
    }
];
