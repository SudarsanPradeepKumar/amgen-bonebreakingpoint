var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const bgImage = element.querySelector("img") || element.previousElementSibling && element.previousElementSibling.querySelector("img") || element.parentElement && element.parentElement.querySelector(".hero-div img, .field-promoicon img");
    const heading = element.querySelector("h3, h4, h2, h1");
    const paragraphs = Array.from(element.querySelectorAll("p"));
    const ctaLink = element.querySelector("a.external-link, a[href], .explore-medic a, .medic-option a");
    const cells = [];
    if (bgImage) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      imgFrag.appendChild(bgImage.cloneNode(true));
      cells.push([imgFrag]);
    } else {
      cells.push([""]);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (heading) textFrag.appendChild(heading.cloneNode(true));
    paragraphs.forEach((p) => {
      if (!p.closest(".explore-medic") && !p.closest(".medic-option")) {
        textFrag.appendChild(p.cloneNode(true));
      }
    });
    if (ctaLink) {
      const p = document.createElement("p");
      p.appendChild(ctaLink.cloneNode(true));
      textFrag.appendChild(p);
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse2(element, { document }) {
    const image = element.querySelector(".quantum-cta__image, img");
    const textContainer = element.querySelector(".quantum-cta__text");
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(" field:image "));
    if (image) {
      const p = document.createElement("p");
      p.appendChild(image.cloneNode(true));
      imgFrag.appendChild(p);
    }
    const altFrag = document.createDocumentFragment();
    altFrag.appendChild(document.createComment(" field:imageAlt "));
    if (image && image.alt) {
      const p = document.createElement("p");
      p.textContent = image.alt;
      altFrag.appendChild(p);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (textContainer) {
      const headings = textContainer.querySelectorAll("h3, h4");
      headings.forEach((h) => {
        if (h.textContent.trim()) {
          textFrag.appendChild(h.cloneNode(true));
        }
      });
      const sectionPadding = textContainer.querySelector(".section-padding");
      if (sectionPadding) {
        textFrag.appendChild(sectionPadding.cloneNode(true));
        const siblingPs = textContainer.querySelectorAll(":scope > p, :scope > .if-you-answer");
        siblingPs.forEach((p) => {
          if (p.textContent.trim()) {
            textFrag.appendChild(p.cloneNode(true));
          }
        });
      } else {
        const paragraphs = textContainer.querySelectorAll("p");
        paragraphs.forEach((p) => {
          if (p.textContent.trim()) {
            textFrag.appendChild(p.cloneNode(true));
          }
        });
      }
      const ctaButton = textContainer.querySelector(".quantum-button, button.quantum-cta__action");
      if (ctaButton) {
        const buttonText = ctaButton.querySelector(".quantum-button__text");
        const parentLink = element.querySelector("a.quantum-cta__inner");
        if (parentLink && buttonText) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = parentLink.href;
          a.textContent = buttonText.textContent.trim();
          p.appendChild(a);
          textFrag.appendChild(p);
        } else if (buttonText) {
          const p = document.createElement("p");
          p.textContent = buttonText.textContent.trim();
          textFrag.appendChild(p);
        }
      }
    }
    const cells = [[imgFrag, altFrag, textFrag]];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse3(element, { document }) {
    const cells = [];
    const promoIcon = element.querySelector(".field-promoicon");
    const promoText = element.querySelector(".field-promotext");
    const promoIcon2 = element.querySelector(".field-promoicon2");
    const promoText2 = element.querySelector(".field-promotext2");
    const promoLink = element.querySelector(".field-promolink");
    const columnSplitterChildren = element.classList && element.classList.contains("column-splitter") ? Array.from(element.children) : null;
    if (promoIcon || promoText) {
      const col1 = document.createDocumentFragment();
      if (promoIcon) {
        const img = promoIcon.querySelector("img");
        if (img) col1.appendChild(img.cloneNode(true));
      }
      const col2 = document.createDocumentFragment();
      if (promoText) {
        Array.from(promoText.children).forEach((child) => {
          if (child.textContent.trim()) {
            col2.appendChild(child.cloneNode(true));
          }
        });
      }
      if (promoLink) {
        col2.appendChild(promoLink.cloneNode(true));
      }
      if (promoText2) {
        Array.from(promoText2.children).forEach((child) => {
          if (child.textContent.trim()) {
            col2.appendChild(child.cloneNode(true));
          }
        });
      }
      if (promoIcon2) {
        cells.push([col1, col2]);
        const col2a = document.createDocumentFragment();
        if (promoText2 && !promoText) {
          Array.from(promoText2.children).forEach((child) => {
            if (child.textContent.trim()) {
              col2a.appendChild(child.cloneNode(true));
            }
          });
        }
        const col2b = document.createDocumentFragment();
        const img2 = promoIcon2.querySelector("img");
        if (img2) col2b.appendChild(img2.cloneNode(true));
        if (col2b.childNodes.length > 0) {
          cells.push([col2a, col2b]);
        }
      } else {
        cells.push([col1, col2]);
      }
      const fiveExText = element.querySelector(".five-ex-text");
      if (fiveExText && !promoText.querySelector(".five-ex-text")) {
      }
    } else if (columnSplitterChildren && columnSplitterChildren.length >= 2) {
      const leftDiv = columnSplitterChildren[0];
      const rightDiv = columnSplitterChildren[1];
      const col1 = document.createDocumentFragment();
      const leftContent = leftDiv.querySelector(".component-content");
      if (leftContent) {
        Array.from(leftContent.childNodes).forEach((child) => {
          if (child.nodeType === 1 && child.textContent.trim()) {
            col1.appendChild(child.cloneNode(true));
          }
        });
      }
      const col2 = document.createDocumentFragment();
      const rightImg = rightDiv.querySelector("img");
      if (rightImg) {
        col2.appendChild(rightImg.cloneNode(true));
      }
      cells.push([col1, col2]);
    } else {
      const images = Array.from(element.querySelectorAll("img"));
      const textEls = Array.from(element.querySelectorAll("h3, h4, p"));
      const col1 = document.createDocumentFragment();
      const col2 = document.createDocumentFragment();
      if (images.length > 0) {
        col1.appendChild(images[0].cloneNode(true));
      }
      textEls.forEach((el) => {
        if (el.textContent.trim()) {
          col2.appendChild(el.cloneNode(true));
        }
      });
      cells.push([col1, col2]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-quiz.js
  function parse4(element, { document }) {
    const cells = [];
    const tabs = element.querySelectorAll('.component.content.tab, [id^="Section"]');
    tabs.forEach((tab) => {
      const questionEl = tab.querySelector(".question-card .title, .question-card h2");
      const questionText = questionEl ? questionEl.textContent.trim() : "";
      const answerContainer = tab.querySelector(".answer-container");
      if (questionText) {
        const summaryFrag = document.createDocumentFragment();
        summaryFrag.appendChild(document.createComment(" field:summary "));
        const summaryP = document.createElement("p");
        summaryP.textContent = questionText;
        summaryFrag.appendChild(summaryP);
        const textFrag = document.createDocumentFragment();
        textFrag.appendChild(document.createComment(" field:text "));
        if (answerContainer) {
          Array.from(answerContainer.children).forEach((child) => {
            if (child.textContent.trim()) {
              textFrag.appendChild(child.cloneNode(true));
            }
          });
        }
        cells.push([summaryFrag, textFrag]);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "accordion-quiz", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/bonebreakingpoint-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#CybotCookiebotDialog",
        "#CybotCookiebotDialogBodyUnderlay",
        '[id*="Cookiebot"]'
      ]);
      WebImporter.DOMUtils.remove(element, ["#Modal_Site_Leave"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header.header-nav",
        "footer#footer",
        ".quantum-back-to-top"
      ]);
      WebImporter.DOMUtils.remove(element, ["iframe", "noscript", "link"]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-gtm");
      });
    }
  }

  // tools/importer/transformers/bonebreakingpoint-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== H2.after) return;
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;
    const reversedSections = [...sections].reverse();
    for (const section of reversedSections) {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) continue;
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.after(sectionMetadata);
      }
      const sectionIndex = sections.indexOf(section);
      if (sectionIndex > 0) {
        if (sectionEl.previousElementSibling) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "hero-cta": parse2,
    "columns-promo": parse3,
    "accordion-quiz": parse4
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    urls: [
      "https://www.bonebreakingpoint.com/"
    ],
    description: "Homepage template for Bone Breaking Point website",
    blocks: [
      {
        name: "hero-banner",
        instances: [
          ".component.plain-html.banner-text",
          "#doing-all > .component-content > .component.promo.Osteoporosis-promo"
        ]
      },
      {
        name: "columns-promo",
        instances: [
          "#osteoporosis-one",
          "#next-break",
          "#good-news",
          "#doing-all .column-splitter"
        ]
      },
      {
        name: "hero-cta",
        instances: [
          "#treatment-can-help",
          "#discover-treatment"
        ]
      },
      {
        name: "accordion-quiz",
        instances: [
          ".quiz-content"
        ]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Banner",
        selector: "header.header-nav",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2-osteoporosis-facts",
        name: "Osteoporosis Facts",
        selector: "#osteoporosis-one",
        style: "light",
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-3-next-break",
        name: "5x Break Risk",
        selector: "#next-break",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-4-good-news",
        name: "Good News / Treatment",
        selector: "#good-news",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-5-doing-all",
        name: "Doing All You Can",
        selector: "#doing-all",
        style: null,
        blocks: ["hero-banner", "columns-promo"],
        defaultContent: []
      },
      {
        id: "section-6-treatment-can-help",
        name: "Treatment Can Help",
        selector: "#treatment-can-help",
        style: "dark-purple",
        blocks: ["hero-cta"],
        defaultContent: []
      },
      {
        id: "section-7-risk-table",
        name: "Risk Level Table",
        selector: "#table",
        style: null,
        blocks: [],
        defaultContent: ["#table .desk-only img", "#table .mob-only img"]
      },
      {
        id: "section-8-risk-level",
        name: "What's Your Risk Level",
        selector: "#discover-treatment",
        style: "dark-purple",
        blocks: ["hero-cta"],
        defaultContent: []
      },
      {
        id: "section-9-reduce-risk",
        name: "Reduce Your Risk",
        selector: ["#paper-img", "#you-can-do-more"],
        style: null,
        blocks: [],
        defaultContent: ["#paper-img img", "#you-can-do-more h3", "#you-can-do-more .row p", "#you-can-do-more .take-vitamin-list ul", "#you-can-do-more .medic-option a"]
      },
      {
        id: "section-10-quiz",
        name: "Quiz Section",
        selector: "#quize-container",
        style: "dark",
        blocks: ["accordion-quiz"],
        defaultContent: [".quiz-section h3", ".quiz-section p"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      if (PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1) {
        try {
          transform2.call(null, "afterTransform", main, {
            ...payload,
            template: PAGE_TEMPLATE
          });
        } catch (e) {
          console.error("Section transformer failed:", e);
        }
      }
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      const header = main.querySelector("header.header-nav");
      if (header) {
        const headerBlocks = header.querySelectorAll('[class*="hero-"], [class*="columns-"]');
        headerBlocks.forEach((block) => {
          header.before(block);
        });
      }
      main.querySelectorAll('img[src*="bluecava.com"], img[src*="rlcdn.com"], img[src*="sync.graph"]').forEach((el) => {
        const parent = el.closest("p") || el;
        parent.remove();
      });
      executeTransformers("afterTransform", main, payload);
      main.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("http")) {
          try {
            img.src = new URL(src, params.originalURL).href;
          } catch (e) {
          }
        }
      });
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
