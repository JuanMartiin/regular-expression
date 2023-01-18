var fs = require('fs'); 
var parser = require('./gramatica');


fs.readFile('./entrada.txt', (err, data) => {
    if (err) throw err;
    var expected = parser.parse(data.toString());
    if(expected != true){
        console.log(expected);
    }
});