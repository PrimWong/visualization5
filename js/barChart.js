(() => {
  const tooltip = d3.select('#tooltip');
  d3.json('https://restcountries.com/v3.1/all').then(data => {
    const top10 = data.sort((a, b) => b.population - a.population).slice(0, 10);
    const margin = { top: 40, right: 40, bottom: 100, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    

    const svg = d3.select('#bar-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(top10.map(d => d.name.common))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(top10, d => d.population)])
      .nice()
      .range([height, 0]);

    svg.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d/1e9}`));
    svg.append('g').attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)).selectAll('text')
      .attr('transform', 'rotate(-40)').style('text-anchor', 'end');

    // Axis labels
    svg.append('text')
      .attr('class', 'axis-label')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 40)
      .attr('text-anchor', 'middle')
      .text('Country');

    svg.append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 20)
      .attr('text-anchor', 'middle')
      .text('Population (billion people)');


    svg.selectAll('.bar')
      .data(top10).enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name.common))
      .attr('y', d => y(d.population))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.population))
      .attr('fill', (d, i) => d3.schemeBlues[9][i + 1])
      .on('mouseover', (event, d) => {
        tooltip.style('opacity', 1)
          .html(`<strong>${d.name.common}</strong><br/>Population: ${d3.format(',')(d.population)}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 40) + 'px');
      })
      .on('mouseout', () => tooltip.style('opacity', 0));
  });
})();