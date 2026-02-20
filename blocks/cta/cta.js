/**
 * CTA block – opens a modal. Cells: Label | Variant | Modal ID.
 * Reads from data-aue-prop when present (AEM), else from direct child divs in order.
 */
function getField(block, prop, fallback = '') {
  const el = block.querySelector(`[data-aue-prop="${prop}"]`);
  return (el?.textContent?.trim() ?? fallback);
}

/** Get text from a cell div (cell itself or its first child). */
function getCellText(cell) {
  if (!cell) return '';
  const inner = cell.querySelector('[data-aue-prop]') || cell.firstElementChild || cell;
  return (inner?.textContent?.trim() ?? cell.textContent?.trim() ?? '').trim();
}

/**
 * Preview/simple structure: block has <p>s, last two are label and "variant-1|2|3".
 * Handles both block > div > p... and block > p...
 */
function getLabelAndVariantFromParagraphs(block) {
  const container = block.querySelector('div') || block;
  const ps = [...container.querySelectorAll('p')];
  if (ps.length < 2) return null;
  const lastText = ps[ps.length - 1].textContent.trim().toLowerCase();
  if (!['variant-1', 'variant-2', 'variant-3'].includes(lastText)) return null;
  return {
    label: ps[ps.length - 2].textContent.trim() || 'Button',
    variant: lastText,
  };
}

export default function decorate(block) {
  const rowDivs = [...block.children].filter((el) => el.tagName === 'DIV');

  let label = getField(block, 'label') || getCellText(rowDivs[0]) || 'Button';
  let variant = (getField(block, 'variant') || getCellText(rowDivs[1]) || 'variant-1').toLowerCase();
  const modalId = getField(block, 'modalId') || getCellText(rowDivs[2]) || '';

  const fromParagraphs = getLabelAndVariantFromParagraphs(block);
  if (fromParagraphs) {
    label = fromParagraphs.label;
    variant = fromParagraphs.variant;
  }

  const allowedVariants = ['variant-1', 'variant-2', 'variant-3'];
  const variantClass = allowedVariants.includes(variant) ? variant : 'variant-1';

  const container = document.createElement('p');
  container.className = 'button-container';

  const button = document.createElement('button');
  button.type = 'button';
  button.title = label;
  button.className = `button ${variantClass}`;
  button.textContent = label;

  if (modalId) {
    const id = modalId.replace(/^#/, '');
    button.dataset.action = 'modal';
    button.dataset.modalId = id;
    button.addEventListener('click', () => {
      const dialog = document.getElementById(id);
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else if (dialog) {
        dialog.hidden = false;
        dialog.setAttribute('aria-hidden', 'false');
      }
      block.dispatchEvent(new CustomEvent('cta:openmodal', { bubbles: true, detail: { modalId: id } }));
    });
  }

  container.appendChild(button);
  block.innerHTML = '';
  block.appendChild(container);
}
