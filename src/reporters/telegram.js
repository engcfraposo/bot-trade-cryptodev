const { Telegraf } = require('telegraf');

module.exports = function telegram(data){
    const bot = new Telegraf(process.env.BOT_TOKEN);
    const message = `${data.symbol} [${data.side}]: ${new Date()} transação no valor de ${data.cummulativeQuoteQty}`;
    bot.telegram.sendMessage(
        process.env.CHAT_ID_KEY, message
    );
    return null;
}

