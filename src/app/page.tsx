'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const DEMO_MODE = true;
const STARTING_BALANCE = 1000.00;
const TRADE_SIZE = 100.00;

interface Market {
  question: string;
  yes: number;
  no: number;
  id: string;
  closed: boolean;
  slug: string;
  endDate: string;
  bestBid?: number;
  bestAsk?: number;
  lastTradePrice?: number;
}

interface BotState {
  balance: number;
  positions: any[];
  logMessages: string[];
  pnlHistory: number[];
  allMarkets: Market[];
  selectedMarket: Market | null;
  selectedCrypto: string;
  availableCryptos: string[];
  cryptoSlugs: { [key: string]: string };
}

export default function TradingBot() {
  const [botState, setBotState] = useState<BotState>({
    balance: STARTING_BALANCE,
    positions: [],
    logMessages: [],
    pnlHistory: [],
    allMarkets: [],
    selectedMarket: null,
    selectedCrypto: 'BTC',
    availableCryptos: ['BTC', 'ETH', 'SOL', 'XRP'],
    cryptoSlugs: {}
  });

  // Throttle slug API calls to 10 seconds for testing/demo purposes
  const [lastSlugFetch, setLastSlugFetch] = useState<{ [key: string]: number }>({});
  // Prevent multiple initial slug fetches
  const [initialSlugsLoaded, setInitialSlugsLoaded] = useState(false);
  // Track price changes for flashing effects
  const [priceChanges, setPriceChanges] = useState<{ [marketId: string]: { yes: 'up' | 'down' | null, no: 'up' | 'down' | null } }>({});
  // Bot execution state
  const [isBotRunning, setIsBotRunning] = useState(false);
  // Track data refresh status
  const [isRefreshingData, setIsRefreshingData] = useState(false);

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setBotState(prev => ({
      ...prev,
      logMessages: [`[${timestamp}] ${message}`, ...prev.logMessages.slice(0, 7)]
    }));
  };

  const fetchInitialSlugs = async () => {
    if (initialSlugsLoaded) return; // Prevent multiple fetches

    try {
      setInitialSlugsLoaded(true); // Mark as loaded immediately to prevent race conditions
      toast.loading('Getting 15M data...', { id: 'fetching-slugs' });
      const response = await fetch('/api/markets?getSlugs=true');

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      toast.loading('Parsing 15M data...', { id: 'fetching-slugs' });
      const cryptoSlugs = await response.json();

      setBotState(prev => ({ ...prev, cryptoSlugs }));

      const foundSlugs = Object.keys(cryptoSlugs);
      if (foundSlugs.length === 4) {
        toast.success('Data parsed successfully! Found all 4 slugs for the currently active 15M events', { id: 'fetching-slugs' });
      } else {
        toast.success(`Data parsed successfully! Found ${foundSlugs.length} slugs: ${foundSlugs.join(', ')}`, { id: 'fetching-slugs' });
      }

      log(`Loaded initial slugs: ${foundSlugs.join(', ')}`);
    } catch (e) {
      setInitialSlugsLoaded(false); // Allow retry on error
      toast.error(`Error fetching initial slugs: ${e}`, { id: 'fetching-slugs' });
      log(`Error fetching initial slugs: ${e}`);
    }
  };



  const selectMarket = (market: Market) => {
    setBotState(prev => ({ ...prev, selectedMarket: market }));
    log(`Selected market: ${market.question.slice(0, 50)}...`);
  };

  const selectCrypto = (crypto: string) => {
    setBotState(prev => ({ ...prev, selectedCrypto: crypto, selectedMarket: null }));

    // For individual cryptos, refresh the 15M data to get current active slug
    refreshCryptoSlug(crypto);
  };

  const refreshCryptoSlug = async (crypto: string) => {
    const now = Date.now();
    const lastFetch = lastSlugFetch[crypto] || 0;
    const timeSinceLastFetch = now - lastFetch;

    // Throttle to 10 seconds for testing/demo purposes
    if (timeSinceLastFetch < 10000) {
      const remainingTime = Math.ceil((10000 - timeSinceLastFetch) / 1000);
      log(`Skipping ${crypto} slug refresh - ${remainingTime}s remaining`);
      return;
    }

    try {
      setLastSlugFetch(prev => ({ ...prev, [crypto]: now }));

      const response = await fetch('/api/markets?getSlugs=true');
      const freshSlugs = await response.json();

      if (freshSlugs[crypto]) {
        setBotState(prev => ({
          ...prev,
          cryptoSlugs: { ...prev.cryptoSlugs, [crypto]: freshSlugs[crypto] }
        }));

        // Now fetch the specific event using the updated slug
        fetchMarketsBySlug(freshSlugs[crypto]);
        log(`Refreshed ${crypto} slug: ${freshSlugs[crypto]}`);
      } else {
        log(`No active ${crypto} event found`);
        setBotState(prev => ({ ...prev, allMarkets: [] }));
      }
    } catch (e) {
      log(`Error refreshing ${crypto} slug: ${e}`);
    }
  };

  const fetchMarketsBySlug = async (slug: string) => {
    try {
      setIsRefreshingData(true);
      console.log('Fetching markets for slug:', slug);
      const response = await fetch(`/api/markets?slug=${slug}`);
      const data = await response.json();
      console.log('Raw API response for slug fetch:', data);

      // Process the specific event data
      const allMarkets: Market[] = [];

      // Handle both array (multiple events) and single object (single event by slug) responses
      const events = Array.isArray(data) ? data : [data];

      if (events.length > 0) {
        console.log('Processing', events.length, 'events from API response');
        const event = events[0]; // Take the first (and should be only) event
        console.log('First event:', event);
        console.log('Event markets:', event.markets);

        if (event.markets && Array.isArray(event.markets)) {
          console.log('Processing', event.markets.length, 'markets');
          event.markets.forEach((marketData: any, index: number) => {
            console.log(`Processing market ${index}:`, marketData);
            console.log('Question:', marketData.question);
            console.log('Closed:', marketData.closed);

            // Since we're fetching by specific slug, all markets should be relevant
            // No additional filtering needed
            console.log('Processing market (no filtering applied)');
            console.log('Raw outcomePrices:', marketData.outcomePrices);
            console.log('Market ready:', marketData.ready);
            console.log('Market funded:', marketData.funded);
            console.log('Market active:', marketData.active);

            // Use real market prices instead of static outcomePrices
            const yesPrice = marketData.bestBid ? parseFloat(marketData.bestBid) : 0.5;
            const noPrice = marketData.bestAsk ? parseFloat(marketData.bestAsk) : 0.5;

            console.log('Using real market prices - Yes (bestBid):', yesPrice, 'No (bestAsk):', noPrice);

            // Check for price changes to trigger flashing effects
            const existingMarket = botState.allMarkets.find(m => m.id === marketData.id);
            const yesChanged = existingMarket && existingMarket.yes !== yesPrice;
            const noChanged = existingMarket && existingMarket.no !== noPrice;

            if (yesChanged || noChanged) {
              setPriceChanges(prev => ({
                ...prev,
                [marketData.id]: {
                  yes: yesChanged ? (yesPrice > existingMarket.yes ? 'up' : 'down') : null,
                  no: noChanged ? (noPrice > existingMarket.no ? 'up' : 'down') : null
                }
              }));

              // Clear flashing after 1 second
              setTimeout(() => {
                setPriceChanges(prev => ({
                  ...prev,
                  [marketData.id]: { yes: null, no: null }
                }));
              }, 1000);
            }

            const market: Market = {
              question: marketData.question,
              yes: yesPrice,
              no: noPrice,
              id: marketData.id,
              closed: marketData.closed || false,
              slug: event.slug,
              endDate: event.endDate,
              bestBid: marketData.bestBid,
              bestAsk: marketData.bestAsk,
              lastTradePrice: marketData.lastTradePrice
            };
            console.log('Created market object with real prices:', market);
            allMarkets.push(market);
          });
        } else {
          console.log('No markets array found in event');
        }
      } else {
        console.log('No events found in API response');
      }

      console.log('Final allMarkets array:', allMarkets);

      setBotState(prev => ({
        ...prev,
        allMarkets,
        selectedMarket: allMarkets.length > 0 ? allMarkets[0] : null
      }));

      log(`Fetched markets for slug: ${slug}`);
    } catch (e) {
      console.error('Error in fetchMarketsBySlug:', e);
      log(`Error fetching markets by slug: ${e}`);
    } finally {
      setIsRefreshingData(false);
    }
  };

  const scanAndTrade = () => {
    if (!botState.selectedMarket) return;

    const market = botState.selectedMarket;
    let priceYes = market.yes;
    let priceNo = market.no;

    if (DEMO_MODE) {
      if (Math.random() < 0.2) {
        const spreadGap = Math.random() * 0.03 + 0.02;
        priceYes = Math.round((0.50 - spreadGap) * 100) / 100;
        priceNo = Math.round((0.50 - spreadGap) * 100) / 100;
      }
    }

    const totalCost = priceYes + priceNo;

    if (totalCost < 0.99) {
      const profitMargin = 1.00 - totalCost;
      const potentialProfit = (TRADE_SIZE / totalCost) * profitMargin;

      setBotState(prev => ({
        ...prev,
        balance: prev.balance + potentialProfit,
        pnlHistory: [...prev.pnlHistory, potentialProfit]
      }));

      const msg = `ARB FOUND! ${market.question.slice(0, 25)}...\n   Yes: ${priceYes.toFixed(2)} | No: ${priceNo.toFixed(2)} | Sum: ${totalCost.toFixed(2)}\n   +$${potentialProfit.toFixed(2)} Profit`;
      log(msg);
    } else {
      if (Math.random() < 0.1) {
        log(`Scanning: ${market.question.slice(0, 30)}... (Sum: ${totalCost.toFixed(2)})`);
      }
    }
  };

  useEffect(() => {
    fetchInitialSlugs();
    // Only run trading logic when bot is running
    let interval: NodeJS.Timeout | null = null;
    if (isBotRunning) {
      interval = setInterval(() => {
        scanAndTrade();
      }, 200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [botState.selectedMarket, isBotRunning]);

  // Prevent automatic slug refreshing - only refresh when explicitly requested
  // Remove any automatic calls to refreshCryptoSlug

  // Load markets when slugs are first loaded (only once)
  useEffect(() => {
    if (initialSlugsLoaded && Object.keys(botState.cryptoSlugs).length > 0 && botState.cryptoSlugs[botState.selectedCrypto]) {
      fetchMarketsBySlug(botState.cryptoSlugs[botState.selectedCrypto]);
    }
  }, [initialSlugsLoaded, botState.cryptoSlugs, botState.selectedCrypto]);

  // Auto-refresh market data every 5 seconds for the selected crypto
  useEffect(() => {
    if (!initialSlugsLoaded || !botState.cryptoSlugs[botState.selectedCrypto]) return;

    const interval = setInterval(() => {
      fetchMarketsBySlug(botState.cryptoSlugs[botState.selectedCrypto]);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [botState.selectedCrypto, botState.cryptoSlugs, initialSlugsLoaded]);

  // Since we fetch specific events by slug, no filtering needed
  const filteredMarkets = botState.allMarkets;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono p-4">
      {/* Header */}
      <div className="bg-blue-900 text-white p-4 mb-4">
        <h1 className="text-xl font-bold">
          Polymarket High-Frequency Bot v1.0 | Status: {DEMO_MODE ? 'DEMO MODE' : 'LIVE MODE'} | Balance: ${botState.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h1>
        {botState.selectedMarket && (
          <p className="text-sm mt-2">
            Trading on: {botState.selectedMarket.question.slice(0, 60)}...
          </p>
        )}
      </div>

      {/* Crypto Selection */}
      <div className="bg-gray-800 p-4 rounded mb-4">
        <h2 className="text-lg font-bold mb-2">Select Crypto</h2>
        <div className="flex flex-wrap gap-2">
          {botState.availableCryptos.map(crypto => (
            <button
              key={crypto}
              onClick={() => selectCrypto(crypto)}
              className={`px-4 py-2 rounded font-bold ${botState.selectedCrypto === crypto
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                }`}
            >
              {crypto}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Market Data Table */}
        <div className="bg-gray-80 p-4 rounded">
          <h2 className="text-lg font-bold mb-2">
            Available {botState.selectedCrypto} Markets
            {isRefreshingData && <span className="ml-2 text-yellow-400 animate-pulse">⟳</span>}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-2">Market</th>
                  <th className="text-center p-2">Status</th>
                  <th className="text-center p-2">Resolution</th>
                  <th className="text-right p-2">Yes</th>
                  <th className="text-right p-2">No</th>
                  <th className="text-right p-2">Sum</th>
                  <th className="text-right p-2">Arb Opportunity</th>
                  <th className="text-center p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMarkets.map((m) => {
                  const sum = m.yes + m.no;
                  const color = sum < 1.0 ? 'text-green-400' : 'text-red-400';
                  const arb = sum < 0.9 ? `$${(TRADE_SIZE / sum * (1.00 - sum)).toFixed(2)}` : '-';
                  const isSelected = botState.selectedMarket?.id === m.id;
                  // Assuming outcomes are ["Yes", "No"] or ["Up", "Down"], resolution based on prices
                  const outcomes = ['Up', 'Down']; // From data
                  const resolvedOutcome = m.yes > m.no ? outcomes[0] : outcomes[1];
                  const status = m.closed ? 'Resolved' : 'Active';
                  const priceChange = priceChanges[m.id] || { yes: null, no: null };
                  const yesFlashClass = priceChange.yes === 'up' ? 'text-green-400 animate-pulse' :
                    priceChange.yes === 'down' ? 'text-red-400 animate-pulse' : '';
                  const noFlashClass = priceChange.no === 'up' ? 'text-green-400 animate-pulse' :
                    priceChange.no === 'down' ? 'text-red-400 animate-pulse' : '';
                  return (
                    <tr key={m.id} className={`border-b border-gray-700 ${isSelected ? 'bg-blue-700' : ''}`}>
                      <td className="p-2 max-w-xs">{m.question}</td>
                      <td className="text-center p-2">{status}</td>
                      <td className="text-center p-2">{status === 'Resolved' ? resolvedOutcome : '-'}</td>
                      <td className={`text-right p-2 ${yesFlashClass}`}>{m.yes.toFixed(2)}</td>
                      <td className={`text-right p-2 ${noFlashClass}`}>{m.no.toFixed(2)}</td>
                      <td className={`text-right p-2 ${color}`}>{sum.toFixed(2)}</td>
                      <td className="text-right p-2">{arb}</td>
                      <td className="text-center p-2">
                        {isSelected ? (
                          <span className="text-green-400">Selected</span>
                        ) : (
                          <button
                            onClick={() => selectMarket(m)}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                          >
                            Select
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-bold mb-2">Performance Metrics</h2>
          <div className="space-y-2">
            <p><strong>Total Trades:</strong> {botState.pnlHistory.length}</p>
            <p><strong>Last Profit:</strong> ${botState.pnlHistory[botState.pnlHistory.length - 1]?.toFixed(2) || 'N/A'}</p>
            <p><strong>Avg ROI:</strong> 1.5%</p>
            <p className="text-gray-400">Waiting for spreads {'<'} 1.00...</p>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-gray-800 p-4 rounded">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">Execution Log</h2>
          <button
            onClick={() => {
              setIsBotRunning(!isBotRunning);
              log(isBotRunning ? 'Bot execution stopped' : 'Bot execution started');
            }}
            className={`px-4 py-2 rounded font-bold ${isBotRunning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
          >
            {isBotRunning ? 'Stop Mock Execution' : 'Start Mock Execution'}
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto space-y-1">
          {botState.logMessages.map((msg, i) => (
            <div key={i} className="text-sm whitespace-pre-line">{msg}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
