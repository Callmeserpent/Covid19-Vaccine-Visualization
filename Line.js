// Your modified JavaScript code goes here
const container = d3.select("#line-container");

// Set up the SVG canvas dimensions (CHANGE SIZE HERE)
const margin = { top: 200, right: 40, bottom: 30, left: 300 };
const width = 2000 - margin.left - margin.right;
const height = 1200 - margin.top - margin.bottom;

// Append an SVG element to the container
const svg = container.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create a tooltip
const tooltip = container.append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load the data from the CSV file
d3.csv("line.csv").then(function (data) {
  // Filter data for Afghanistan
  const afghanistanData = data.filter((d) => d.country === "Afghanistan");
  // Filter data for Albania
  const albaniaData = data.filter((d) => d.country === "Albania");
  // Filter data for Algeria
  const algeriaData = data.filter((d) => d.country === "Algeria");
  // Filter data for Angola
  const angolaData = data.filter((d) => d.country === "Angola");
  // Filter data for Israel
  const israelData = data.filter((d) => d.country === "Israel");

  // Set up the scales
  const xScale = d3.scaleBand().range([0, width]).padding(0.1);
  const yScale = d3.scaleLinear().range([height, 0]);

  // Parse month strings into JavaScript Date objects
  const parseMonth = d3.timeParse("%B %y");
  afghanistanData.forEach(function (d) {
    d.month = parseMonth(d.month);
    d.people_vaccinated = +d.people_vaccinated; // Convert to number
  });

  albaniaData.forEach(function (d) {
    d.month = parseMonth(d.month);
    d.people_vaccinated = +d.people_vaccinated; // Convert to number
  });

  algeriaData.forEach(function (d) {
    d.month = parseMonth(d.month);
    d.people_vaccinated = +d.people_vaccinated; // Convert to number
  });

  angolaData.forEach(function (d) {
    d.month = parseMonth(d.month);
    d.people_vaccinated = +d.people_vaccinated; // Convert to number
  });

  israelData.forEach(function (d) {
    d.month = parseMonth(d.month);
    d.people_vaccinated = +d.people_vaccinated; // Convert to number
  });

  // Sort the data by the month
  afghanistanData.sort((a, b) => a.month - b.month);
  albaniaData.sort((a, b) => a.month - b.month);
  algeriaData.sort((a, b) => a.month - b.month);
  angolaData.sort((a, b) => a.month - b.month);
  israelData.sort((a, b) => a.month - b.month);

  // Set the domains for the scales
  xScale.domain(angolaData.map((d) => d.month));
  yScale.domain([0, d3.max(angolaData, (d) => d.people_vaccinated)]);

  // Add the X Axis with month formatting
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%B %y")))
    .selectAll("text")
    .style("font-size", "18px"); // Adjust the font size as needed

  // Add the Y Axis
  svg
    .append("g")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("font-size", "18px"); // Adjust the font size as needed

  // Add y-axis label
  svg
    .append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 150)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "25px")
    .text("Amount of vaccinated people in country");

  // Create a line generator for Afghanistan
  const lineAfghanistan = d3
    .line()
    .x((d) => xScale(d.month))
    .y((d) => yScale(d.people_vaccinated));

  // Add the line
  svg
    .append("path")
    .data([afghanistanData])
    .attr("class", "line")
    .attr("d", lineAfghanistan)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 7) // Adjust the stroke width as needed
    .on("mouseover", function (event) {
      // Find the corresponding data point on the x-axis
      const mouseX = d3.pointer(event)[0];
      const bisect = d3.bisector((d) => xScale(d.month)).left;
      const index = bisect(afghanistanData, mouseX, 0);

      // Show tooltip on mouseover
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `Country: ${afghanistanData[index].country}<br>
         Month: ${afghanistanData[index - 1].month.toLocaleString("default", {
           month: "long",
           year: "2-digit",
         })}<br>
         People Vaccinated: ${afghanistanData[index - 1].people_vaccinated}`
        )
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px")
        .style("font-weight", "bold");
    })
    .on("mousemove", function (event) {
      // Update tooltip position on mousemove
      tooltip
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      // Hide tooltip on mouseout
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .each(function () {
      // Append ISO code text at the end of the line
      const isoCode = afghanistanData[afghanistanData.length - 1].iso_code;
      svg
        .append("text")
        .attr("class", "iso-code-label")
        .attr("x", width)
        .attr(
          "y",
          yScale(afghanistanData[afghanistanData.length - 1].people_vaccinated)
        )
        .attr("dy", "0.35em")
        .style("font-size", "18px")
        .style("fill", "steelblue")
        .style("font-weight", "bold")
        .text(isoCode);
    });
  // Create a line generator for Albania
  const lineAlbania = d3
    .line()
    .x((d) => xScale(d.month))
    .y((d) => yScale(d.people_vaccinated));

  // Add the Albania line
  svg
    .append("path")
    .data([albaniaData])
    .attr("class", "line")
    .attr("d", lineAlbania)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 7) // Adjust the stroke width as needed
    .on("mouseover", function (event) {
      // Find the corresponding data point on the x-axis
      const mouseX4 = d3.pointer(event)[0];
      const bisect4 = d3.bisector((d) => xScale(d.month)).left;
      const index4 = bisect4(albaniaData, mouseX4, 0);

      // Show tooltip on mouseover
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `Country: ${albaniaData[index4].country}<br>
         Month: ${albaniaData[index4 - 1].month.toLocaleString("default", {
           month: "long",
           year: "2-digit",
         })}<br>
         People Vaccinated: ${albaniaData[index4 - 1].people_vaccinated}`
        )
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mousemove", function (event) {
      // Update tooltip position on mousemove
      tooltip
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px")
        .style("font-weight", "bold");
    })
    .on("mouseout", function () {
      // Hide tooltip on mouseout
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .each(function () {
      // Append ISO code text at the end of the line
      const isoCode = albaniaData[albaniaData.length - 1].iso_code;
      svg
        .append("text")
        .attr("class", "iso-code-label")
        .attr("x", width)
        .attr(
          "y",
          yScale(albaniaData[albaniaData.length - 1].people_vaccinated)
        )
        .attr("dy", "0.35em")
        .style("font-size", "18px")
        .style("fill", "green")
        .style("font-weight", "bold")
        .text(isoCode);
    });
  // Create a line generator for Afghanistan
  const lineAlgeria = d3
    .line()
    .x((d) => xScale(d.month))
    .y((d) => yScale(d.people_vaccinated));

  // Add the line
  svg
    .append("path")
    .data([algeriaData])
    .attr("class", "line")
    .attr("d", lineAlgeria)
    .attr("fill", "none")
    .attr("stroke", "pink")
    .attr("stroke-width", 7) // Adjust the stroke width as needed
    .on("mouseover", function (event) {
      // Find the corresponding data point on the x-axis
      const mouseX3 = d3.pointer(event)[0];
      const bisect3 = d3.bisector((d) => xScale(d.month)).left;
      const index3 = bisect3(algeriaData, mouseX3, 0);

      // Show tooltip on mouseover
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `Country: ${algeriaData[index3].country}<br>
         Month: ${algeriaData[index3 - 1].month.toLocaleString("default", {
           month: "long",
           year: "2-digit",
         })}<br>
         People Vaccinated: ${algeriaData[index3 - 1].people_vaccinated}`
        )
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mousemove", function (event) {
      // Update tooltip position on mousemove
      tooltip
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px")
        .style("font-weight", "bold");
    })
    .on("mouseout", function () {
      // Hide tooltip on mouseout
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .each(function () {
      // Append ISO code text at the end of the line
      const isoCode = algeriaData[algeriaData.length - 1].iso_code;
      svg
        .append("text")
        .attr("class", "iso-code-label")
        .attr("x", width)
        .attr(
          "y",
          yScale(algeriaData[algeriaData.length - 1].people_vaccinated)
        )
        .attr("dy", "0.35em")
        .style("font-size", "18px")
        .style("fill", "pink")
        .style("font-weight", "bold")
        .text(isoCode);
    });
  // Create a line generator for Afghanistan
  const lineAngola = d3
    .line()
    .x((d) => xScale(d.month))
    .y((d) => yScale(d.people_vaccinated));

  // Add the line
  svg
    .append("path")
    .data([angolaData])
    .attr("class", "line")
    .attr("d", lineAngola)
    .attr("fill", "none")
    .attr("stroke", "yellow")
    .attr("stroke-width", 7) // Adjust the stroke width as needed
    .on("mouseover", function (event) {
      // Find the corresponding data point on the x-axis
      const mouseX2 = d3.pointer(event)[0];
      const bisect2 = d3.bisector((d) => xScale(d.month)).left;
      const index2 = bisect2(angolaData, mouseX2, 0);

      // Show tooltip on mouseover
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `Country: ${angolaData[index2].country}<br>
       Month: ${angolaData[index2 - 1].month.toLocaleString("default", {
         month: "long",
         year: "2-digit",
       })}<br>
       People Vaccinated: ${angolaData[index2 - 1].people_vaccinated}`
        )
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mousemove", function (event) {
      // Update tooltip position on mousemove
      tooltip
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      // Hide tooltip on mouseout
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .each(function () {
      // Append ISO code text at the end of the line
      const isoCode = angolaData[angolaData.length - 1].iso_code;
      svg
        .append("text")
        .attr("class", "iso-code-label")
        .attr("x", width)
        .attr("y", yScale(angolaData[angolaData.length - 1].people_vaccinated))
        .attr("dy", "0.35em")
        .style("font-size", "18px")
        .style("fill", "yellow")
        .style("font-weight", "bold")
        .text(isoCode);
    });
  // Create a line generator for Israel
  const lineIsrael = d3
    .line()
    .x((d) => xScale(d.month))
    .y((d) => yScale(d.people_vaccinated));

  // Add the line
  svg
    .append("path")
    .data([israelData])
    .attr("class", "line")
    .attr("d", lineIsrael)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 7) // Adjust the stroke width as needed
    .on("mouseover", function (event) {
      // Find the corresponding data point on the x-axis
      const mouseX1 = d3.pointer(event)[0];
      const bisect1 = d3.bisector((d) => xScale(d.month)).left;
      const index1 = bisect1(israelData, mouseX1, 0);

      // Show tooltip on mouseover
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `Country: ${israelData[index1].country}<br>
       Month: ${israelData[index1 - 1].month.toLocaleString("default", {
         month: "long",
         year: "2-digit",
       })}<br>
       People Vaccinated: ${israelData[index1 - 1].people_vaccinated}`
        )
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mousemove", function (event) {
      // Update tooltip position on mousemove
      tooltip
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      // Hide tooltip on mouseout
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .each(function () {
      // Append ISO code text at the end of the line
      const isoCode = israelData[israelData.length - 1].iso_code;
      svg
        .append("text")
        .attr("class", "iso-code-label")
        .attr("x", width)
        .attr("y", yScale(israelData[israelData.length - 1].people_vaccinated))
        .attr("dy", "0.35em")
        .style("font-size", "18px")
        .style("fill", "red")
        .style("font-weight", "bold")
        .text(isoCode);
    });
});
