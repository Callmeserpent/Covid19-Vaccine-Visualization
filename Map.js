// The container
const container = d3.select("#map-container");

// The svg
const svg = container.select("#map_dataviz")
  .append("svg")
  .attr("width", 1500)
  .attr("height", 800);

const width = +svg.attr("width");
const height = +svg.attr("height");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(140)
  .center([0, 20])
  .translate([width / 2, height / 2]);

// Data and color scale
const data = d3.map();
const colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);
const tooltip = d3.select("#tooltip");

// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .defer(d3.csv, "https://gist.githubusercontent.com/HLS2001/506ecb91470a5ffb36bd4c97f182a694/raw/ebd6acb2af8e74b1d6354afb032be4ba6ed01dae/vy.csv", function (d) {
    // Convert necessary columns to appropriate data types
    d.total_vaccine = +d.total_vaccine;
    d.year = +d.year;
    return d;
  })
  .await(ready);

// Khối mã thứ ba
// Tạo một phần tử div để chứa color legend
const legendContainer = d3.select("#map-container")
  .append("div")
  .attr("class", "legend-container");

// Mảng chứa các giá trị ngưỡng của color scale
const thresholds = colorScale.domain();

// Vẽ color legend
legendContainer.selectAll("div")
  .data(thresholds)
  .enter()
  .append("div")
  .attr("class", "legend-item")
  .style("background-color", function (d) {
    return colorScale(d);
  })
  .text(function (d, i) {
    if (i === 0) {
      return " < " + d.toLocaleString();
    } else if (i === thresholds.length - 1) {
      return " > " + thresholds[i - 1].toLocaleString();
    } else {
      return d.toLocaleString() + " - " + thresholds[i - 1].toLocaleString();
    }
  });

function ready(error, topo, csvData) {
  if (error) throw error;

  // Merge vaccine data into GeoJSON
  topo.features.forEach(function (feature) {
    const countryData = csvData.filter(function (d) {
      return d.location.toLowerCase() === feature.properties.name.toLowerCase();
    });

    if (countryData.length > 0) {
      // Tính tổng vaccine của cả hai năm
      feature.properties.total_vaccine = d3.sum(countryData, function (d) { return d.total_vaccine; });
    }
  });

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    .attr("d", d3.geoPath().projection(projection))
    .attr("fill", function (d) {
      d.total_vaccine = d.properties.total_vaccine || 0;
      return colorScale(d.total_vaccine);
    })
    .style("stroke", "transparent")
    .attr("class", function (d) { return "Country" })
    .style("opacity", .8)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave);
}

// Define mouseover and mouseleave functions
function mouseOver(d) {
  d3.selectAll(".Country")
    .transition()
    .duration(200)
    .style("opacity", .5);
  d3.select(this)
    .transition()
    .duration(200)
    .style("opacity", 1)
    .style("stroke", "black");

  // Hiển thị tooltip với thông tin tên nước và tổng số vắc xin
  tooltip.transition()
    .duration(200)
    .style("opacity", .9);
  tooltip.html("<strong>" + d.properties.name + "</strong><br>Total Vaccine: " + (d.total_vaccine || 0))
    .style("left", (d3.event.pageX + 5) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
}

function mouseLeave(d) {
  d3.selectAll(".Country")
    .transition()
    .duration(200)
    .style("opacity", .8);
  d3.select(this)
    .transition()
    .duration(200)
    .style("stroke", "transparent");

  // Ẩn tooltip khi chuột rời khỏi quốc gia
  tooltip.transition()
    .duration(500)
    .style("opacity", 0);
}
