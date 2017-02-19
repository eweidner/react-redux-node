import React, { Component } from 'react';
import * as d3 from "d3";


export default class PopulationPieChart extends Component {

  constructor(props) {
    super(props);
  }


  componentDidUpdate(prevProps, prevState) {
      if (this.props.topStates.length > 0) {
        document.getElementById("populationPieChart").innerHTML = "";
        var data = [];
        this.props.topStates.forEach((state) => {
            data.push({name: state.state.toUpperCase(), count: state[this.props.sortField]});
          }
        )

        var width = 320,
          height = 320,
          radius = Math.min(width, height) / 2;

        var color = d3.scaleOrdinal()
          .range(["#555577","#666688","#667788","#446688","#337788","#338888"]);

        var pie = d3.pie()
          .value(function (d) {
            return d.count;
          })(data);

        var arc = d3.arc()
          .outerRadius(radius - 10)
          .innerRadius(0);

        var labelArc = d3.arc()
          .outerRadius(radius - 40)
          .innerRadius(radius - 40);

        var svg = d3.select("#populationPieChart")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); // Moving the center point. 1/2 the width and 1/2 the height

        var g = svg.selectAll("arc")
          .data(pie)
          .enter().append("g")
          .attr("class", "arc");

        g.append("path")
          .attr("d", arc)
          .style("fill", function (d) {
            return color(d.data.name);
          });

        g.append("text")
          .attr("transform", function (d) {
            var translation = "translate(" + (labelArc.centroid(d)[0] - 5) + "," +labelArc.centroid(d)[1] + ")";
            //var translation =  "translate(" + labelArc.centroid(d) + ")";
            return(translation);
          })
          .text(function (d) {
            return d.data.name;
          })
          .style("fill", "#ddc");
      }


  }



  render() {
      console.info("Render");
      return (
        <div id="populationPieChart" className="popPieChartHolder"></div>
      );
  }

}
