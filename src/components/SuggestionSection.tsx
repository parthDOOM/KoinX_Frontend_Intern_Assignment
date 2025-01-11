//This is the Suggestion section of the application
//date: 10-01-2025

import { useState, useEffect } from 'react';
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
  'stETH': { apiId: 'steth', iconId: 'steth' },
  'UNI': { apiId: 'uniswap', iconId: 'uni' },
  'CFG': { apiId: 'centrifuge', iconId: 'cfg' }
};

const generateChartData = (symbol: string, priceChange: number) => {
  symbol = symbol.toLowerCase();
  const points: number[] = [];
  const direction = priceChange >= 0 ? 1 : -1;
  let current = 50;
  const volatility = 0.3; // Reduced volatility for smoother lines
  
  for (let i = 0; i < 50; i++) {
    // Add small random variation but maintain overall trend
    const change = (Math.random() * volatility - volatility/2) + (direction * 0.1);
    current += change;
    current = Math.max(40, Math.min(60, current)); // Reduce range for less dramatic swings
    points.push(current);
  }
  return points;
};

const CryptoCard: FC<CryptoCardProps> = ({ symbol, price, priceChange, chartData, iconId }) => {
  const svgPoints = chartData.map((point, index) => 
    `${(index * 4)},${point}`
  ).join(' ');

  // Custom icon URLs for specific coins
  const getIconUrl = () => {
    switch(symbol) {
      case 'stETH':
        return 'https://assets.coingecko.com/coins/images/13442/thumb/steth_logo.png';
      case 'CFG':
        return 'https://assets.coingecko.com/coins/images/15380/standard/centrifuge.PNG?1696515027';
      case 'BNB':
        return 'https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png';
      case 'SOL':
        return 'https://assets.coingecko.com/coins/images/4128/thumb/solana.png';
      case 'XRP':
        return 'https://assets.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png';
      case 'ADA':
        return 'https://assets.coingecko.com/coins/images/975/thumb/cardano.png';
      case 'AVAX':
        return 'https://assets.coingecko.com/coins/images/12559/thumb/coin-round-red.png';
      case 'UNI':
        return 'https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png';
      case 'BTC':
        return `https://assets.coingecko.com/coins/images/1/thumb/btc.png`;
      case 'ETH':
        return `https://assets.coingecko.com/coins/images/1/thumb/eth.png`;
    }
  };

  return (
    <div className="min-w-[240px] rounded-2xl p-5 border border-gray-200 bg-white">
      <div className="flex items-center space-x-2">
        <img
          src={getIconUrl()}
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
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

const SUGGESTED_COINS = ['BNB', 'SOL', 'XRP', 'ADA', 'AVAX'];
const TRENDING_COINS = ['BTC', 'ETH', 'stETH', 'UNI', 'CFG'];
const ALL_COINS = [...new Set([...SUGGESTED_COINS, ...TRENDING_COINS])];

const SuggestionSection: FC = () => {
  const [allData, setAllData] = useState<CryptoData[]>([]);
  const [allChartData, setAllChartData] = useState<{ [key: string]: number[] }>({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const responses = await Promise.all(
          ALL_COINS.map((symbol) =>
            fetch(`https://api.coincap.io/v2/assets/${ASSET_MAPPING[symbol]?.apiId || symbol.toLowerCase()}`)
          )
        );
        const jsonData = await Promise.all(
          responses.map((res) => (res.ok ? res.json() : null))
        );
        const validData = jsonData.filter((item) => item?.data);
        
        const newChartData: { [key: string]: number[] } = {};
        validData.forEach((item) => {
          if (item?.data) {
            newChartData[item.data.symbol] = generateChartData(
              item.data.symbol,
              parseFloat(item.data.changePercent24Hr)
            );
          }
        });
        
        setAllChartData(newChartData);
        setAllData(validData.map((item) => item.data));

        // Handle stETH data separately if it's not available from the API
        if (!validData.find(item => item?.data?.symbol === 'stETH')) {
          const stethData = {
            id: 'steth',
            symbol: 'stETH',
            priceUsd: '3251.22', // Use ETH price as approximation
            changePercent24Hr: '0.5'
          };
          setAllData(prev => [...prev, stethData]);
          setAllChartData(prev => ({
            ...prev,
            stETH: generateChartData('stETH', 0.5)
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAllData();
  }, []);

  const suggestedData = allData.filter(coin => SUGGESTED_COINS.includes(coin.symbol));
  const trendingData = allData.filter(coin => TRENDING_COINS.includes(coin.symbol));

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
                  chartData={allChartData[coin.symbol] || []}
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
                  chartData={allChartData[coin.symbol] || []}
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