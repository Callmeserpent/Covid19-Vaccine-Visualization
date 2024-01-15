// script.js

// Set the dimensions and margins of the graph
const margin = { top: 40, right: 150, bottom: 60, left: 80 },
    width = 2000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#bar_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Read the data
d3.csv("test.csv").then(function (data) {
    const x = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([0, width])
        .padding(0.1);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
        .domain([0, 100000000])
        .range([height, 0]);

    const yAxis = svg.append("g")
        .call(d3.axisLeft(y)
            .tickFormat(d3.format(".2s")));

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -20)
        .text("Daily Vaccinations")
        .attr("text-anchor", "start");
    const tooltip = d3.select("#tooltip")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white");


    const moveTooltip = function (event, d) {
        tooltip
            .style("left", (event.x) / 2 + "px")
            .style("top", (event.y) / 2 - 50 + "px");
    }

    const hideTooltip = function (event, d) {
        tooltip.transition().duration(200).style("opacity", 0);
    }
    const highlight = function (event, d) {
        d3.selectAll(".bubbles").style("opacity", 0.1);
        d3.select(this).style("opacity", 1);
    }

    const noHighlight = function (event, d) {
        d3.selectAll(".bubbles").style("opacity", 1);
    }
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("class", "bubbles")
        .attr("x", d => x(d.country))
        .attr("y", d => y(+d.daily_vaccinations))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(+d.daily_vaccinations))
        .style("fill", (d, i) => color(i))  // Assign different color for each bar
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)
        .on("click", d => console.log("Clicked on " + d.country + ", Daily Vaccinations: " + d.daily_vaccinations));
});
