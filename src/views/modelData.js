module.exports = function modelData(
    symbol, order, limit, rsi, mfi,price, balance, cryptocoin, status, media, tendency
    ){
    return {
        symbol,
        orders: `${order}/${limit}`,
        rsi, 
        mfi,
        price, 
        balance, 
        coin: cryptocoin,
        status, 
        media,
        tendency,
    }
}