import os

files = ['index.html', 'about.html', 'services.html', 'contact.html']

for filename in files:
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove nav links
        content = content.replace('<a href="/portfolio">Portfolio</a>\n', '')
        content = content.replace('<a href="/pricing">Pricing</a>\n', '')
        # Handle the styled links we generated
        content = content.replace('<a href="/portfolio" style="margin-left: 2rem; font-size: 0.9rem; text-transform: uppercase;">Portfolio</a>\n', '')
        content = content.replace('<a href="/pricing" style="margin-left: 2rem; font-size: 0.9rem; text-transform: uppercase;">Pricing</a>\n', '')
        
        content = content.replace('<a href="/portfolio" style="margin-left: 2rem; font-size: 0.9rem; text-transform: uppercase;" class="active-link">Portfolio</a>\n', '')
        content = content.replace('<a href="/pricing" style="margin-left: 2rem; font-size: 0.9rem; text-transform: uppercase;" class="active-link">Pricing</a>\n', '')
        
        # Remove from footer
        content = content.replace('<li><a href="/pricing">Enterprise Scaling</a></li>\n', '')

        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

# Delete the files
if os.path.exists('portfolio.html'):
    os.remove('portfolio.html')
if os.path.exists('pricing.html'):
    os.remove('pricing.html')

print("Removed Portfolio and Pricing.")
