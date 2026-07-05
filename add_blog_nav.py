import os

files = ['index.html', 'about.html', 'services.html', 'contact.html']

for filename in files:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the nav-links div
    start_idx = content.find('<div class="nav-links">')
    if start_idx == -1:
        continue
        
    end_idx = content.find('</div>', start_idx)
    nav_content = content[start_idx:end_idx]
    
    # Check if blog is already there
    if 'href="/blog"' in nav_content:
        continue

    # Insert blog link before the contact link
    # We look for <a href="/contact"
    contact_idx = nav_content.find('<a href="/contact"')
    if contact_idx != -1:
        new_blog_link = '    <a href="/blog" style="margin-left: 2rem; font-size: 0.9rem; text-transform: uppercase;">Blog</a>\n            '
        new_nav_content = nav_content[:contact_idx] + new_blog_link + nav_content[contact_idx:]
        
        content = content[:start_idx] + new_nav_content + content[end_idx:]
        
        # Also update the footer Company section if needed, replacing Partnerships with Blog if it hasn't been changed yet
        content = content.replace('<li><a href="#" style="transition: color 0.3s;">Partnerships</a></li>', 
                                  '<li><a href="/blog" style="transition: color 0.3s;">Blog</a></li>')

        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
            
print("Updated nav and footer in all pages.")
