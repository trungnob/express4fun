var express = require('express');
var path = require('path')
var app = express();
port = 8000;
function log(req, err, next){
    console.log(new Date(), req.method, req.url)
    next()
}
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(log)
app.get('/',function(req,res){
    //res.write('Hello World')
    var foo
    //res.sendFile(path.join(__dirname + '/sample_file.log'))
    var SSH = require('simple-ssh');
    console.log(req)
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
})



app.listen(port,function(err,resp){
    if (err){
        console.log(`Server errror`)
    }else{
        console.log('Server started on port '+port)
    }
});
