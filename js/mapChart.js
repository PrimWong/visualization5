(() => {
  const tooltip = d3.select('#tooltip');
  const width = 960, height = 500;

  const svg = d3.select('#map').append('svg')
    .attr('width', width).attr('height', height);

  const projection = d3.geoMercator().scale(150).translate([width / 2, height / 1.5]);
  const path = d3.geoPath().projection(projection);

  Promise.all([
    d3.json('https://restcountries.com/v3.1/all'),
    d3.json('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
  ]).then(([countryData, worldData]) => {
    const countries = topojson.feature(worldData, worldData.objects.countries).features;
    // Map country numeric codes to population
    const popById = {};
    countryData.forEach(d => {
      if (d.ccn3) {
        popById[d.ccn3] = d.population;
      }
    });
    const popExtent = d3.extent(Object.values(popById));
    const colorScale = d3.scaleSequential().domain(popExtent).interpolator(d3.interpolateReds);

    // Draw choropleth
    svg.append('g').selectAll('path')
      .data(countries).enter().append('path')
      .attr('d', path)
      .attr('fill', d => {
        const pop = popById[d.id];
        return pop ? colorScale(pop) : '#e0e0e0';
      })
      .attr('stroke', '#bbb');
    
    // Tooltip interactions
    svg.selectAll('path')
      .on('mouseover', (event, d) => {
        const pop = popById[d.id] || 0;
        tooltip.style('opacity', 1)
          .html(`<strong>${d.properties.name}</strong><br/>Population: ${d3.format(',')(pop)}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 40) + 'px');
      })
      .on('mouseout', () => tooltip.style('opacity', 0));
  });
})();