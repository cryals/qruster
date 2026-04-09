// Custom JavaScript for Media Downloader documentation

(function() {
    'use strict';

    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add copy button to code blocks
    function addCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre > code');
        codeBlocks.forEach((codeBlock) => {
            const pre = codeBlock.parentElement;
            const button = document.createElement('button');
            button.className = 'copy-button';
            button.textContent = 'Copy';
            button.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                padding: 4px 12px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.2s;
            `;

            pre.style.position = 'relative';
            pre.appendChild(button);

            pre.addEventListener('mouseenter', () => {
                button.style.opacity = '1';
            });

            pre.addEventListener('mouseleave', () => {
                button.style.opacity = '0';
            });

            button.addEventListener('click', async () => {
                const code = codeBlock.textContent;
                try {
                    await navigator.clipboard.writeText(code);
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = 'Copy';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });
        });
    }

    // Add language badges to code blocks
    function addLanguageBadges() {
        const codeBlocks = document.querySelectorAll('pre > code[class*="language-"]');
        codeBlocks.forEach((codeBlock) => {
            const className = codeBlock.className;
            const match = className.match(/language-(\w+)/);
            if (match) {
                const language = match[1];
                const badge = document.createElement('span');
                badge.textContent = language;
                badge.style.cssText = `
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    padding: 2px 8px;
                    background: rgba(103, 80, 164, 0.8);
                    color: white;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                `;
                codeBlock.parentElement.appendChild(badge);
            }
        });
    }

    // Add anchor links to headings
    function addAnchorLinks() {
        const headings = document.querySelectorAll('h2, h3, h4, h5, h6');
        headings.forEach((heading) => {
            if (heading.id) {
                const link = document.createElement('a');
                link.className = 'anchor-link';
                link.href = '#' + heading.id;
                link.innerHTML = '🔗';
                link.style.cssText = `
                    margin-left: 8px;
                    opacity: 0;
                    transition: opacity 0.2s;
                    text-decoration: none;
                    font-size: 0.8em;
                `;
                heading.appendChild(link);

                heading.addEventListener('mouseenter', () => {
                    link.style.opacity = '0.5';
                });

                heading.addEventListener('mouseleave', () => {
                    link.style.opacity = '0';
                });

                link.addEventListener('mouseenter', () => {
                    link.style.opacity = '1';
                });
            }
        });
    }

    // Add "Back to top" button
    function addBackToTop() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'back-to-top';
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s, transform 0.2s;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        `;

        document.body.appendChild(button);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.style.opacity = '1';
            } else {
                button.style.opacity = '0';
            }
        });

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    }

    // Initialize all features when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        addCopyButtons();
        addLanguageBadges();
        addAnchorLinks();
        addBackToTop();
    }

    // Re-initialize on page navigation (for SPA-like behavior)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                init();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
