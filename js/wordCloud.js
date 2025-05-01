(() => {
  const tooltip = d3.select('#tooltip');
  d3.json('https://restcountries.com/v3.1/all').then(data => {
    const langCounts = {};
    data.forEach(d => {
      if (d.languages) {
        Object.values(d.languages).forEach(lang => {
          langCounts[lang] = (langCounts[lang] || 0) + 1;
        });
      }
    });

    const words = Object.entries(langCounts)
      .map(([text, value]) => ({ text, size: 10 + value * 3 }))
      .sort((a, b) => b.size - a.size).slice(0, 100);

    const layout = d3.layout.cloud()
      .size([800, 400])
      .words(words)
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 0 : 90))
      .font('Open Sans')
      .fontSize(d => d.size)
      .on('end', draw);

    layout.start();

    function draw(words) {
      const svg = d3.select('#word-cloud').append('svg')
        .attr('width', 800).attr('height', 400)
        .append('g').attr('transform', 'translate(400,200)');

      svg.selectAll('text')
        .data(words).enter().append('text')
        .style('font-size', d => d.size + 'px')
        .style('fill', (d, i) => d3.schemeCategory10[i % 10])
        .style('cursor', 'pointer')
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text)
        .on('mouseover', (event, d) => {
          tooltip.style('opacity', 1)
            .html(`<strong>${d.text}</strong><br/>Used in ${(d.size - 10) / 3} countries`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 40) + 'px');
        })
        .on('mouseout', () => tooltip.style('opacity', 0));
    }
  });
})();
