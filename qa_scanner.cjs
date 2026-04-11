const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });

  page.on('pageerror', exception => {
    errors.push(`Uncaught Exception: ${exception.message}`);
  });

  let responseErrors = 0;
  page.on('response', response => {
    if (response.status() >= 400 && response.status() !== 999) {
      // ignore known tracking blocking sometimes
      errors.push(`Failed Request: ${response.url()} (${response.status()})`);
    }
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    errors.push(`Failed to load page: ${e.message}`);
  }

  // Check for horizontal overflow
  const viewports = [
    { width: 390, height: 844 }, // Mobile
    { width: 768, height: 1024 }, // Tablet
    { width: 1440, height: 900 } // Desktop
  ];

  for (const vp of viewports) {
    await page.setViewportSize(vp);
    await page.waitForTimeout(500); // Wait for reflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      return docWidth > winWidth;
    });
    
    if (hasHorizontalOverflow) {
      errors.push(`Layout Issue: Horizontal scroll exists at ${vp.width}px. This usually means an element is overflowing.`);
      
      const overflowingElements = await page.evaluate(() => {
        const bodyWidth = document.body.getBoundingClientRect().width;
        let els = [];
        document.querySelectorAll('*').forEach(el => {
          if (el.getBoundingClientRect().right > bodyWidth) {
            els.push(el.tagName + '.' + el.className);
          }
        });
        return els.slice(0, 5); // take max 5
      });
      if (overflowingElements.length > 0) {
         errors.push(`Overflowing elements at ${vp.width}px: ` + overflowingElements.join(', '));
      }
    }
  }

  // Evaluate DOM for broken images
  const brokenImages = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => img.src).filter(src => !src || src.endsWith('undefined') || src.includes('null'));
  });
  if (brokenImages.length > 0) {
    errors.push(`Broken Images (missing/null src): ${brokenImages.length} found`);
  }

  // Check for untranslated text like keys directly shown
  const rawTextIssues = await page.evaluate(() => {
    const issues = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while(node = walk.nextNode()) {
      if (node.nodeValue.match(/[a-z]+\.[a-z]+\.[a-z]+/i)) { // looking for keys like nav.home.etc
        if(!node.nodeValue.includes(' ') && node.nodeValue.includes('.')) {
          issues.push(node.nodeValue.trim());
        }
      }
    }
    return [...new Set(issues)].slice(0, 5);
  });
  if (rawTextIssues.length > 0) {
     errors.push(`Possible untranslated keys found: ${rawTextIssues.join(', ')}`);
  }

  // Check for broken links
  const brokenLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => a.getAttribute('href')).filter(href => !href || href === '#');
  });
  if (brokenLinks.length > 0) {
    errors.push(`Broken or empty links (href="#"): ${brokenLinks.length} found`);
  }

  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim() || 'icon');
  });

  console.log("=== QA REPORT ===");
  if (errors.length === 0) {
    console.log("No major technical errors found.");
  } else {
    for (const error of errors) {
      console.log("- " + error);
    }
  }
  
  await browser.close();
})();
