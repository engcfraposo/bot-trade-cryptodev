const { Telegraf } = require('telegraf');

function sendOrders(data){
    const bot = new Telegraf(process.env.BOT_TOKEN);
    bot.telegram.sendMessage(process.env.CHAT_ID_KEY, JSON.stringify(data, null, 2));
    return null;
}

module.exports ={ sendOrders }
