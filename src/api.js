const axios = require('axios');
const queryString = require('querystring');
const crypto = require('crypto');

async function buy(credentials, symbol, quantity) {
    const data = { symbol, side: 'BUY', type: 'MARKET', quantity };
    return order(credentials, data);
}

async function sell(credentials, symbol, quantity) {
    const data = { symbol, side: 'SELL', type: 'MARKET', quantity };
    return order(credentials, data);
}

async function accountInfo(credentials){
    return balance(credentials)
}

async function balance(credentials){
    const { apiKey, apiSecret, test } = credentials;

    if (!apiKey || !apiSecret)
        throw new Error('Preencha corretamente sua API KEY e SECRET KEY');

    const timestamp = Date.now();
    const recvWindow = 60000;
    const data = {type: "SPOT"};
    const signature = crypto
        .createHmac('sha256', apiSecret)
        .update(`${queryString.stringify({ ...data, timestamp, recvWindow })}`)
        .digest('hex');

    const newData = { ...data, timestamp, recvWindow, signature };
    const qs = `?${queryString.stringify(newData)}`;
    const url = test ? `https://testnet.binance.vision/sapi/v1/accountSnapshot${qs}` : `https://api.binance.com/sapi/v1/accountSnapshot${qs}`;

    try {
        const result = await axios({
            method: 'GET',
            url,
            headers: { 'X-MBX-APIKEY': apiKey }
        });
        return result.data;
    } catch (err) {
        console.log(err.response ? err.response.data : err.message);
    }
}

async function order(credentials, data) {
    const { apiKey, apiSecret, test } = credentials;

    if (!apiKey || !apiSecret)
        throw new Error('Preencha corretamente sua API KEY e SECRET KEY');

    const timestamp = Date.now();
    const recvWindow = 60000;

    const signature = crypto
        .createHmac('sha256', apiSecret)
        .update(`${queryString.stringify({ ...data, timestamp, recvWindow })}`)
        .digest('hex');

    const newData = { ...data, timestamp, recvWindow, signature };
    const qs = `?${queryString.stringify(newData)}`;
    const url = test ? `https://testnet.binance.vision/api/v3/order${qs}` : `https://api.binance.com/api/v3/order${qs}`;

    try {
        const result = await axios({
            method: 'POST',
            url,
            headers: { 'X-MBX-APIKEY': apiKey }
        });
        return result.data;
    } catch (err) {
        console.log(err.response ? err.response.data : err.message);
    }
}

module.exports = { buy, sell, accountInfo }