
function init() {
  var selector = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    var homeScreen = data.names[0];
    // console.log(homeScreen);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    }); 

    optionChanged(940);
})}



function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}


function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
        Object.entries(result).forEach((key) => {
          PANEL.append("h6").text(key[0] + ": " + key[1] + "\n");
        });
    });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    console.log(data)
    samplesData = data.samples;
    //for the top then OTU bacteria
    var resultArray = samplesData.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result);

    //Top ten bacteria per individual
    var sampleValues=result.sample_values;
    var topTensamplevalues=(sampleValues.slice(0,10)).reverse();

    var bacteriaIds = result.otu_ids;
    var topTenbacteria = (bacteriaIds.slice(0,10)).reverse();

    var otuLabels=result.otu_labels;
    var topLabels=topTenbacteria.map(i => "OTU" + i);

    //for the wfreq measurements graph
    wfreqData=data.metadata;
    var resultwfreqArray = wfreqData.filter(sampleObj => sampleObj.id == sample);
    var resultFreq = resultwfreqArray[0];
    console.log(resultFreq);

    var trace= {
      x: topTensamplevalues,
      y: topLabels,
      text: topLabels,
      type: "bar",
      orientation: "h"
    };
    
    var data1=[trace]

    var layout1 = {
      title: "Top 10 Bacteria per ID",
    };
    //building the bar chart
    Plotly.newPlot("bar", data1, layout1);

    //building the bubble chart 
    var trace1 = {
      x: bacteriaIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
        color: bacteriaIds,
        size: sampleValues
      }
    };

    var data = [trace1];

    var layout = {
      title: 'Washing Frequency Bubble Chart',
      showlegend: false,
      height: 500,
      width: 1000
    };

    Plotly.newPlot('bubble', data, layout);
    
    //BUILDING THE GAUGE CHART=======================
    //data variable
    gaugeData=resultFreq.wfreq;
    // Enter a speed between 0 and 180
    var level = parseFloat(gaugeData)*20;
    console.log("Level: " + level);

    // Trig to calc meter point
    var degrees = 180 - level,
    // console.log("Degrees: " + degrees);
    
    //making radius of the circle
    radius = .5;
    var radians = degrees * Math.PI / 180;
    
    //create radius of the graph for scatter graph
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    //might have to console log these

    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
    // Path: may have to change to create a better triangle
    var mainPath = path1,
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);
    //may have to print this

    var data2 = [{ type: 'scatter',
      x:[0], y:[0],
        marker: {size: 14, color:'850000'},
        showlegend: false,
        name: 'WFreq',
        text: level,
        hoverinfo: 'text+name'},
      { values: [1,1,1,1,1,1,1,1,1,9],
      rotation: 90,
      text: ['8-9','7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ' '],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgb(88, 169, 96)', 'rgb(88, 195, 96)' , 'rgb(152, 244, 161)','rgb(180, 244, 184)','rgb(206, 244, 209)', 'rgb(218, 244, 227)', 'rgb(229, 244, 235)', 'rgb(247, 247, 241)', 'rgb(241, 241, 235)', 'rgb(254, 254, 255)']},
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout2 = {
      shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
      height: 500,
      width: 500,
      title: "<b>Belly Button Washing Frequency - Scrubs per Week</b>",
      xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data2, layout2);

  });
}

init();