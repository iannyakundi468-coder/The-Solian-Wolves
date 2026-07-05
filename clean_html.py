import os
import re
import glob

# Pattern for hero-badge with neon backgrounds
badge_pattern1 = re.compile(r'style="display: inline-block; margin-bottom: 1.5rem; background: rgba\(\d+, \d+, \d+, 0\.1\); border: 1px solid rgba\(\d+, \d+, \d+, 0\.2\); border-radius: 100px; padding: 0\.4rem 1rem; color: #[0-9a-fA-F]+; font-size: 0\.8rem; font-weight: 600; text-transform: uppercase;"')

badge_pattern2 = re.compile(r'style="display: inline-block; margin-bottom: 1.5rem; background: rgba\(\d+, \d+, \d+, 0\.1\); border: 1px solid rgba\(\d+, \d+, \d+, 0\.2\); border-radius: 100px; padding: 0\.4rem 1rem; color: #[0-9a-fA-F]+; font-size: 0\.8rem; font-weight: 600; text-transform: uppercase; font-family: \'Fira Code\', monospace;"')

# Pattern for text gradients
gradient_pattern = re.compile(r'class="text-gradient"\s+style="background: linear-gradient\([^)]+\); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;"')

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replace neon badge styles with flat, subtle style
    flat_badge_style = 'style="display: inline-block; margin-bottom: 1.5rem; color: #777; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;"'
    content = badge_pattern1.sub(flat_badge_style, content)
    
    flat_badge_style_mono = 'style="display: inline-block; margin-bottom: 1.5rem; color: #777; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; font-family: \'Fira Code\', monospace;"'
    content = badge_pattern2.sub(flat_badge_style_mono, content)
    
    # Also find multiline hero-badge in some files like contact.html, services.html
    # We will just replace any inline text-shadow or linear-gradient.
    content = re.sub(r'style="[^"]*text-shadow:\s*0\s*0\s*20px[^"]*"', '', content)
    content = re.sub(r'class="text-gradient"[^>]*>', 'style="color: #fff;">', content)

    # Some multiline hero-badges might look like this:
    multiline_badge_pattern = re.compile(
        r'<div class="hero-badge"[^>]*>\s*<span\s*style="color:\s*#[0-9a-fA-F]+;\s*font-size:\s*0\.8rem;\s*font-weight:\s*700;\s*letter-spacing:\s*0\.1em;\s*text-transform:\s*uppercase;">(.*?)</span>\s*</div>',
        re.DOTALL
    )
    
    def badge_repl(match):
        text = match.group(1).strip()
        return f'<div class="hero-badge animate-on-scroll" style="display: inline-block; margin-bottom: 1.5rem;"><span style="color: #777; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;">{text}</span></div>'

    content = multiline_badge_pattern.sub(badge_repl, content)

    with open(filepath, 'w') as f:
        f.write(content)

for filepath in glob.glob('*.html'):
    update_file(filepath)
    print(f"Updated {filepath}")
