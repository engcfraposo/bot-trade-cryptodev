const fs = require('fs');

module.exports = function json(data) {
    let newJson = [];
    fs.readFile('./data.json', 'utf8', (err, json) => {
        if(err) throw err;
        if(newJson.length > 60) {
            newJson.shift();
        }
        newJson = JSON.parse(json).data;
        newJson.push(data);
        fs.writeFileSync('data.json', `{"data":${JSON.stringify(newJson)}}`);
    });
}