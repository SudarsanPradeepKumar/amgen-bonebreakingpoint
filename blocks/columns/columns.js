function getAlignment(block) {
  const el = block.querySelector('[data-aue-prop="alignment"]');
  if (el) {
    const v = (el.textContent || '').trim().toLowerCase();
    if (v === 'left' || v === 'right') return v;
  }
  const firstRow = block.firstElementChild;
  if (firstRow && firstRow.children.length >= 3) {
    const v = (firstRow.children[2].textContent || '').trim().toLowerCase();
    if (v === 'left' || v === 'right') return v;
  }
  return 'left';
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  const alignment = getAlignment(block);
  block.classList.add(`columns-align-${alignment}`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
