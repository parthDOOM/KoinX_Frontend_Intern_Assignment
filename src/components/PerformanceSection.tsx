//This is the Performance section of the application
//date: 10-01-2025

import { useState, useEffect } from "react";
import { IoMdInformationCircle } from "react-icons/io";
import axios from "axios";

interface MarketData {
  currentPrice: number;
  todaysLow: number;
  todaysHigh: number;
  weekLow: number;
  weekHigh: number;
  tradingVolume: number;
  marketCap: number;
  marketCapRank: number;
  marketCapDominance: number;
  volumeToMarketCap: number;
  allTimeHigh: {
    price: number;
    date: string;
    percentDown: number;
  };
  allTimeLow: {
    price: number;
    date: string;
    percentUp: number;
  };
}

function PerformanceSection() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current price, 24h high/low from Binance
        const binanceResponse = await axios.get(
          "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT"
        );

        // Fetch additional market data from CryptoCompare
        const cryptoCompareResponse = await axios.get(
          "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USD&api_key=YOUR_API_KEY"
        );

        // Get market dominance
        const globalDataResponse = await axios.get(
          "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD&api_key=YOUR_API_KEY"
        );

        const binanceData = binanceResponse.data;
        const ccData = cryptoCompareResponse.data.RAW.BTC.USD;
        const globalData = globalDataResponse.data.Data;

        // Calculate BTC dominance
        const totalMarketCap = globalData.reduce((sum: number, coin: any) => sum + coin.RAW.USD.MKTCAP, 0);
        const btcDominance = (ccData.MKTCAP / totalMarketCap) * 100;

        setMarketData({
          currentPrice: parseFloat(binanceData.lastPrice),
          todaysLow: parseFloat(binanceData.lowPrice),
          todaysHigh: parseFloat(binanceData.highPrice),
          weekLow: ccData.LOW24HOUR * 0.95, // Approximation for demo
          weekHigh: ccData.HIGH24HOUR * 1.05, // Approximation for demo
          tradingVolume: ccData.VOLUME24HOUR,
          marketCap: ccData.MKTCAP,
          marketCapRank: 1, // Bitcoin is consistently #1
          marketCapDominance: btcDominance,
          volumeToMarketCap: parseFloat((ccData.VOLUME24HOUR / ccData.MKTCAP).toFixed(4)),
          allTimeHigh: {
            price: 69000, // Historical ATH
            date: "Nov 10, 2021",
            percentDown: ((69000 - parseFloat(binanceData.lastPrice)) / 69000) * 100
          },
          allTimeLow: {
            price: 67.81, // Historical ATL
            date: "Jul 06, 2013",
            percentUp: ((parseFloat(binanceData.lastPrice) - 67.81) / 67.81) * 100
          }
        });
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);


  //calculate the position of the arrow for the current price
  const calculateArrowPosition = (low: number, high: number, current: number) => {
    const range = high - low;
    const position = ((current - low) / range) * 100;
    return `${position}%`;
  };

  return (
    <div className="bg-white mt-5 rounded-lg lg:p-6 p-2 h-max">
      <div>
        <div className="text-2xl font-semibold text-[#0F1629]">Performance</div>
        <div className="py-4 mt-2">
          <div className="flex justify-between ">
            <div className="text-start">
              <div className="text-sm text-[#44475B] font-normal p-1">
                Today's Low
              </div>
              <div className="text-[#44475B] text-lg font-medium p-1">
                {marketData?.todaysLow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "Loading..."}
              </div>
            </div>
            <div className="w-[500px] h-2 mx-4">
              <div className="bg-gradient-to-r from-red-500 via-orange-500 to-green-500 h-full rounded-2xl mt-7"></div>
              <div 
                className="relative mt-4"
                style={{ 
                  left: marketData ? calculateArrowPosition(
                    marketData.todaysLow,
                    marketData.todaysHigh,
                    marketData.currentPrice
                  ) : '50%' 
                }}
              >
              <svg
                viewBox="0 0 100 100"
                className="lg:w-3 w-2 fill-current text-black"
                style={{ transform: 'translateX(-50%)' }}
              >
                <polygon points="0,100 50,0 100,100" />
              </svg>
              <span className="text-[#44475B] text-sm font-normal absolute left-1/2 transform -translate-x-1/2">
                ${marketData?.currentPrice.toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }) ?? "Loading..."}
              </span>
            </div>
          </div>
            <div className="text-end">
              <div className="text-sm text-[#44475B] font-normal p-1">
                Today's High
              </div>
              <div className="text-[#44475B] text-lg font-medium p-1">
                {marketData?.todaysHigh.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "Loading..."}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-5">
            <div className="text-start">
              <div className="text-sm text-[#44475B] font-normal p-1">
                52W Low
              </div>
              <div className="text-[#44475B] text-lg font-medium p-1">
                {marketData?.weekLow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "Loading..."}
              </div>
            </div>
            <div className="w-[500px] h-2 mx-4">
              <div className="bg-gradient-to-r from-red-500 via-orange-500 to-green-500 h-full rounded-2xl mt-7"></div>
            </div>
            <div className="text-end">
              <div className="text-sm text-[#44475B] font-normal p-1">
                52W High
              </div>
              <div className="text-[#44475B] text-lg font-medium p-1">
                {marketData?.weekHigh.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "Loading..."}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center">
            <div className="text-[#44475B] font-semibold text-xl">
              Fundamentals
            </div>
            <div className="">
              <IoMdInformationCircle className="text-[#ABB9BF] text-lg ml-2" />
            </div>
          </div>
          <div className="lg:flex mb-8">
            <div className="lg:w-1/2 lg:mr-10 mt-3">
              <div className="flex justify-between py-5 border-b-2 border-[#D3E0E6]">
                <div className="text-[#768396] text-sm font-semibold">
                  Bitcoin Price
                </div>
                <div className="text-[#111827] text-sm font-semibold mr-4">
                  ${marketData?.currentPrice.toLocaleString() ?? "Loading..."}
                </div>
              </div>
              <div className="flex justify-between py-5 border-b-2 border-[#D3E0E6]">
                <div className="text-[#768396] text-sm font-semibold">
                  24h Low / 24h High
                </div>
                <div className="text-[#111827] text-sm font-semibold mr-4">
                  ${marketData?.todaysLow.toLocaleString()} / ${marketData?.todaysHigh.toLocaleString() ?? "Loading..."}
                </div>
              </div>
              <div className="flex justify-between py-5 border-b-2 border-[#D3E0E6]">
                <div className="text-[#768396] text-sm font-semibold">
                  7d Low / 7d High
                </div>
                <div className="text-[#111827] text-sm font-semibold mr-4">
                  ${marketData?.weekLow.toLocaleString()} / ${marketData?.weekHigh.toLocaleString() ?? "Loading..."}
                </div>
              </div>
              <div className="flex justify-between py-5 border-b-2 border-[#D3E0E6]">
                <div className="text-[#768396] text-sm font-semibold">
                  Trading Volume
                </div>
                <div className="text-[#111827] text-sm font-semibold mr-4">
                  ${marketData?.tradingVolume.toLocaleString() ?? "Loading..."}
                </div>
              </div>
              <div className="flex justify-between py-5 border-b-2 border-[#D3E0E6]">
                <div className="text-[#768396] text-sm font-semibold">
                  Market Cap Rank
                </div>
                <div className="text-[#111827] text-sm font-semibold mr-4">
                  #{marketData?.marketCapRank ?? "Loading..."}
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 lg:ml-10 lg:mt-3">
              <div className="flex justify-between py-5 border-b-2 border-[#D3E0E6]">
                <div className="text-[#768396] text-sm font-semibold">
                  Market Cap
                </div>
                <div className="text-[#111827] text-sm font-semibold mr-4">
                  ${marketData?.marketCap.toLocaleString() ?? "Loading..."}
                </div>
              </div>
              <div className="flex justify-between py-5 border-b-2 border-[#D3E0E6]">
                <div className="text-[#768396] text-sm font-semibold">
                  Market Cap Dominance
                </div>
                <div className="text-[#111827] text-sm font-semibold mr-4">
                  {marketData?.marketCapDominance.toFixed(3)}%
                </div>
              </div>
              <div className="flex justify-between py-5 border-b-2 border-[#D3E0E6]">
                <div className="text-[#768396] text-sm font-semibold">
                  Volume / Market Cap
                </div>
                <div className="text-[#111827] text-sm font-semibold mr-4">
                  {marketData?.volumeToMarketCap.toFixed(4) ?? "Loading..."}
                </div>
              </div>
              <div className="flex justify-between py-3 border-b-2 border-[#D3E0E6] items-center">
                <div className="text-[#768396] text-sm font-semibold">
                  All-Time High
                </div>
                <div className="text-[#111827] text-sm font-semibold mr-4 -p-2">
                  <div className="text-end">
                    ${marketData?.allTimeHigh.price.toLocaleString()} <span className="text-red-500">{marketData?.allTimeHigh.percentDown.toFixed(1)}%</span>
                  </div>
                  <div className="text-xs font-normal">
                    {marketData?.allTimeHigh.date ?? "Loading..."}
                  </div>
                </div>
              </div>
              <div className="flex justify-between py-3 border-b-2 border-[#D3E0E6] items-center">
                <div className="text-[#768396] text-sm font-semibold">
                  All-Time Low
                </div>
                <div className="text-[#111827] text-sm font-semibold mr-4 -p-2">
                  <div className="text-end">
                    ${marketData?.allTimeLow.price.toLocaleString()} <span className="text-green-500">{marketData?.allTimeLow.percentUp.toFixed(1)}%</span>
                  </div>
                  <div className="text-xs font-normal">
                    {marketData?.allTimeLow.date ?? "Loading..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceSection;