const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(BASE_DIR, 'templates');
const SECTIONS_DIR = path.join(BASE_DIR, 'sections');
const LAYOUT_DIR = path.join(BASE_DIR, 'layout');
const ASSETS_DIR = path.join(BASE_DIR, 'assets');
const OUTPUT_FILE = path.join(BASE_DIR, 'index.html');

function readLiquidFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`Warning: File not found ${filePath}`);
        return '';
    }
    return fs.readFileSync(filePath, 'utf8');
}

function processLiquid(content) {
    let changed = true;
    let passes = 0;
    const maxPasses = 5;

    while (changed && passes < maxPasses) {
        const oldContent = content;

        // 1. Replace {% section 'name' %} or {% section "name" %}
        content = content.replace(/{%\s*section\s*['"]([^'"]+)['"]\s*%}/g, (match, sectionName) => {
            console.log(`  - Injecting section: ${sectionName}`);
            const sectionPath = path.join(SECTIONS_DIR, `${sectionName}.liquid`);
            let sectionContent = readLiquidFile(sectionPath);
            // Remove schema blocks from sections
            sectionContent = sectionContent.replace(/{%\s*schema\s*%}.*?{%\s*endschema\s*%}/gs, '');
            return `\n<!-- Section: ${sectionName} -->\n${sectionContent}\n<!-- End Section: ${sectionName} -->\n`;
        });

        // 2. Replace {% render 'name' %}
        content = content.replace(/{%\s*render\s*['"]([^'"]+)['"]\s*%}/g, (match, snippetName) => {
            console.log(`  - Rendering snippet: ${snippetName}`);
            const snippetPath = path.join(BASE_DIR, 'snippets', `${snippetName}.liquid`);
            return readLiquidFile(snippetPath);
        });

        changed = oldContent !== content;
        passes++;
    }

    // 3. Replace {{ 'filename' | asset_url }} with assets/filename
    content = content.replace(/{{\s*['"]([^'"]+)['"]\s*\|\s*asset_url\s*}}/g, 'assets/$1');

    // 4. Handle other Liquid tags
    content = content.replace(/{%.*?%}/g, '');
    content = content.replace(/{{.*?}}/g, '');

    return content;
}

function buildIndex() {
    console.log('Building index.html from liquid templates...');

    // Load theme layout
    let theme = readLiquidFile(path.join(LAYOUT_DIR, 'theme.liquid'));

    // Replace content_for_layout with the processed index.liquid
    let indexTemplate = readLiquidFile(path.join(TEMPLATES_DIR, 'index.liquid'));
    let processedIndex = processLiquid(indexTemplate);

    let finalHtml = theme.replace('{{ content_for_layout }}', processedIndex);

    // Clean up theme-level liquid
    finalHtml = finalHtml.replace('{{ content_for_header }}', '<!-- content_for_header -->');
    finalHtml = finalHtml.replace(/{{\s*['"]([^'"]+)['"]\s*\|\s*asset_url\s*\|\s*stylesheet_tag\s*}}/g, '<link rel="stylesheet" href="assets/$1">');
    finalHtml = finalHtml.replace(/{{\s*['"]([^'"]+)['"]\s*\|\s*asset_url\s*\|\s*script_tag\s*\|\s*replace:\s*['"][^'"]+['"]\s*,\s*['"][^'"]+['"]\s*}}/g, '<script src="assets/$1" defer></script>');

    // Final generic cleanup
    finalHtml = processLiquid(finalHtml);

    fs.writeFileSync(OUTPUT_FILE, finalHtml);
    console.log(`Successfully updated ${OUTPUT_FILE}`);
}

buildIndex();
