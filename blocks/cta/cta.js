/**
 * CTA block – opens a modal. Cells: Label | Variant | Modal ID.
 * Reads from data-aue-prop when present (AEM), else by cell order.
 */
function getField(block, prop, fallback = '') {
  const el = block.querySelector(`[data-aue-prop="${prop}"]`);
  return (el?.textContent?.trim() ?? fallback);
}

function getCellsInOrder(block) {
  const direct = [...block.children].filter((el) => el.tagName === 'DIV');
  const firstInner = block.querySelector('div > div');
  if (firstInner && firstInner.children.length > 1) {
    return [...firstInner.children];
  }
  return direct;
}

export default function decorate(block) {
  const cells = getCellsInOrder(block);
  const getCell = (i) => (cells[i]?.textContent?.trim() ?? '');

  const label = getField(block, 'label') || getCell(0) || 'Button';
  const variant = (getField(block, 'variant') || getCell(1) || 'variant-1').toLowerCase();
  const modalId = getField(block, 'modalId') || getCell(2) || '';

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
