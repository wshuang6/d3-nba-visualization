// import advanced from './data/advanced.json';
// import per36 from './data/per36.json';

function threeGraph (error, per36) {
  let paddingLeft = 60;
  let paddingBottom = 60;
  let height = 700;
  let width = 1200;
  let attemptsScale = d3.scaleLinear()
    .domain([0.5, 12])
    // .domain([0, 350])
    .range([paddingLeft, width - paddingLeft])

  let percentScale = d3.scaleLinear()
    .domain([0.15, 0.55])
    .range([height - paddingBottom, paddingBottom])

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
  let explanation = d3.select('#root')
    .insert('p', ':first-child')
    .classed('info', true)
    .text('This takes two players from each team that had the highest usage - the percent of possessions they finished (x axis) - and compares their usage with how many shots they created for teammates (y axis) and their efficiency of scoring (circle size)')

  let threePlot = d3.select('.svg-container')
    .append('svg')
    // .attr('width', width)
    // .attr('height', height)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1200 700")
    .classed("svg-content-responsive", true); 

  let xAxis = d3.axisBottom()
    .scale(attemptsScale)

  let yAxis = d3.axisLeft()
    .scale(percentScale)

  let createXAxis = threePlot.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${height - paddingBottom})`)
    .call(xAxis)

  let xAxisLabel = threePlot.append('text')
    .attr('transform', `translate(${(width-paddingLeft)/2 + paddingLeft}, ${height - paddingBottom/2})`)
    .style('text-anchor', 'middle')
    .text('3PA Per 36 Mins')
    .classed('tooltip', true)

  let createYAxis = threePlot.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${paddingLeft}, 0)`)
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
    // .attr('cx', 4 + paddingLeft)
    .attr('cx', d => d.x)
    .attr('cy', 4)
    // .attr('cy', d => d.y)
    .attr('r', 4)
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
    )
    .transition()
    .duration(1000)
    // .duration(d => d.attempts*150)
    // .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .ease(d3.easeBounceOut)
    // .each(transitionX, 1000)
    // .each(transitionY, 1000)

  threePlot.append("text")
    .attr("x", (width / 2))             
    .attr("y", (paddingBottom))
    .attr("text-anchor", "middle")  
    .style("font-size", "18px") 
    .text("Shooters Shoot");
}

function usgGraph (error, usg) {
  let paddingLeft = 60;
  let paddingBottom = 65;
  let height = 700;
  let width = 1200;
  let usgScale = d3.scaleLinear()
    .domain([20, 44])
    .range([paddingLeft, width - paddingLeft])

  let astScale = d3.scaleLinear()
    .domain([5, 60])
    .range([height - paddingBottom, paddingBottom])

  let TSScale = d3.scaleLinear()
    .domain([0.4, 0.7])
    .range([4, 14])

  let usgArray = usg.map(player => {
    let index = player.Player.indexOf("\\");
    return {
      name: player.Player.substring(0, index),
      usage: player['USG%'], 
      ts: player['TS%'],
      position: player.Pos,
      team: player.Tm,
      assist: player['AST%'],
      x: usgScale(player['USG%']),
      y: astScale(player['AST%']),
      r: TSScale([player['TS%']])
    }
  })
  let explanation = d3.select('#root')
    .insert('p', ':first-child')
    .classed('info', true)
    .text('This takes two players from each team that had the highest usage - the percent of possessions they finished (x axis) - and compares their usage with how many shots they created for teammates (y axis) and their efficiency of scoring (circle size)')
  
  let usgPlot = d3.select('.svg-container')
    .append('svg')
    // .attr('width', width)
    // .attr('height', height)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1200 700")
    .classed("svg-content-responsive", true); 

  let xAxis = d3.axisBottom()
    .scale(usgScale)

  let yAxis = d3.axisLeft()
    .scale(astScale)

  let createXAxis = usgPlot.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${height - paddingBottom})`)
    .call(xAxis)

  let xAxisLabel = usgPlot.append('text')
    .attr('transform', `translate(${(width-paddingLeft)/2 + paddingLeft}, ${height - paddingBottom/2})`)
    .style('text-anchor', 'middle')
    .text('Usage %')
    .classed('tooltip', true)

  let createYAxis = usgPlot.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${paddingLeft}, 0)`)
    .call(yAxis)

  let yAxisLabel = usgPlot.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0)
    .attr('x', 0 - (height/2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Teammate Assist %')
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
    .attr('r', d => 0)
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
    )
    .transition()
    .ease(d3.easeCubicIn)
    .duration(d => d.r * 300)
    .attr('r', d => d.r)

  usgPlot.append("text")
    .attr("x", ((width) / 2))             
    .attr("y", (paddingBottom))
    .attr("text-anchor", "middle")  
    .style("font-size", "18px") 
    .text("Creators vs. Finishers vs. Westbrooks");
}

function teamGraph (error, team, selectedTeam="Boston Celtics") {
  let paddingLeft = 60;
  let paddingBottom = 65;
  let height = 700;
  let width = 1200;
  let distScale = d3.scaleLinear()
    .domain([0, 26.75])
    .range([paddingLeft, width-paddingLeft])

  let percentScale = d3.scaleLinear()
    .domain([0, 0.7])
    .range([height - paddingBottom, paddingBottom])

  let explanation = d3.select('#root')
    .insert('p', ':first-child')
    .classed('info', true)
    .text('This takes two players from each team that had the highest usage - the percent of possessions they finished (x axis) - and compares their usage with how many shots they created for teammates (y axis) and their efficiency of scoring (circle size)')
  
  let teamPlot = d3.select('.svg-container')
    .append('svg')
    // .attr('width', width)
    // .attr('height', height)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1200 700")
    .classed("svg-content-responsive", true); 

  let xAxis = d3.axisBottom()
    .scale(distScale)

  let yAxis = d3.axisLeft()
    .scale(percentScale)

  let createXAxis = teamPlot.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${height - paddingBottom})`)
    .call(xAxis)

  let xAxisLabel = teamPlot.append('text')
    .attr('transform', `translate(${(width-paddingLeft)/2 + paddingLeft}, ${height - paddingBottom/2})`)
    .style('text-anchor', 'middle')
    .text('Distance (ft)')
    .classed('tooltip', true)

  let createYAxis = teamPlot.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${paddingLeft}, 0)`)
    .call(yAxis)

  let yAxisLabel = teamPlot.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0)
    .attr('x', 0 - (height/2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Percent (attempted or made)')
    .classed('tooltip', true)

  let tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .classed('tooltip', true)
  
  let returnObj = {};

  let distKeys = ['0-3', '3-10', '10-16', '16-3PT', '3P'];
  let distX = [0, 3, 10, 16, 23.75];
  let distWidthScaled = [3, 7, 6, 7.75, 3].map(item => distScale(item))
  let distXScaled = distX.map(item => distScale(item))
  for (let key in team) {
    let item = team[key];
    let data = [];
    let pathDataShots = [];
    let pathDataPercents = [];
    for (let i = 0; i < 5; i++) {
      data.push({
        distKeys: distKeys[i],
        distX: distX[i],
        distWidthScaled: distWidthScaled[i],
        distXScaled: distXScaled[i],
        shots: item[returnShots(i, 'shots')],
        percents: item[returnShots(i, 'percents')],
        percentY: percentScale(0) - percentScale(item[returnShots(i, 'percents')]),
        shotY: percentScale(0) - percentScale(item[returnShots(i, 'shots')])
      })
    }
    returnObj[key] = {
      avgDist: item['Dist.'],
      avgFg: item['FG%'],
      avgX: distScale(item['Dist.']),
      avgY: percentScale(item['FG%']),
      data
    }
  }
  function returnShots (i, type) {
    switch (i) {
      case 0: 
        return (type === 'shots') ? '0-3%' : '0-3FG';
      case 1: 
        return (type === 'shots') ? '3-10%' : '3-10FG';
      case 2:
        return (type === 'shots') ? '10-16%' : '10-16FG';
      case 3: 
        return (type === 'shots') ? '16 <3%' : '16 <3FG';
      case 4:
        return (type === 'shots') ? '3PFG' : '3P';
    }
  }
  console.log(returnObj)

  let dataPoints = teamPlot.selectAll('rect')
    .data(returnObj['Boston Celtics'].data)
    .enter()
    // .path()
    // .rect(d => d.distXScaled, d => d[selectedTeam].shotY, d => d.distWidthScaled, d => percentScale(0.7) - d[selectedTeam].shotY)
  let locations = dataPoints.append('rect')
    .attr('width', d => d.distWidthScaled - 60)
    .attr('height', d => d.shotY)
    .attr('x', d => d.distXScaled)
    .attr('y', d => percentScale(0) - d.shotY)
    .attr('fill', 'gray')
    .attr('fill-opacity', 0.6)
  let percents = dataPoints.append('rect')
    .attr('width', d => d.distWidthScaled - 60)
    .attr('height', d => d.percentY)
    .attr('x', d => d.distXScaled)
    .attr('y', d => percentScale(0) - d.percentY)
    .attr('fill', 'green')
    .attr('fill-opacity', 0.3)

  
  // let circles = teamPlot.selectAll('circle')
  //   .data(returnObj)
  //   .enter()
  //   .append('circle')
  //   .attr('cx', d => d[selectedTeam].avgX)
  //   .attr('cy', d => d[selectedTeam].avgY)
  //   .attr('r', 10)
  //   .attr('fill', 'blue')

    // .on("mouseover", d => tooltip
    //   .style("visibility", "visible")
    //   .append('p')
    //   .classed("tooltip", true)
    //   .text(`${d.name}, ${d.team}, ${(d.usage)}% usage, ${(d.assist)}% assist, ${(d.ts*100).toFixed(1)}% true shooting`)
    // )
    // .on("mousemove", () => tooltip.style("top", (d3.event.pageY-10)+"px")
    //   .style("left",(d3.event.pageX+10)+"px"))
    // .on("mouseout", () => tooltip.style("visibility", "hidden")
    //   .selectAll('p')
    //   .remove()
    // )
    // .transition()
    // .ease(d3.easeCubicIn)
    // .duration(d => d.r * 300)

  teamPlot.append("text")
    .attr("x", ((width) / 2))             
    .attr("y", (paddingBottom))
    .attr("text-anchor", "middle")  
    .style("font-size", "18px") 
    .text(`${selectedTeam} Shot Locations`);
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
  d3.select('.svg-container')
    .selectAll('svg')
    .remove()
  
  d3.selectAll('.tooltip')
    .remove()

  d3.selectAll('.info')
    .remove()

  let graphTypes = ['3 Point Shooting', 'High Usage Players', 'Team Offense']
  let buttonCheck = d3.select('.button-container')
    .selectAll('button')
    .data(graphTypes)
    .enter()
    .append('button')
    .classed('graph-select', true)
    .text(d => d)
    .on('click', d => runAll(d))

  if (graph === '3 Point Shooting') {
    d3.json('./data/per36.json', threeGraph)
  }
  else if (graph === 'High Usage Players') {
    d3.json('./data/advancedUsgLeaders.json', usgGraph)
  }
  else if (graph === "Team Offense") {
    d3.json('./data/teamShooting.json', teamGraph)
  }
}

runAll();

