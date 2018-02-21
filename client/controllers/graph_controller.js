var app = angular.module("graph_app", []);
app.controller("graph_ctrl", function ($scope) {
    console.log("What's up")
    // create an array with nodes
    var nodes = new vis.DataSet([
        { id: 1, label: 'Node 1' },
        { id: 2, label: 'Node 2' },
        { id: 3, label: 'Node 3' },
        { id: 4, label: 'Node 4' },
        { id: 5, label: 'Node 5' }
    ]);

    // create an array with edges
    var edges = new vis.DataSet([
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
        { from: 3, to: 3 }
    ]);

    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {};
    var network = new vis.Network(container, data, options);
            // document.getElementById("raw_read_xbar_from_file").innerHTML = xbar_stat;
            // document.getElementById("lines_break").innerHTML = rfnoc_name_map[0];
      //  }
    //}
    //xhttp.open("GET", "http://10.0.0.73:8000", true);
    //xhttp.send();
})
app.controller("xbar_graph_ctrl", function ($scope) {
    console.log("What's up from xbar controller")
    // create an array with nodes
    var rfnoc_name_map = {
        00: "sfp0",
        01: "sfp1",
        02: "zdma",
        03: "ffdma",
        04: "radio0",
        05: "radio1",
        06: "radio2",
        07: "radio3",
        08: "duc0",
        09: "duc1",
        10: "duc2",
        11: "duc3",
        12: "ddc0",
        13: "ddc1",
        14: "ddc2",
        15: "ddc3"
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var xbar_stat = this.responseText;
            var xbar_stat_split = xbar_stat.split(/\n/)
            var output = [];
            var outputText = [];
            for (var i = 0; i < xbar_stat_split.length; i++) {
                // only push this line if it contains a non whitespace character.
                if (/\S/.test(xbar_stat_split[i])) {
                    outputText.push('"' + $.trim(xbar_stat_split[i]) + '"');
                    output.push($.trim(xbar_stat_split[i]));
                }
            }
            var first_row = output[1].substring(8).split(/[ ,]+/)
            var data_set = []
            for (var i = 0; i < first_row.length; i++) {
                noc_id_count = parseInt(first_row[i])
                var node = {}
                node.id = i;
                node.label = rfnoc_name_map[noc_id_count]
                node.shape = 'square'
                data_set.push(node)

            }
            var nodes = new vis.DataSet(
                data_set
            );

            // create an array with edges
            var edges_data = []
            for (var i = 2; i < output.length; i++) {

                var r = i - 2;

                var row = output[i].split(/[ ,\t]+/)
                for (var j = 1; j < row.length; j++) {
                    if (parseInt(row[j]) > 0) {
                        var edge = {}
                        edge.from = i - 1
                        edge.to = j;
                        edge.arrows = 'to'
                        edge.physics = 'false'
                        edge.value = parseInt(row[j], 16)
                        edges_data.push(edge)
                    }
                }
            }
            var edges = new vis.DataSet(edges_data);

            // create a network
            var container = document.getElementById('mynetwork');
            var data = {
                nodes: nodes,
                edges: edges
            };
            var options = {};
            var network = new vis.Network(container, data, options);
            // document.getElementById("raw_read_xbar_from_file").innerHTML = xbar_stat;
            // document.getElementById("lines_break").innerHTML = rfnoc_name_map[0];
        }
    }
    xhttp.open("GET", "http://localhost:8000/sample_file.log", true);
    xhttp.send();
})