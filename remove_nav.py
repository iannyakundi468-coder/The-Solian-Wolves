import os
import re

files = ['index.html', 'about.html', 'services.html', 'contact.html']

for filename in files:
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove lines that contain the portfolio or pricing links in the nav
        content = re.sub(r'^\s*<a href="/portfolio".*?</a>\s*$\n?', '', content, flags=re.MULTILINE)
        content = re.sub(r'^\s*<a href="/pricing".*?</a>\s*$\n?', '', content, flags=re.MULTILINE)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

# Delete the files
if os.path.exists('portfolio.html'):
    os.remove('portfolio.html')
if os.path.exists('pricing.html'):
    os.remove('pricing.html')

print("Removed Portfolio and Pricing.")
