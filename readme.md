# Visualizing the NBA

## What is it?

This project visualizes data from the 2016-17 NBA season. Specifically, it visualizes:
* the three-point shooting of players who played at least 820 minutes or shot at least one three-point attempt per 36 minutes
* the usage/assist/true-shooting percentages of players who were among the top two of their team in usage percent, among players who played at least 700 minutes
* the shot locations and shooting percentage from those locations of every team.

* [View the Deployed Site](https://wshuang6.github.io/d3-nba-visualization/)

## Technolgies
The front-end is built on D3, JavaScript, HTML, and CSS. The data were provided by Basketball-Reference.

### Local set-up

* Move into your projects directory: `cd ~/YOUR_PROJECTS_DIRECTORY`
* Clone this repository: `git clone https://github.com/wshuang6/d3-nba-visualization`
* Move into the project directory: `cd d3-nba-visualization`
* Run your development server (I use live-server), or open the HTML file in your browser. Note: Chrome (and possibly other browsers) prevents XML requests for local files (i.e. prevents loading the JSON files from the data folder). Using Chrome requires you to start the browser with the --allow-file-access-from-files switch.

## Authors
William Huang