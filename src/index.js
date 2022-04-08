require('dotenv').config();
const credentials = require('./credentials');
const indicators = {
    calcRSI: require('./indicators/rsi'),
    calcMFI: require('./indicators/mfi'),
    calcTendency: require('./indicators/tendency'),
}
const interactions = {
    symbol: require('./interactions/symbol'),
}
const reporters = {
    telegram: require('./reporters/telegram'),
    json: require('./reporters/json'),
    table: require('./reporters/table'),
}
const services = {
    klines: require('./services/klines'),
    ...require('./services/orders'),
}
const validators = {
    highTendencyAndHasOrder: require('./validators/highTendencyAndHasOrder'),
    lowTendencyHasBalanceAndOrder: require('./validators/lowTendencyHasBalanceAndOrder'),
}
const views = {
    modelData: require('./views/modelData'),
}

let status = "N/A";
let symbol = "";
let order = 0;
let BALANCE_WALLET = 1000;
let BALANCE_CRYPTO = 0;
let CRYPTO_QTD = 0.001;
let LIMIT_ORDER = 5;

const bot = {
    async run() {
        status = "N/A";
        symbol = symbol?symbol:interactions.symbol();
        const { price, closes, volumes } = await services.klines(symbol);
        const { mfi, mfiFormatted }= indicators.calcMFI(volumes);
        const { rsi, rsiFormatted } = indicators.calcRSI(closes);  
        const { tendency, media, mediaFormatted } = indicators.calcTendency(closes);
        const generalSellCriteria = validators
        .highTendencyAndHasOrder(tendency, order);
        const generalBuyCriteria = validators
        .lowTendencyHasBalanceAndOrder(tendency, BALANCE_WALLET, order, LIMIT_ORDER);
        
        if(
            (rsi >= 70 && mfi >= 40 && generalSellCriteria)
            || (price >= media * 1.05 && generalSellCriteria)
        ){  
            const sellResult = await services.sell(credentials, symbol, CRYPTO_QTD);
            BALANCE_WALLET += parseFloat(sellResult.cummulativeQuoteQty);
            BALANCE_CRYPTO -= CRYPTO_QTD;
            order -=1;
            status = 'Sobrecomprado';
            reporters.telegram(sellResult);
        }

        if(
            (rsi > 30 && rsi < 70 && mfi > 40 && mfi < 60) 
            || order > LIMIT_ORDER
        ){
            status = 'N/A';
        }

        if(
            (rsi <= 30 && mfi <= 60 && generalBuyCriteria)
            || (price <= media*0.95 && generalBuyCriteria)
        ){           
            const buyResult = await services.buy(credentials, symbol, CRYPTO_QTD);
            BALANCE_WALLET -= parseFloat(buyResult.cummulativeQuoteQty);
            BALANCE_CRYPTO += CRYPTO_QTD;
            order +=1;
            status = 'Sobrevendido';
            reporters.telegram(buyResult);
        }

        const data = views.modelData(
            symbol,
            order,
            LIMIT_ORDER,
            rsiFormatted,
            mfiFormatted,
            price,
            BALANCE_WALLET,
            BALANCE_CRYPTO,
            status,
            mediaFormatted,
            tendency,
        );

        process.stdout.write('\033c');
        reporters.table(data);
        reporters.json(data);
    },
}

setInterval(bot.run, 30000);

bot.run();