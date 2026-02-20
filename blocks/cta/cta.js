/**
 * CTA block – builds a single button from the first row.
 * Columns: Link | Text | Title | Variant | Action (link | modal) | Modal ID
 * When Action is "modal", the CTA opens a modal instead of navigating.
 */
export default function decorate(block) {
  const row = block.querySelector('div > div');
  if (!row) return;

  const cells = [...row.children];
  const link = cells[0]?.textContent?.trim() || '#';
  const text = cells[1]?.textContent?.trim() || 'Button';
  const title = cells[2]?.textContent?.trim() || text;
  const variant = (cells[3]?.textContent?.trim() || 'variant-1').toLowerCase();
  const action = (cells[4]?.textContent?.trim() || 'link').toLowerCase();
  const modalId = cells[5]?.textContent?.trim() || '';

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
