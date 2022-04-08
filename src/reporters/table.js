let dataToTable = [];

module.exports = function table(data){
    if(dataToTable.length > 4) {
        dataToTable.shift();
    }
    dataToTable.push(data);
    console.table(dataToTable);
}