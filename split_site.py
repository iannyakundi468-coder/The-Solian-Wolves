import os

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

html = read_file('index.html')

# Extract sections based on known HTML comments
def extract_between(text, start_marker, end_marker):
    start_idx = text.find(start_marker)
    if start_idx == -1: return ""
    
    if end_marker:
        end_idx = text.find(end_marker, start_idx)
        if end_idx == -1: end_idx = len(text)
    else:
        end_idx = len(text)
        
    return text[start_idx:end_idx]

header_part = html[:html.find('<!-- Hero -->')]
hero_section = extract_between(html, '<!-- Hero -->', '<!-- About -->')
about_section = extract_between(html, '<!-- About -->', '<!-- Services -->')
services_section = extract_between(html, '<!-- Services -->', '<!-- Detailed Service Blocks (Deep Dive) -->')
details_section = extract_between(html, '<!-- Detailed Service Blocks (Deep Dive) -->', '<!-- Portfolio -->')
portfolio_section = extract_between(html, '<!-- Portfolio -->', '<!-- Pricing -->')
pricing_section = extract_between(html, '<!-- Pricing -->', '<!-- Team -->')
team_section = extract_between(html, '<!-- Team -->', '<!-- Blog -->')
blog_section = extract_between(html, '<!-- Blog -->', '<!-- Contact -->')
contact_section = extract_between(html, '<!-- Contact -->', '<!-- Footer -->')
footer_part = extract_between(html, '<!-- Footer -->', None)

# Update navigation in header
new_nav = """    <nav class="main-nav">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; font-size: 1.2rem; letter-spacing: -0.02em;">THE SOLIAN WOLVES SOFTWARE COMPANY</div>
            
            <!-- Mobile Menu Toggle -->
            <button id="mobile-menu-btn" aria-label="Toggle Menu" style="display: none; background: transparent; border: none; color: white; cursor: pointer;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>

            <div class="nav-links">
                <a href="index.html" style="margin-left: 2rem; font-size: 0.9rem; text-transform: uppercase;">Home</a>
                <a href="about.html" style="margin-left: 2rem; font-size: 0.9rem; text-transform: uppercase;">About</a>
                <a href="services.html" style="margin-left: 2rem; font-size: 0.9rem; text-transform: uppercase;">Services</a>
                <a href="portfolio.html" style="margin-left: 2rem; font-size: 0.9rem; text-transform: uppercase;">Portfolio</a>
                <a href="pricing.html" style="margin-left: 2rem; font-size: 0.9rem; text-transform: uppercase;">Pricing</a>
                <a href="contact.html" class="btn btn-outline" style="padding: 0.6rem 1.8rem; margin-left: 2rem;">Contact</a>
            </div>
        </div>
    </nav>"""

# Replace the old nav with the new nav
start_nav = header_part.find('<nav class="main-nav">')
end_nav = header_part.find('</nav>') + 6
header_part = header_part[:start_nav] + new_nav + header_part[end_nav:]

# Build the pages
pages = {
    'index.html': hero_section,
    'about.html': about_section + team_section,
    'services.html': services_section + details_section,
    'portfolio.html': portfolio_section + blog_section,
    'pricing.html': pricing_section,
    'contact.html': contact_section
}

for filename, content in pages.items():
    full_html = header_part + content + footer_part
    # Highlight the active link
    active_href = f'href="{filename}"'
    full_html = full_html.replace(active_href, f'{active_href} class="active-link"')
    write_file(filename, full_html)
    print(f"Generated {filename}")

print("Done splitting pages.")
