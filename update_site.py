import os

files = ['index.html', 'about.html', 'services.html', 'portfolio.html', 'pricing.html', 'contact.html']

for filename in files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update navigation links to be extensionless paths
    content = content.replace('href="index.html"', 'href="/"')
    content = content.replace('href="about.html"', 'href="/about"')
    content = content.replace('href="services.html"', 'href="/services"')
    content = content.replace('href="portfolio.html"', 'href="/portfolio"')
    content = content.replace('href="pricing.html"', 'href="/pricing"')
    content = content.replace('href="contact.html"', 'href="/contact"')
    
    # 2. Add .mobile-carousel to grids
    content = content.replace('class="services-grid"', 'class="services-grid mobile-carousel"')
    content = content.replace('class="portfolio-grid"', 'class="portfolio-grid mobile-carousel"')
    content = content.replace('class="pricing-grid"', 'class="pricing-grid mobile-carousel"')
    content = content.replace('class="team-grid"', 'class="team-grid mobile-carousel"')
    
    # Fix the blog grid which is inline-styled without a class
    content = content.replace(
        '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">',
        '<div class="mobile-carousel" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">'
    )
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Updated all HTML files.")
