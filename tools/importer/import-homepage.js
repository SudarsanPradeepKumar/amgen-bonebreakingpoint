/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import heroCtaParser from './parsers/hero-cta.js';
import columnsPromoParser from './parsers/columns-promo.js';
import accordionQuizParser from './parsers/accordion-quiz.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/bonebreakingpoint-cleanup.js';
import sectionsTransformer from './transformers/bonebreakingpoint-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'hero-cta': heroCtaParser,
  'columns-promo': columnsPromoParser,
  'accordion-quiz': accordionQuizParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  urls: [
    'https://www.bonebreakingpoint.com/',
  ],
  description: 'Homepage template for Bone Breaking Point website',
  blocks: [
    {
      name: 'hero-banner',
      instances: [
        '.component.plain-html.banner-text',
        '#doing-all > .component-content > .component.promo.Osteoporosis-promo',
      ],
    },
    {
      name: 'columns-promo',
      instances: [
        '#osteoporosis-one',
        '#next-break',
        '#good-news',
        '#doing-all .column-splitter',
      ],
    },
    {
      name: 'hero-cta',
      instances: [
        '#treatment-can-help',
        '#discover-treatment',
      ],
    },
    {
      name: 'accordion-quiz',
      instances: [
        '.quiz-content',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Banner',
      selector: 'header.header-nav',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2-osteoporosis-facts',
      name: 'Osteoporosis Facts',
      selector: '#osteoporosis-one',
      style: 'light',
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-3-next-break',
      name: '5x Break Risk',
      selector: '#next-break',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-4-good-news',
      name: 'Good News / Treatment',
      selector: '#good-news',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-5-doing-all',
      name: 'Doing All You Can',
      selector: '#doing-all',
      style: null,
      blocks: ['hero-banner', 'columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-6-treatment-can-help',
      name: 'Treatment Can Help',
      selector: '#treatment-can-help',
      style: 'dark-purple',
      blocks: ['hero-cta'],
      defaultContent: [],
    },
    {
      id: 'section-7-risk-table',
      name: 'Risk Level Table',
      selector: '#table',
      style: null,
      blocks: [],
      defaultContent: ['#table .desk-only img', '#table .mob-only img'],
    },
    {
      id: 'section-8-risk-level',
      name: "What's Your Risk Level",
      selector: '#discover-treatment',
      style: 'dark-purple',
      blocks: ['hero-cta'],
      defaultContent: [],
    },
    {
      id: 'section-9-reduce-risk',
      name: 'Reduce Your Risk',
      selector: ['#paper-img', '#you-can-do-more'],
      style: null,
      blocks: [],
      defaultContent: ['#paper-img img', '#you-can-do-more h3', '#you-can-do-more .row p', '#you-can-do-more .take-vitamin-list ul', '#you-can-do-more .medic-option a'],
    },
    {
      id: 'section-10-quiz',
      name: 'Quiz Section',
      selector: '#quize-container',
      style: 'dark',
      blocks: ['accordion-quiz'],
      defaultContent: ['.quiz-section h3', '.quiz-section p'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Add section breaks and metadata while original DOM selectors still exist
    if (PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1) {
      try {
        sectionsTransformer.call(null, 'afterTransform', main, {
          ...payload,
          template: PAGE_TEMPLATE,
        });
      } catch (e) {
        console.error('Section transformer failed:', e);
      }
    }

    // 3. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 4. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 5. Move block tables out of header before cleanup removes it
    const header = main.querySelector('header.header-nav');
    if (header) {
      const headerBlocks = header.querySelectorAll('[class*="hero-"], [class*="columns-"]');
      headerBlocks.forEach((block) => {
        header.before(block);
      });
    }

    // 6. Remove tracking pixels
    main.querySelectorAll('img[src*="bluecava.com"], img[src*="rlcdn.com"], img[src*="sync.graph"]').forEach((el) => {
      const parent = el.closest('p') || el;
      parent.remove();
    });

    // 7. Execute afterTransform transformers (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 8. Make image URLs absolute (source site uses absolute URLs with media paths)
    main.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http')) {
        try {
          img.src = new URL(src, params.originalURL).href;
        } catch (e) {
          // keep original src
        }
      }
    });

    // 9. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);

    // 10. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
