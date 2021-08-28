function data(sample) {
    d3.json("./samples.json").then((data) => {
        var metadata = data.metadata;
        var array = metadata.filter(Object => Object.id == sample);
        var result = array[0];
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });


    });
}

function chart(sample) {
d3.json("./samples.json").then((data) => {
    var samples = data.samples;
    var array = samples.filter(Object => Object.id == sample)
    var result = array[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.sample_values;
    var sample_values = result.sample_values;

    var bubbleLayout = {
        title: "Bacteria",
        margin: { t:0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID"},
        margin: { t: 30}
    };

    var bubbleData = [
        {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
        {
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            test: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        }
    ];

    var barLayout = {
        title: "Top Bacteria",
        margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);
});
}

function init() {
    var selector = d3.select("#selDataset");
    d3.json("./samples.json").then((newdata) => {
        var sampleNames = newdata.names;
        sampleNames.forEach((sample) => {
            selector.append("option").text(sample).property("value", sample);
        });

    var firstSample = sampleNames[0];
    chart(firstSample);
    data(firstSample);
    });

}

function optionChanged(newSample) {
    chart(newSample);
    data(newSample);
}

init();