const readline = require('readline-sync');

module.exports = function symbol() {
    const prefixes = ["BTCUSDT", "ETHUSDT", "BNBUSDT"];
    const selectedPrefixIndex = readline.keyInSelect(prefixes, "Choose one option");
        return prefixes[selectedPrefixIndex];
}