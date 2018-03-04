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
app.controller("xbar_graph_ctrl", function ($http, $scope) {
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
        08: "ddc0",
        09: "ddc1",
        10: "ddc2",
        11: "ddc3",
        12: "duc0",
        13: "duc1",
        14: "duc2",
        15: "duc3"
    }
    var nodes = null
    var edges = null
    $http.get('xbar').then(function (response) {
            var xbar_stat = response.data;
            var xbar_stat_split = xbar_stat.split(/\n/)
            var output = [];
            var outputText = [];
            for (var i = 0; i < xbar_stat_split.length; i++) {
                // only push this line if it contains a non whitespace character.
                if (/\S/.test(xbar_stat_split[i])) {
                    outputText.push('**' + $.trim(xbar_stat_split[i]) + '<br>');
                    output.push($.trim(xbar_stat_split[i]));
                }
            }
            var first_row = output[1].substring(8).split(/[ ,]+/)
            var data_set = []
            for (var i = 0; i < first_row.length; i++) {
                noc_id_count = parseInt(first_row[i])
                var node = {}
                node.id = i;
                node.label = rfnoc_name_map[noc_id_count] //noc_id_count.toString()//rfnoc_name_map[noc_id_count]
                node.shape = 'square'
                data_set.push(node)

            }
             nodes = new vis.DataSet(
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
                        edge.id= r*(row.length-1)+j-1
                        edge.from = r
                        edge.to = j-1;
                        edge.arrows = 'to'
                        edge.physics = 'false'
                        edge.value = parseInt(row[j], 16)
                        edge.font = {align: 'top'}
                        edge.scaling = {min: 0,
                                        max: 30,
                                        customScalingFunction: function (min,max,total,value) {
                                                absolutemin= 0;
                                                absolutemax= 0xFFFFFFF ;
                                                var scale = 1 / (absolutemax - absolutemin);
                                                return Math.max(0,(value - absolutemin)*scale);

                                            }
                                        }
                        edges_data.push(edge)
                    }
                }
            }
            edges = new vis.DataSet(edges_data);

            // create a network
            var container = document.getElementById('mynetwork');
            var data = {
                nodes: nodes,
                edges: edges
            };
            var options = {};
            var network = new vis.Network(container, data, options);
            //document.getElementById("raw_read_xbar_from_file").innerHTML = outputText;
            // document.getElementById("lines_break").innerHTML = rfnoc_name_map[0];

    },function errorCallback(response) {
        console.log("Error");
    })
    setInterval(function(){
        if (nodes != null)
             $http.get('xbar').then(function (response) {
                var xbar_stat = response.data;
                var xbar_stat_split = xbar_stat.split(/\n/)
                var output = [];
                var outputText = [];
                for (var i = 0; i < xbar_stat_split.length; i++) {
                // only push this line if it contains a non whitespace character.
                if (/\S/.test(xbar_stat_split[i])) {
                    output.push($.trim(xbar_stat_split[i]));
                }
                }
                // var first_row = output[1].substring(8).split(/[ ,]+/)
                // var data_set = []
                // for (var i = 0; i < first_row.length; i++) {
                //     noc_id_count = parseInt(first_row[i])
                //     var node = {}
                //     node.id = i;
                //     node.label = rfnoc_name_map[noc_id_count]
                //     node.shape = 'square'
                //     data_set.push(node)

                // }
                // var nodes = new vis.DataSet(
                //     data_set
                // );
                // create an array with edges
                var edges_data = []
                var previous_edge = 0
                for (var i = 2; i < output.length; i++) {
                var r = i - 2;
                var row = output[i].split(/[ ,\t]+/)
                for (var j = 1; j < row.length; j++) {
                        var edge_id = r*(row.length-1)+j-1
                        var new_edge_value = parseInt(row[j],16)
                        previous_edge = edges.get(edge_id)
                        if (new_edge_value != 0){
                            if(previous_edge != null){
                                if (previous_edge.value != new_edge_value){
                                    previous_edge.value = new_edge_value
                                    previous_edge.label = new_edge_value.toString(16)
                                    previous_edge.color = {color: 'red'}
                                    edges.update(previous_edge)
                                    console.log("Update Edge "+ previous_edge.from + " " +previous_edge.to+ " " + previous_edge.value.toString(16));
                                }
                            }else{
                                var edge = {}
                                edge.id= r*(row.length-1)+j-1
                                edge.from =r
                                edge.to = j-1;
                                edge.arrows = 'to'
                                edge.physics = 'false'
                                edge.value = new_edge_value
                                edges.add(edge)
                            }
                        }
                    }
                }
            })
    },1000)

})