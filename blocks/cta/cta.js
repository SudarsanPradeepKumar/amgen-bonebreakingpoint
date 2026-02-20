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

export default function decorate(block) {
  const rowDivs = [...block.children].filter((el) => el.tagName === 'DIV');

  const label = getField(block, 'label') || getCellText(rowDivs[0]) || 'Button';
  const variant = (getField(block, 'variant') || getCellText(rowDivs[1]) || 'variant-1').toLowerCase();
  const modalId = getField(block, 'modalId') || getCellText(rowDivs[2]) || '';

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
