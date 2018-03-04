var express = require('express');
var path = require('path')
var app = express();
port = 8000;
function log(req, err, next){
    console.log(new Date(), req.method, req.url)
    next()
}
app.use(express.static(__dirname))
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(log)

app.get('/',function(req,res){
    //res.write('Hello World')
    res.sendFile(path.join(__dirname + '/client/graph.html'))
    console.log(path.join(__dirname + '/simplegraph.html'))
})
app.get('/xbar_stats', function (req, res) {
    //res.write('Hello World')
    var SSH = require('simple-ssh');
    var ssh = new SSH({
    host: 'ni-n3xx-311fe01',
    user: 'root',
    pass: ''
    });
    ssh.exec('cat /sys/kernel/debug/rfnoc_crossbars/crossbar0/stats', {
    out: function(stdout) {
        res.write(stdout);
        res.end();
    }
}).start();
    console.log(path.join(__dirname + '/simplegraph.html'))
})
app.get('/xbar', function (req, res) {
    //res.write('Hello World')
    const { exec } = require('child_process');
    console.log("reading..")
    exec('cat /sys/kernel/debug/rfnoc_crossbars/crossbar0/stats',(e,o,se) => {
        console.log("writting response..")
        res.write(o);
        res.end();
})

})
app.get('/temp0', function (req, res) {
    //res.write('Hello World')
    const { exec } = require('child_process');
    console.log("reading..")
    exec('cat /sys/kernel/debug/rfnoc_crossbars/crossbar0/stats',(e,o,se) => {
        console.log("writting response..")
        res.write(o);
        res.end();
})

})
app.listen(port,function(err,resp){
    if (err){
        console.log(`Server errror`)
    }else{
        console.log('Server started on port '+port)
    }
});
