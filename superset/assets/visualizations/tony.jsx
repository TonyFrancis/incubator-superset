/* eslint-disable no-underscore-dangle, no-param-reassign */
import d3 from 'd3';

require('./tony.css');

function lineAttributes(p1, p2) {
  return {
    x1: p1[0],
    y1: p1[1],
    x2: p2[0],
    y2: p2[1],
  };
}


// Modified from http://bl.ocks.org/kerryrodden/7090426
function tonyVis(slice, payload) {
  const container = d3.select(slice.selector);
  const plotOpts = {
    side: 400,
    margin: { top: 70, left: 150, bottom: 150, right: 150 },
    axis_labels: ['Journalist', 'Developer', 'Designer'],
    axis_ticks: d3.range(0, 101, 20),
    minor_axis_ticks: d3.range(0, 101, 5),
  };

  function ternaryPlot(selector, userOpt) {
    const plot = {
      dataset: [],
    };

    const opt = {
      width: 900,
      height: 900,
      side: 700,
      margin: { top: 50, left: 50, bottom: 50, right: 50 },
      axis_labels: ['A', 'B', 'C'],
      axis_ticks: [0, 20, 40, 60, 80, 100],
      tickLabelMargin: 10,
      axisLabelMargin: 40,
    };

    for (let o in userOpt) {
      opt[o] = userOpt[o];
    }

    container.select('svg').remove();

    const svg = container.append('svg')
                  .attr('width', opt.width)
                  .attr('height', opt.height);
    const axes = svg.append('g').attr('class', 'axes');

    const w = opt.side;
    const h = Math.sqrt(opt.side * opt.side - (opt.side / 2) * (opt.side / 2));

    const corners = [
      [opt.margin.left, h + opt.margin.top], // a
      [w + opt.margin.left, h + opt.margin.top], // b
      [(w / 2) + opt.margin.left, opt.margin.top]]; // c

    function coord(arr) {
      let a = arr[0];
      let b = arr[1];
      let c = arr[2];
      const pos = [0, 0];
      const sum = a + b + c;
      if (sum !== 0) {
        a /= sum;
        b /= sum;
        c /= sum;
        pos[0] = corners[0][0] * a + corners[1][0] * b + corners[2][0] * c;
        pos[1] = corners[0][1] * a + corners[1][1] * b + corners[2][1] * c;
      }
      return pos;
    }
    // axis names
    axes.selectAll('.axis-title')
      .data(opt.axis_labels)
      .enter()
      .append('g')
      .attr('class', 'axis-title')
      .attr('transform', function (d, i) {
        return 'translate(' + corners[i][0] + ',' + corners[i][1] + ')';
      })
      .append('text')
      .text(function (d) { return d; })
      .attr('text-anchor', function (d, i) {
        if (i === 0) return 'end';
        if (i === 2) return 'middle';
        return 'start';
      })
      .attr('transform', function (d, i) {
        let theta = 0;
        if (i === 0) theta = 120;
        if (i === 1) theta = 60;
        if (i === 2) theta = -90;
        const x = opt.axisLabelMargin * Math.cos(theta * 0.0174532925);
        const y = opt.axisLabelMargin * Math.sin(theta * 0.0174532925);
        return 'translate(' + x + ',' + y + ')';
      });


      // ticks
      // (TODO: this seems a bit verbose/ repetitive!);
    const n = opt.axis_ticks.length;
    if (opt.minor_axis_ticks) {
      opt.minor_axis_ticks.forEach(function (v) {
        const coord1 = coord([v, 0, 100 - v]);
        const coord2 = coord([v, 100 - v, 0]);
        const coord3 = coord([0, 100 - v, v]);
        const coord4 = coord([100 - v, 0, v]);

        axes.append('line')
          .attr(lineAttributes(coord1, coord2))
          .classed('a-axis minor-tick', true);

        axes.append('line')
          .attr(lineAttributes(coord2, coord3))
          .classed('b-axis minor-tick', true);

        axes.append('line')
          .attr(lineAttributes(coord3, coord4))
          .classed('c-axis minor-tick', true);
      });
    }

    opt.axis_ticks.forEach(function (v) {
      const coord1 = coord([v, 0, 100 - v]);
      const coord2 = coord([v, 100 - v, 0]);
      const coord3 = coord([0, 100 - v, v]);
      const coord4 = coord([100 - v, 0, v]);

      axes.append('line')
        .attr(lineAttributes(coord1, coord2))
        .classed('a-axis tick', true);

      axes.append('line')
        .attr(lineAttributes(coord2, coord3))
        .classed('b-axis tick', true);

      axes.append('line')
        .attr(lineAttributes(coord3, coord4))
        .classed('c-axis tick', true);


        // tick labels
      axes.append('g')
        .attr('transform', function () {
          return 'translate(' + coord1[0] + ',' + coord1[1] + ')';
        })
        .append('text')
        .attr('transform', 'rotate(60)')
        .attr('text-anchor', 'end')
        .attr('x', -opt.tickLabelMargin)
        .text(function (d) { return v; })
        .classed('a-axis tick-text', true);

      axes.append('g')
          .attr('transform', function () {
            return 'translate(' + coord2[0] + ',' + coord2[1] + ')'
          })
          .append('text')
          .attr('transform', 'rotate(-60)')
          .attr('text-anchor', 'end')
          .attr('x', -opt.tickLabelMargin)
          .text(function (d) { return (100 - v); })
          .classed('b-axis tick-text', true);

      axes.append('g')
          .attr('transform', function (d) {
            return 'translate(' + coord3[0] + ',' + coord3[1] + ')';
          })
          .append('text')
          .text(function (d) { return v; })
          .attr('x', opt.tickLabelMargin)
          .classed('c-axis tick-text', true);
    });


    function scale(p, factor) {
      return [p[0] * factor, p[1] * factor];
    }

    plot.data = function (data, accessor, bindBy) {
    // bind by is the dataset property used as an id for the join
      plot.dataset = data;

      const circles = svg.selectAll('.circle')
        .data(data.map(function (d) { return coord(accessor(d)); }), function (d, i) {
          if (bindBy) {
            return plot.dataset[i][bindBy];
          }
          return i;
        });

      circles.enter().append('circle');
      circles.transition().attr('cx', function (d) { return d[0]; })
      .attr('cy', function (d) { return d[1]; })
      .attr('r', 6);
      return this;
    };

    plot.getPosition = coord;
  //   plot.getTripple = function (x, y) {
  // TODO, get percentages for a give x, y
  // }

    return plot;
  }
  const tp = ternaryPlot(slice.selector, plotOpts);
  function next() {
    const d = [];
    for (let i = 0; i < 100; i++) {
      d.push({
        journalist: Math.random(),
        developer: Math.random(),
        designer: Math.random(),
        label: 'point' + i,
      });
    }
    tp.data(d, function (d) { return [d.journalist, d.developer, d.designer]; }, 'label');
  }
  next();
}

module.exports = tonyVis;
