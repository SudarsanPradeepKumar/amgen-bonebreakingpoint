/**
 * CTA block – builds a single button from block cells.
 * Cells: Link | Text | Title | Variant | Action (link | modal) | Modal ID
 * When Action is "modal", the CTA opens a modal instead of navigating.
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

  const variantVal = (getField(block, 'variant') || getCell(3) || 'variant-1').toLowerCase();
  const rawCell1 = getCell(1);
  const rawCell2 = getCell(2);
  const isVariantLike = (s) => /^variant-[123]$/.test((s || '').toLowerCase());

  const link = getField(block, 'link') || getCell(0) || '#';
  const text = getField(block, 'linkText') || (rawCell1 && !isVariantLike(rawCell1) ? rawCell1 : '') || 'Button';
  const title = getField(block, 'linkTitle') || (rawCell2 && !isVariantLike(rawCell2) ? rawCell2 : '') || text;
  const variant = variantVal;
  const action = (getField(block, 'action') || getCell(4) || 'link').toLowerCase();
  const modalId = getField(block, 'modalId') || getCell(5) || '';

  const allowedVariants = ['variant-1', 'variant-2', 'variant-3'];
  const variantClass = allowedVariants.includes(variant) ? variant : 'variant-1';

  const container = document.createElement('p');
  container.className = 'button-container';

  const a = document.createElement('a');
  a.title = title;
  a.className = `button ${variantClass}`;
  a.textContent = text;

  if (action === 'modal' && modalId) {
    const id = modalId.replace(/^#/, '');
    a.href = `#${id}`;
    a.dataset.action = 'modal';
    a.dataset.modalId = id;
    a.setAttribute('role', 'button');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const dialog = document.getElementById(id);
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else if (dialog) {
        dialog.hidden = false;
        dialog.setAttribute('aria-hidden', 'false');
      }
      block.dispatchEvent(new CustomEvent('cta:openmodal', { bubbles: true, detail: { modalId: id } }));
    });
  } else {
    a.href = link;
  }

  container.appendChild(a);
  block.innerHTML = '';
  block.appendChild(container);
}
