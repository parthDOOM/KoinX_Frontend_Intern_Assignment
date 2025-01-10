//This is the Suggestion section of the application
//date: 10-01-2025

import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';

interface CryptoData {
  id: string;
  priceUsd: string;
  changePercent24Hr: string;
  symbol: string;
}

interface CryptoCardProps {
  symbol: string;
  price: string;
  priceChange: number;
  chartData: number[];
  iconId: string;
}

// Asset ID mapping for CoinCap API and icons
const ASSET_MAPPING: { [key: string]: { apiId: string; iconId: string } } = {
  'BNB': { apiId: 'binance-coin', iconId: 'bnb' },
  'SOL': { apiId: 'solana', iconId: 'sol' },
  'XRP': { apiId: 'xrp', iconId: 'xrp' },
  'ADA': { apiId: 'cardano', iconId: 'ada' },
  'AVAX': { apiId: 'avalanche', iconId: 'avax' },
  'BTC': { apiId: 'bitcoin', iconId: 'btc' },
  'ETH': { apiId: 'ethereum', iconId: 'eth' },
  'stETH': { apiId: 'lido-staked-ether', iconId: 'steth' },
  'UNI': { apiId: 'uniswap', iconId: 'uni' },
  'CFG': { apiId: 'centrifuge', iconId: 'cfg' }
};

const useCryptoData = (symbols: string[]) => {
  const [data, setData] = useState<CryptoData[]>([]);
  const [chartData, setChartData] = useState<{ [key: string]: number[] }>({});
  const lastUpdateRef = useRef<number | null>(null);
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  const generateChartData = (symbol: string) => {
    const points: number[] = [];
    const trend = Math.random() > 0.5;
    let current = 50;
    symbol = "BTC";
    for (let i = 0; i < 50; i++) {
      current += trend ? Math.random() * 2 - 0.8 : Math.random() * 2 - 1.2;
      current = Math.max(30, Math.min(70, current));
      points.push(current);
    }
    return points;
  };

  const fetchPriceData = async () => {
    try {
      const responses = await Promise.all(
        symbols.map((symbol) =>
          fetch(`https://api.coincap.io/v2/assets/${ASSET_MAPPING[symbol]?.apiId || symbol.toLowerCase()}`)
        )
      );
      const jsonData = await Promise.all(
        responses.map((res) => (res.ok ? res.json() : null))
      );
      const validData = jsonData.filter((item) => item?.data);
      
      const newChartData: { [key: string]: number[] } = {};
      symbols.forEach((symbol) => {
        newChartData[symbol] = generateChartData(symbol);
      });
      setChartData(newChartData);
      
      setData(validData.map((item) => item.data));
      lastUpdateRef.current = Date.now();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const now = Date.now();
    if (!lastUpdateRef.current || now - lastUpdateRef.current >= CACHE_DURATION) {
      fetchPriceData();
    }

    const interval = setInterval(fetchPriceData, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [symbols]);

  return { data, chartData };
};

const CryptoCard: FC<CryptoCardProps> = ({ symbol, price, priceChange, chartData, iconId }) => {
  const svgPoints = chartData.map((point, index) => 
    `${(index * 4)},${point}`
  ).join(' ');

  return (
    <div className="min-w-[240px] rounded-2xl p-5 border border-gray-200 bg-white">
      <div className="flex items-center space-x-2">
        <img
          src={`https://assets.coingecko.com/coins/images/1/thumb/${iconId}.png`}
          alt={symbol}
          className="w-6 h-6"
          onError={(e) => {
            e.currentTarget.src = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/128/color/${iconId.toLowerCase()}.png`;
          }}
        />
        <span className="text-base font-medium">{symbol}</span>
        <span className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
        </span>
      </div>

      <div className="text-xl font-semibold mt-2">
        ${parseFloat(price).toLocaleString(undefined, {
          minimumFractionDigits: parseFloat(price) < 1 ? 6 : 2,
          maximumFractionDigits: parseFloat(price) < 1 ? 6 : 2
        })}
      </div>

      <svg className="w-full h-16 mt-2" viewBox="0 0 200 100" preserveAspectRatio="none">
        <polyline
          points={svgPoints}
          fill="none"
          stroke={priceChange >= 0 ? "#22c55e" : "#ef4444"}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

const SUGGESTED_COINS = ['BNB', 'SOL', 'XRP', 'ADA', 'AVAX'];
const TRENDING_COINS = ['BTC', 'ETH', 'stETH', 'UNI', 'CFG'];

const SuggestionSection: FC = () => {
  const { data: suggestedData, chartData: suggestedChartData } = useCryptoData(SUGGESTED_COINS);
  const { data: trendingData, chartData: trendingChartData } = useCryptoData(TRENDING_COINS);

  const scrollContainer = (containerId: string, direction: 'left' | 'right') => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-50 h-max p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Suggested Coins Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">You May Also Like</h2>
          <div className="relative">
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg"
              onClick={() => scrollContainer('suggested-container', 'left')}
            >
              ←
            </button>

            <div
              id="suggested-container"
              className="flex overflow-x-auto hide-scrollbar gap-4 px-2"
            >
              {suggestedData.map((coin) => (
                <CryptoCard
                  key={coin.id}
                  symbol={coin.symbol}
                  price={coin.priceUsd}
                  priceChange={parseFloat(coin.changePercent24Hr)}
                  chartData={suggestedChartData[coin.symbol] || []}
                  iconId={ASSET_MAPPING[coin.symbol]?.iconId || coin.symbol.toLowerCase()}
                />
              ))}
            </div>

            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg"
              onClick={() => scrollContainer('suggested-container', 'right')}
            >
              →
            </button>
          </div>
        </div>

        {/* Trending Coins Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Trending Coins</h2>
          <div className="relative">
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg"
              onClick={() => scrollContainer('trending-container', 'left')}
            >
              ←
            </button>

            <div
              id="trending-container"
              className="flex overflow-x-auto hide-scrollbar gap-4 px-2"
            >
              {trendingData.map((coin) => (
                <CryptoCard
                  key={coin.id}
                  symbol={coin.symbol}
                  price={coin.priceUsd}
                  priceChange={parseFloat(coin.changePercent24Hr)}
                  chartData={trendingChartData[coin.symbol] || []}
                  iconId={ASSET_MAPPING[coin.symbol]?.iconId || coin.symbol.toLowerCase()}
                />
              ))}
            </div>

            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg"
              onClick={() => scrollContainer('trending-container', 'right')}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionSection;