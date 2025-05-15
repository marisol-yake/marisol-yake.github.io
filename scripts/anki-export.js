document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('export-anki')?.addEventListener('click', () => {
    try {
      const cards = Array.from(document.querySelectorAll('.card'));
      if (!cards.length) throw new Error("No cards found");

      const csv = [
        ['Term', 'Definition', 'Tags', 'Sources'].join(','), // Header
        ...cards.map(card => {
          const term = card.querySelector('h3, h4, strong')?.textContent || 'No term';
          const definition = card.querySelector('p, div:not(.tags)')?.textContent || '';
          const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent).join(';');
          const sources = Array.from(card.querySelectorAll('a[href]')).map(a => a.href).join(';');
          
          return [
            `"${term.replace(/"/g, '""')}"`,
            `"${definition.replace(/"/g, '""')}"`,
            `"${tags.replace(/"/g, '""')}"`,
            `"${sources.replace(/"/g, '""')}"`
          ].join(',');
        })
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `anki-export-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      
    } catch (error) {
      alert(`Export failed: ${error.message}`);
    }
  });
});