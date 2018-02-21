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
app.get('/xbar_stat', function (req, res) {
    //res.write('Hello World')
    res.sendFile(path.join(__dirname + '/sample_file.log'))
    console.log(path.join(__dirname + '/simplegraph.html'))
})
app.listen(port,function(err,resp){
    if (err){
        console.log(`Server errror`)
    }else{
        console.log('Server started on port '+port)
    }
});
