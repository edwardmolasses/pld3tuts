var w = 500;
var h = 120;
var padding = 2;
var dataset = [5 ,10 ,13 , 19, 21, 25, 11, 25, 22, 18, 7];
var svg = d3.select("body")
            .append("svg")
            .attr("width",w)
            .attr("height",h);

svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr({
      x: function(d, i) {
        return i * (w / dataset.length);
      },
      y: function (d, i) {
        return h - (d*4);
      },
      width: w / dataset.length - padding,
      height: function(d, i) {
        return (d*4);
      },
      fill: function(d, i) {
        return "rgb(" + (d*10) + ", 0, 0)";
      }
    });

svg.selectAll("text")
  .data(dataset)
  .enter()
  .append("text")
  .text(function(d) {
    return d;
  })
  .attr({
    "text-anchor": "middle",
    "font-family": "sans-serif",
    x: function(d, i) { return i * (w / dataset.length) + (w / dataset.length - padding) / 2; },
    y: function(d, i) {
      return h - (d*4);
    }
  })