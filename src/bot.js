const { Telegraf } = require('telegraf');

function sendOrders(data){
    const bot = new Telegraf('5138986127:AAHgaLXiPjkABWl2bc3XjTKwX20wwwkRTYU');
    bot.telegram.sendMessage(1265660877, JSON.stringify(data, null, 2));
    return null;
}

module.exports ={ sendOrders }
