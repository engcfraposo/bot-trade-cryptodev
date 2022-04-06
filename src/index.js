const axios = require('axios');
const currencyFormatter = require('currency-formatter');
const fs = require('fs');
const api =require('./api');
const bot = require('./bot');

let credentials = {
    apiKey:"977iNDaM1MM2ph2T8aVISXGy7C8Br3VzSajInug6V55mOUEqs6RT1iUYRkDcyoPG",
    apiSecret:"kUO7J4FeXjoGCrXZoHmIXfGfbVZu5XJCPQ3pj94VE9lWVNGDva6tzNPUFYwg0sJa",
    test:true,
};

let status = "N/A";
let order = 0;
let BALANCE_WALLET = 100000;
let BALANCE_BTC = 0;
let BTC_QTD = 0.001;
let LIMIT_ORDER = 5;
const process = {
    _calcRSI(closes) {
        let gains = 0;
        let losses = 0;
        for(let i = closes.length - 14; i < closes.length; i++) {
            const diff = closes[i] - closes[i - 1];
            if(diff >= 0) {
                gains += diff;
            }
            if(diff < 0) {
                losses -= diff;
            }
        }
        const strength = gains / losses;
        return 100 - (100 / (1 + strength));
    },
    /** 
    * @deprecated Legacy
    */
    _priceFormatter(price, currency){
        return currencyFormatter.format(price, { code: currency });
    },
    _exportJson(data) {
        let newJson = [];
        fs.readFile('./data.json', 'utf8', (err, json) => {
            if(err) throw err;
            newJson = JSON.parse(json);
            newJson.push(data);
            fs.writeFileSync('data.json', JSON.stringify(newJson));
        });
    },
    async init() {
        status = "N/A";
        const symbol = "BTCUSDT";
        const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m`)
        const candle = response.data[499];
        const closes =response.data.map(allCandles => allCandles[4]);
        const rsi = process._calcRSI(closes);
        const price = parseFloat(candle[4]);
        const rsiFormatted = `${rsi.toFixed(2)}%`;
        
        if(
            rsi >= 70 
            && order <= LIMIT_ORDER 
            && order !== 0
        ){
            status = ('Sobrecomprado');
            const sellResult = await api.sell(credentials, symbol, BTC_QTD);
            bot.sendOrders(sellResult);
            console.log(sellResult.cummulativeQuoteQty)
            BALANCE_WALLET += parseFloat(sellResult.cummulativeQuoteQty);
            BALANCE_BTC -= BTC_QTD;
            order -=1;
        }
        if(
            rsi <= 70 
            && order > LIMIT_ORDER
        ){
            status = ('Limite Alcançado');
        }
        if(
            rsi <= 30 
            && BALANCE_WALLET > 0 
            && price < BALANCE_WALLET 
            && order < LIMIT_ORDER
        ){
            status = ('Sobrevendido');
            const buyResult = await api.buy(credentials, symbol, BTC_QTD);
            BALANCE_WALLET -= parseFloat(buyResult.cummulativeQuoteQty);
            bot.sendOrders(buyResult);
            BALANCE_BTC += BTC_QTD;
            order +=1;
        }

        const data = {
            rsi: rsiFormatted, 
            price, 
            time: new Date().toISOString(), 
            status, 
            balance: BALANCE_WALLET, 
            btc: BALANCE_BTC,
            orders: `${order}/${LIMIT_ORDER}`,
        };

        console.table(data);
        process._exportJson(data);
    }
}

setInterval(process.init, 60000);

process.init();