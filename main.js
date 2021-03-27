// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 240};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2), graph_1_height = 400;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let svg1 = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)     // HINT: width
    .attr("height", graph_1_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left + 30}, ${margin.top})`);    // HINT: transform

// Set up reference to count SVG group
let countRef = svg1.append("g");

let svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)     // HINT: width
    .attr("height", graph_2_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left - 100}, ${margin.top})`);    // HINT: transform

var svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${margin.right}, ${margin.top})`);

// TODO: Load the artists CSV file into D3 by using the d3.csv() method
d3.csv("../data/netflix.csv").then(function(data) {
    // TODO: Clean and strip desired amount of data for barplot
        /*
        HINT: use the parseInt function when looking at data from the CSV file and take a look at the
        cleanData function below.

        Use your NUM_EXAMPLES defined in d3_lab.html.
     */
    data_graph1 = cleanDataGraph1(data);
    data_graph1 = sortData(data_graph1, function (genre1, genre2) {return parseInt(genre2['count'], 10) - parseInt(genre1['count'], 10)});
    
    data_graph2 = cleanDataGraph2(data);
    data_graph2 = getAverageDurations(data_graph2);
    // data_graph2 = sortData(data_graph2, function (year1, year2) {return parseInt(year2['average'], 10) - parseInt(year1['average'], 10)});

    data_graph3 = cleanDataGraph3(data);
    console.log("nodes", JSON.stringify(data_graph3.nodes).length)
    console.log("links", JSON.stringify(data_graph3.links[0]))

    /**
     * GRAPH 1 BEGINS
     */

// TODO: Create a linear scale for the x axis (number of occurrences)
    let x_graph1 = d3.scaleLinear()
        .domain([0, d3.max(data_graph1, function(d) { return d.count})]) 
        .range([0, graph_1_width - margin.left - margin.right]);
    /*
        HINT: The domain and range for the linear scale map the data points
        to appropriate screen space.

        The domain is the interval of the smallest to largest data point
        along the desired dimension. You can use the d3.max(data, function(d) {...})
        function to get the max value in the dataset, where d refers to a single data
        point. You can access the fields in the data point through d.count or,
        equivalently, d["count"].

        The range is the amount of space on the screen where the given element
        should lie. We want the x-axis to appear from the left edge of the svg object
        (location 0) to the right edge (width - margin.left - margin.right).
     */

    // TODO: Create a scale band for the y axis (artist)
    let y_graph1 = d3.scaleBand()
        .domain(data_graph1.map(function(d) { return d.genre }))
        .range([0, graph_1_height - margin.top - margin.bottom])
        .padding(0.1);  // Improves readability
    /*
        HINT: For the y-axis domain, we want a list of all the artist names in the dataset.
        You might find JavaScript's map function helpful.

        Set up the range similar to that of the x-axis. Instead of going from the left edge to
        the right edge, we want the y-axis to go from the top edge to the bottom edge. How
        should we define our boundaries to incorporate margins?
     */

    // TODO: Add y-axis label
    svg1.append("g")
        .call(d3.axisLeft(y_graph1).tickSize(0).tickPadding(10));
    // HINT: The call function takes in a d3 axis object. Take a look at the d3.axisLeft() function.
    // SECOND HINT: Try d3.axisLeft(y).tickSize(0).tickPadding(10). At check in, explain to TA
    // what this does.

    /*
        This next line does the following:
            1. Select all desired elements in the DOM
            2. Count and parse the data values
            3. Create new, data-bound elements for each data value
     */
    let bars = svg1.selectAll("rect").data(data_graph1);

    // OPTIONAL: Define color scale
    let color = d3.scaleOrdinal()
        .domain(data_graph1.map(function(d) { return d['genre'] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), data_graph1.length));


    // TODO: Render the bar elements on the DOM
    /*
        This next section of code does the following:
            1. Take each selection and append a desired element in the DOM
            2. Merge bars with previously rendered elements
            3. For each data point, apply styling attributes to each element
     */
    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['genre']) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
        .attr("x", x_graph1(0))
        .attr("y", function(d) { return y_graph1(d.genre)})               // HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
        .attr("width", function(d) { return x_graph1(parseInt(d.count)) })
        .attr("height",  y_graph1.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height
    /*
        HINT: The x and y scale objects are also functions! Calling the scale as a function can be
        used to convert between one coordinate system to another.

        To get the y starting coordinates of a data point, use the y scale object, passing in a desired
        artist name to get its corresponding coordinate on the y-axis.

        To get the bar width, use the x scale object, passing in a desired artist count to get its corresponding
        coordinate on the x-axis.
     */
    /*
        In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
        bar plot. We will be creating these in the same manner as the bars.
     */
    let counts = countRef.selectAll("text").data(data_graph1);

    // TODO: Render the text elements on the DOM
    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) { return x_graph1(parseInt(d.count)) + 10;})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", function(d) { return y_graph1(d.genre)+ 5})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("text-anchor", "start")
        .text(function(d) { return parseInt(d.count) });           // HINT: Get the count of the artist


    // TODO: Add x-axis label
    svg1.append("text")
        .attr("transform", "translate(200, 630)")       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        // .style("font-size", 15)
        .text("Count");

    // TODO: Add y-axis label
    svg1.append("text")
        .attr("transform", "translate(-200, 250)")       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        // .style("font-size", 15)
        .text("Genre");

    // TODO: Add chart title
    svg1.append("text")
        .attr("transform", "translate(180, -20)")       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        // .style("font-size", 20)
        .text("Number of titles per genre");


    /**
     *  GRAPH 2 BEGINS
     */

//    Add X axis
    var x_graph2 = d3.scaleLinear()
        .domain(d3.extent(data_graph2, function(d) { return parseInt(d.release_year) }))
        .range([0, graph_2_width]);

    svg2.append("g")
        .attr("transform", "translate(0, 210)")
        .call(d3.axisBottom(x_graph2));

    // Add Y axis
    var y_graph2 = d3.scaleLinear()
        .domain(d3.extent(data_graph2, function(d) { return d.average }))
        .range([graph_2_height, 0]);

    svg2.append("g")
        .call(d3.axisLeft(y_graph2));

    // svg2.append("path")
    //     .datum(data_graph2)
    //     .attr("fill", "none")
    //     .attr("stroke", "#69b3a2")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", d3.line()
    //     .x(function(d) { return x_graph2(d.release_year) })
    //     .y(function(d) { return y_graph2(d.average) })
    //     )

    // Add dots
    svg2.append('g')
        .selectAll("dot")
        .data(data_graph2)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x_graph2(d.release_year); } )
        .attr("cy", function (d) { return y_graph2(d.average); } )
        .attr("r", 1.5)
        .style("fill", "#69b3a2")
    
    /**
     * GRAPH 3 BEGINS
     */

    var link = svg3
    .selectAll("line")
    .data(data_graph3.links)
    .enter()
    .append("line")
    .style("stroke", "#aaa")

    // Initialize the nodes
    var node = svg3
        .selectAll("circle")
        .data(data_graph3.nodes)
        .enter()
        .append("circle")
        .attr("r", 20)
        .style("fill", "#69b3a2")

    // Let's list the force we wanna apply on the network
    var simulation = d3.forceSimulation(data_graph3.nodes)                 // Force algorithm is applied to data.nodes
        .force("link", d3.forceLink()                               // This force provides links between nodes
                .id(function(d) { return d.id; })                     // This provide  the id of a node
                .links(data_graph3.links)                                    // and this the list of links
        )
        .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force("center", d3.forceCenter(graph_3_width / 2, graph_3_height / 2))     // This force attracts nodes to the center of the svg area
        .on("end", ticked);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function (d) { return d.x+6; })
            .attr("cy", function(d) { return d.y-6; });
    }

});



/**
 * Finds number of movies in each genre
 */
function cleanDataGraph1(data) {
    var genreData = []
    var genreIndices = []
    var genreIndex = 0
    for (var i = 0; i < data.length; i++) {
        var genres = data[i].listed_in.split(',')
        for (var j = 0; j < genres.length; j++) {
            var genre = genres[j].replace(/^\s+|\s+$/g, '')
            if (genreIndices.includes(genre)) {
                // we've seen this genre before
                genreIndex = genreIndices.findIndex(function(g) { return g == genre})
                genreData[genreIndex]['count'] += 1
            } else {
                // we haven't seen this genre yet
                genreIndices.push(genre)
                genreData.push({'genre': genre, 'count': 1})
            }
        }
    }
    return genreData
}

function sortData(data, comparator) {
    data = data.sort(comparator)
    // return data.slice(0, numExamples)
    return data
}

/**
 * Finds durations for each year
 */
function cleanDataGraph2(data) {
    var yearData = []
    var yearIndices = []
    var yearIndex = 0
    for (var i = 0; i < data.length; i++) {
        if (data[i].type == 'TV Show' || parseInt(data[i].release_year) < 2000) {
            continue
        }
        var year = parseInt(data[i].release_year)
        var movieDuration = data[i].duration.split(' ')[0].replace(/^\s+|\s+$/g, '')
        if (yearIndices.includes(year)) {
            // we've seen this genre before
            yearIndex = yearIndices.findIndex(function(y) { return y == year})
            yearData[yearIndex]['durations'].push(movieDuration)
        } else {
            // we haven't seen this genre yet
            yearIndices.push(year)
            yearData.push({'release_year': year, 'durations': [movieDuration]})
        }
    }
    return yearData
}

function getAverageDurations(data) {
    averageDursData = []
    for (var i = 0; i < data.length; i++) {
        var avg = data[i].durations.reduce((dur1, dur2) => (parseInt(dur1) + parseInt(dur2))) / data[i].durations.length
        averageDursData.push({'release_year': data[i].release_year, 'average': avg})
    }
    return averageDursData
}

/**
 * Makes nodes and links of actors
 */
function cleanDataGraph3(data) {
    var actorData = {"nodes" : [], "links" : []}
    var nameToId = []
    var id = 1
    for (var i = 0; i < data.length; i++) {
        if (data[i].type == 'TV Show' || parseInt(data[i].release_year) != 2018) {
            // skip if not movie
            continue
        }

        // find all actors in this movie's cast
        var actorList = data[i].cast.split(',')
        // console.log("actor list", actorList)
        // add to nodes
        for (var j = 0; j < actorList.length; j++) {
            var actorName = actorList[j].replace(/^\s+|\s+$/g, '')
            if (!actorData.nodes.some(element => element.name == actorName)) {
                // the actor is not in our node list
                actorData.nodes.push({"id" : id, "name" : actorName})
                // console.log("id", id)
                // console.log("name", actorName)
                nameToId[actorName] = id
                id += 1
            }
        }
        // console.log("name to id", nameToId)

        // add to links (in an undirected graph way)
        for (j = 0; j < actorList.length; j++) {
            for (var k = 1; k < actorList.length; k++) {            
                var actor1 = actorList[j].replace(/^\s+|\s+$/g, '')
                var actor2 = actorList[k].replace(/^\s+|\s+$/g, '')
                // console.log("nametoid of actor", actor1, ":", nameToId[actor1])
                var pair = {"source" : nameToId[actor1], "target" : nameToId[actor2]}
                // console.log("curr source:", pair.source, "curr target", pair.target)
                // console.log(pair in actorData.links)
                if (!(pair in actorData.links)) {
                    // the actor pair is not in our links list
                    actorData.links.push(pair)
                }            
            } 
        }
    }
    return actorData
}