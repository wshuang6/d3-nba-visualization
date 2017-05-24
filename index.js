// import advanced from './data/advanced.json';
// import per36 from './data/per36.json';

function threeGraph (error, per36) {
  let width = 1200, height = 700, paddingBottom = 30, paddingLeft = 60;
  let attemptsScale = d3.scaleLinear()
    .domain([0.5, 12])
    // .domain([0, 350])
    .range([paddingLeft, width-paddingBottom*2])

  let percentScale = d3.scaleLinear()
    .domain([0.15, 0.5])
    .range([height-paddingLeft, paddingBottom])

  let threeArray = per36
  .filter(player => player['3PA'] >= 1 && player.MP >=820)
  .map(player => {
    let index = player.Player.indexOf("\\");
    return {
      name: player.Player.substring(0, index),
      attempts: player['3PA'], 
      // attempts: player['3PA']/36*player.MP*player['3P%'],
      percent: player['3P%'],
      position: player.Pos,
      team: player.Tm,
      x: attemptsScale(player['3PA']),
      // x: attemptsScale(player['3PA']/36*player.MP*player['3P%']),
      y: percentScale(player['3P%'])
    }
  })

  let threePlot = d3.select('#root')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  let xAxis = d3.axisBottom()
    .scale(attemptsScale)

  let yAxis = d3.axisLeft()
    .scale(percentScale)

  let createXAxis = threePlot.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${height - paddingBottom})`)
    .call(xAxis)

  let xAxisLabel = threePlot.append('text')
    .attr('transform', `translate(${width/2}, ${height})`)
    .style('text-anchor', 'middle')
    .text('3PA Per 36 Mins')
    .classed('tooltip', true)

  let createYAxis = threePlot.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${paddingLeft}, ${paddingBottom})`)
    .call(yAxis)

  let yAxisLabel = threePlot.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0)
    .attr('x', 0 - (height/2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('3P%')
    .classed('tooltip', true)

  let tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .classed('tooltip', true)
    
  let dataPoints = threePlot.selectAll('circle')
    .data(threeArray)
    .enter()
    .append('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 3)
    .attr('fill', d => returnColor(d.team))
    .on("mouseover", d => tooltip
      .style("visibility", "visible")
      .append('p')
      .classed("tooltip", true)
      .text(`${d.name}, ${d.team}, ${(d.percent*100).toFixed(1)}%, ${d.attempts} 3PA per 36 mins`)
    )
    .on("mousemove", () => tooltip.style("top", (d3.event.pageY-10)+"px")
      .style("left",(d3.event.pageX+10)+"px"))
    .on("mouseout", () => tooltip.style("visibility", "hidden")
      .selectAll('p')
      .remove()
    );
}

function usgGraph (error, usg) {
  let width = 1200, height = 700, paddingBottom = 30, paddingLeft = 60;
  let tsScale = d3.scaleLinear()
    .domain([0.46, 0.66])
    .range([paddingLeft, width-paddingBottom*2])

  let astScale = d3.scaleLinear()
    .domain([5, 65])
    .range([height-paddingLeft, paddingBottom])

  let usgArray = usg
  .map(player => {
    let index = player.Player.indexOf("\\");
    return {
      name: player.Player.substring(0, index),
      usage: player['USG%'], 
      ts: player['TS%'],
      position: player.Pos,
      team: player.Tm,
      assist: player['AST%'],
      x: tsScale(player['TS%']),
      y: astScale(player['AST%']),
      r: player['USG%']/3
    }
  })

  let usgPlot = d3.select('#root')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  let xAxis = d3.axisBottom()
    .scale(tsScale)

  let yAxis = d3.axisLeft()
    .scale(astScale)

  let createXAxis = usgPlot.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${height - paddingBottom})`)
    .call(xAxis)

  let xAxisLabel = usgPlot.append('text')
    .attr('transform', `translate(${width/2}, ${height})`)
    .style('text-anchor', 'middle')
    .text('True Shooting')
    .classed('tooltip', true)

  let createYAxis = usgPlot.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${paddingLeft}, ${paddingBottom})`)
    .call(yAxis)

  let yAxisLabel = usgPlot.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0)
    .attr('x', 0 - (height/2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Teammate Assist%')
    .classed('tooltip', true)

  let tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .classed('tooltip', true)
    
  let dataPoints = usgPlot.selectAll('circle')
    .data(usgArray)
    .enter()
    .append('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.r)
    .attr('fill', d => returnColor(d.team))
    .on("mouseover", d => tooltip
      .style("visibility", "visible")
      .append('p')
      .classed("tooltip", true)
      .text(`${d.name}, ${d.team}, ${(d.usage)}% usage, ${(d.assist)}% assist, ${(d.ts*100).toFixed(1)}% true shooting`)
    )
    .on("mousemove", () => tooltip.style("top", (d3.event.pageY-10)+"px")
      .style("left",(d3.event.pageX+10)+"px"))
    .on("mouseout", () => tooltip.style("visibility", "hidden")
      .selectAll('p')
      .remove()
    );
}

function returnColor (team) {
  switch (team) {
    case "ATL": 
      return '#E13A3E'
    case "BOS": 
      return '#008348'
    case "BRK": 
      return '#061922'
    case "CHI": 
      return '#CE1141'
    case "CHO": 
      return '#1D1160'
    case "CLE": 
      return '#860038'
    case "DAL": 
      return '#007DC5'
    case "DEN": 
      return '#4D90CD'
    case "DET": 
      return '#ED174C'
    case "GSW": 
      return '#FDB927'
    case "HOU": 
      return '#CE1141'
    case "IND": 
      return '#FFC633'
    case "LAC": 
      return '#ED174C'
    case "LAL": 
      return '#FDB927'
    case "MEM": 
      return '#7399C6'
    case "MIA": 
      return '#98002E'
    case "MIL": 
      return '#00471B'
    case "MIN": 
      return '#005083'
    case "NOP": 
      return '#002B5C'
    case "NYK": 
      return '#006BB6'
    case "OKC": 
      return '#007DC3'
    case "ORL": 
      return '#007DC5'
    case "PHI": 
      return '#006BB6'
    case "PHO": 
      return '#E56020'
    case "POR": 
      return '#E03A3E'
    case "SAC": 
      return '#724C9F'
    case "SAS": 
      return '#BAC3C9'
    case "TOR": 
      return '#CE1141'
    case "TOT": 
      return '#A1A1A4'
    case "UTA": 
      return '#00471B'
    case "WAS": 
      return '#002B5C'
  }
}
function runAll (graph) {
  d3.select('#root')
    .selectAll('svg')
    .remove()

  let graphTypes = ['3 Point Attempts vs. Percent', 'Usage vs. Assists vs. True Shooting']
  let buttonCheck = d3.select('#button-container')
    .selectAll('button')
    .data(graphTypes)
    .enter()
    .append('button')
    .classed('graph-select', true)
    .text(d => d)
    .on('click', d => runAll(d))

  if (graph === '3 Point Attempts vs. Percent') {
    d3.json('./data/per36.json', threeGraph)
  }
  else if (graph === 'Usage vs. Assists vs. True Shooting') {
    d3.json('./data/advancedUsgLeaders.json', usgGraph)
  }
}

runAll();

