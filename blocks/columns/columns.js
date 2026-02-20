function getColumnAlignment(col) {
  const el = col.querySelector('[data-aue-prop="alignment"]');
  if (el) {
    const v = (el.textContent || '').trim().toLowerCase();
    if (v === 'left' || v === 'right') return v;
  }
  const first = col.firstElementChild;
  if (first && (first.textContent || '').trim().toLowerCase() === 'right') return 'right';
  return 'left';
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const alignment = getColumnAlignment(col);
      col.classList.add(`column-align-${alignment}`);
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
