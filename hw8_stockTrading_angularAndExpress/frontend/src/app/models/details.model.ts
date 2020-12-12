export interface DescriptionModelServer {
    description: any,
    endDate: any,
    exchangeCode: any,
    startDate: any,
    name: any,
    ticker: any,
}

export interface LatestPriceModelServer {
    prevClose: any,
    mid: any,
    lastSaleTimestamp: any,
    open: any,
    askPrice: any,
    low: any,
    ticker: any,
    timestamp: any,
    lastSize: any,
    tngoLast: any,
    last: any,
    high: any,
    askSize: any,
    quoteTimestamp: any,
    bidPrice: any,
    bidSize: any,
    volume: any;
}

export interface LatestNewsModelServer {
    status: any,
    totalResults: any,
    articles: any[]
}