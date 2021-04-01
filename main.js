const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 240};

var filenames_network_graph = ['all_movies_network_data_2000', 'all_movies_network_data_2001', 'all_movies_network_data_2002', 'all_movies_network_data_2003',
                                'all_movies_network_data_2004', 'all_movies_network_data_2005', 'all_movies_network_data_2006',
                                'all_movies_network_data_2007', 'all_movies_network_data_2008', 'all_movies_network_data_2009',
                                'all_movies_network_data_2010', 'all_movies_network_data_2011', 'all_movies_network_data_2012',
                                'all_movies_network_data_2013', 'all_movies_network_data_2014', 'all_movies_network_data_2015',
                                'all_movies_network_data_2016', 'all_movies_network_data_2017', 'all_movies_network_data_2018',
                                'all_movies_network_data_2019', 'all_movies_network_data_2020']
var filenames_bar_plot = ['genre_data_all','genre_data_movies', 'genre_data_shows']

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) + 20, graph_1_height = 900;
let graph_2_width = (MAX_WIDTH / 2) + 500, graph_2_height = 900;
let graph_3_width = MAX_WIDTH / 2 + 100 , graph_3_height = 900;

let svg1 = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)     
    .attr("height", graph_1_height)    
    .append("g")
    .style("font-size", 13)
    .style("color", "black")
    .attr("transform", `translate(${margin.left + 30}, ${margin.top})`);    

// Set up reference to count SVG group
let countRef = svg1.append("g");

let svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)    
    .attr("height", graph_2_height)     
    .append("g")
    .attr("transform", `translate(${margin.left - 100}, ${margin.top + 150})`);    // HINT: transform

var svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(-200, 0)`)

function setDataGraph1(index) {
    svg1.selectAll("rect").remove();
    svg1.selectAll("text").remove();

    d3.csv("./data/" + filenames_bar_plot[index] + ".csv").then(function(data_graph1) {
        let x_graph1 = d3.scaleLinear()
            .domain([0, d3.max(data_graph1, function(d) { return parseInt(d.count)})]) 
            .range([0, graph_1_width - margin.left - margin.right]);
    
        // Create a scale band for the y axis (artist)
        let y_graph1 = d3.scaleBand()
            .domain(data_graph1.map(function(d) { return d.genre }))
            .range([0, graph_1_height - margin.top - margin.bottom])
            .padding(0.1); 
    
        // Add y-axis label
        var y_axis = svg1.append("g")
            .call(d3.axisLeft(y_graph1).tickSize(0).tickPadding(10));
        
        y_axis.style("font-size", 13)
    
        let bars = svg1.selectAll("rect").data(data_graph1);
    
        // Define color scale
        let color = d3.scaleOrdinal()
            .domain(data_graph1.map(function(d) { return d['genre'] }))
            .range(d3.quantize(d3.interpolateHcl("#684894", "#b281f7"), data_graph1.length));
    
            
        bars.enter()
            .append("rect")
            .merge(bars)
            .attr("fill", function(d) { return color(d['genre']) }) 
            .attr("x", x_graph1(0))
            .attr("y", function(d) { return y_graph1(d.genre)})             
            .attr("font-size", 20)
            .attr("width", function(d) { return x_graph1(parseInt(d.count)) })
            .attr("height",  y_graph1.bandwidth())
            .on("mouseover", function() {
                d3.select(this)
                    .attr("opacity", 0.7);
            })
            .on("mouseout", function(d, i) {
                d3.select(this).attr("opacity", 1);
            });   

        let counts = countRef.selectAll("text").data(data_graph1);
    
        // Render the text elements on the DOM
        counts.enter()
            .append("text")
            .merge(counts)
            .attr("x", function(d) { return x_graph1(parseInt(d.count)) + 10;})       
            .attr("y", function(d) { return y_graph1(d.genre)+ 15})    
            .style("text-anchor", "start")
            .text(function(d) { return parseInt(d.count) });           
    
    
        // Add x-axis label
        svg1.append("text")
            .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2 + 20},
            ${(graph_1_height - margin.top - margin.bottom) + 15})`)      
            .style("text-anchor", "middle")
            .style("font-size", 17)
            .style("font-weight", "bold")
            .text("Count");
    
        // Add y-axis label
        svg1.append("text")
            .attr("transform", `translate(-180, ${(graph_1_height - margin.top - margin.bottom) / 2})`)       
            .style("text-anchor", "middle")
            .style("font-size", 17)
            .style("font-weight", "bold")
            .text("Genre");
    });
}

setDataGraph1(0);

d3.csv("./data/runtime_data.csv").then(function(data_graph2) {
    //    Add X axis
    var x_graph2 = d3.scaleLinear()
        .domain(d3.extent(data_graph2, function(d) { return parseInt(d.release_year) }))
        .range([0, graph_2_width/2 + 30]);

    svg2.append("g")
        .attr("transform", `translate(300, 570)`)
        .call(d3.axisBottom(x_graph2));

    // Add Y axis
    var y_graph2 = d3.scaleLinear()
        .domain(d3.extent(data_graph2, function(d) { return parseInt(d.average_runtime) }))
        .range([graph_2_height - 330, 0]);

    svg2.append("g")
        .attr("transform", `translate(300, 0)`)
        .call(d3.axisLeft(y_graph2));

    var tooltip = d3.select("#graph2").append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "3px")
        .style("padding", "10px")

    var mouseover = function(d) {
        tooltip
            .style("opacity", 1)
    }

    var mousemove = function(d) {
        tooltip
            .html("<b>Release year</b>: " + d.release_year + "<br> <b>Average runtime</b>: " + parseInt(d.average_runtime) + " min")
            .style("left", (d3.mouse(this)[0]+90) + "px") 
            .style("top", (d3.mouse(this)[1]) + "px")
            .style("left", (d3.event.pageX ) + "px")
            .style("top", (d3.event.pageY) + "px");
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function(d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    // Add dots
    svg2.append('g')
        .selectAll("dot")
        .data(data_graph2) // the .filter part is just to keep a few dots on the chart, not all of them
        .enter()
        .append("circle")
            .attr("transform", `translate(300, 0)`)
            .attr("cx", function (d) { return x_graph2(parseInt(d.release_year)); } )
            .attr("cy", function (d) { return y_graph2(parseInt(d.average_runtime)); } )
            .attr("r", 7)
            .style("fill", "red")
            .style("opacity", 0.5)
            .style("stroke", "red")
        .on("mouseover", mouseover)

        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )

        // Add y-axis label
        svg2.append("text")
        .attr("transform", `translate(100, ${(graph_2_height - margin.top - margin.bottom) / 2 - 140})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 17)
        .style("font-weight", "bold")
        .text("Average runtime (min)");
        
        // Add x-axis label
        svg2.append("text")
            .attr("transform", `translate(670, 650)`)      
            .style("text-anchor", "middle")
            .style("font-size", 17)
            .style("font-weight", "bold")
            .text("Release year");

        // TODO: Add chart title
        svg2.append("text")
            .attr("transform", `translate(650, -60)`)    
            .style("text-anchor", "middle")
            .style("font-size", 20)
            .style("font-weight", "bold")
            .style("text-decoration", "underline")
            .text("Average runtimes for movies by release year");
        
});

function setData(index) {

    svg3.selectAll("*").remove();

    d3.json("./data/" + filenames_network_graph[index] + ".json").then(function(data) {

        /**
         * GRAPH 3 BEGINS
         */
    
        var data_graph3 = data

        var tooltip = d3.select("#graph2").append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            // .style("width", 20 + "px")
            // .style("height", 20 + "px")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "3px")
            .style("padding", "10px")
    
        var mouseover = function(d) {
            tooltip
                .style("opacity", 1)
        }
    
        var mousemove = function(d) {
            tooltip
                .html("<b>Name</b>: " + d.name)
                .style("left", (d3.mouse(this)[0] + 90) + "px") 
                .style("top", (d3.mouse(this)[1] - 10) + "px")
                .style("left", (d3.event.pageX ) + "px")
                .style("top", (d3.event.pageY) + "px");
        }
    
        var mouseleave = function(d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        }

        var link = svg3
            .selectAll("line")
            .data(data_graph3.links)
            .enter()
            .append("line")
            .style("stroke", "#aaa")
        
        var radius = 7
        var repel = -1000 * 1 / data_graph3.nodes.length

        // Initialize the nodes
        var node = svg3
            .selectAll("circle")
            .data(data_graph3.nodes)
            .enter()
            .append("circle")
            .attr("r", radius)
            .style("fill", "#34695d")
            .style("opacity", 0.8)
            .style("stroke", "34695d")
            .on("mouseover", mouseover)

            .on("mousemove", mousemove )
            .on("mouseleave", mouseleave )
    
        var simulation = d3.forceSimulation(data_graph3.nodes)               
            .force("link", d3.forceLink()                               
                    .id(function(d) { return d.id; })                   
                    .links(data_graph3.links)                                  
            )
            .force("charge", d3.forceManyBody().strength(repel))         
            .force("center", d3.forceCenter(graph_3_width / 2, graph_3_height / 2))    
        simulation.on("tick", tickActions)
    
        function tickActions() {
              node
                .attr("cx", function(d) { return d.x = Math.max(margin.left, Math.min(graph_3_height - 200, d.x)); })
                .attr("cy", function(d) { return d.y = Math.max(50, Math.min(graph_3_height - 100, d.y)); });
                
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
        }
                
    });
}

setData(0);
