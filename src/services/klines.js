const axios = require('axios');

module.exports = async function klines(symbol) {
    const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m`)
    const candle = response.data[499];
    const closes = response.data.map(allCandles => parseFloat(allCandles[4]));
    const volumes = response.data.map(allCandles => allCandles[5]);
    const price = parseFloat(candle[4]);
    return {price, closes, volumes};
}
