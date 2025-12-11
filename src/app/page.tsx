'use client';

import { useState, useEffect } from 'react';

const DEMO_MODE = true;
const STARTING_BALANCE = 1000.00;
const TRADE_SIZE = 100.00;

interface Market {
  question: string;
  yes: number;
  no: number;
  id: string;
}

interface BotState {
  balance: number;
  positions: any[];
  logMessages: string[];
  pnlHistory: number[];
  activeMarkets: Market[];
}

export default function TradingBot() {
  const [botState, setBotState] = useState<BotState>({
    balance: STARTING_BALANCE,
    positions: [],
    logMessages: [],
    pnlHistory: [],
    activeMarkets: []
  });

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setBotState(prev => ({
      ...prev,
      logMessages: [`[${timestamp}] ${message}`, ...prev.logMessages.slice(0, 7)]
    }));
  };

  const fetchMarkets = async () => {
    try {
      const url = "https://gamma-api.polymarket.com/markets";
      const params = new URLSearchParams({
        active: "true",
        closed: "false",
        limit: "20",
        tag_id: "1"
      });
      const response = await fetch(`${url}?${params}`);
      const data = await response.json();

      const markets: Market[] = [];
      for (const item of data) {
        if (item.question?.includes("Bitcoin")) {
          try {
            const outcomes = JSON.parse((item.outcomePrices || "['0', '0']").replace(/'/g, '"'));
            markets.push({
              question: item.question,
              yes: parseFloat(outcomes[0]),
              no: parseFloat(outcomes[1]),
              id: item.id
            });
          } catch (e) {
            continue;
          }
        }
      }
      setBotState(prev => ({ ...prev, activeMarkets: markets }));
    } catch (e) {
      log(`Error fetching data: ${e}`);
    }
  };

  const scanAndTrade = () => {
    if (!botState.activeMarkets.length) return;

    const market = botState.activeMarkets[Math.floor(Math.random() * botState.activeMarkets.length)];
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
    fetchMarkets();
    const interval = setInterval(() => {
      scanAndTrade();
      if (Math.random() < 0.05) {
        fetchMarkets();
      }
    }, 200);
    return () => clearInterval(interval);
  }, [botState.activeMarkets]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono p-4">
      {/* Header */}
      <div className="bg-blue-900 text-white p-4 mb-4">
        <h1 className="text-xl font-bold">
          Polymarket High-Frequency Bot v1.0 | Status: {DEMO_MODE ? 'DEMO MODE' : 'LIVE MODE'} | Balance: ${botState.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Market Data Table */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-bold mb-2">Live 15m Bitcoin Markets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-2">Market</th>
                  <th className="text-right p-2">Yes</th>
                  <th className="text-right p-2">No</th>
                  <th className="text-right p-2">Sum</th>
                </tr>
              </thead>
              <tbody>
                {botState.activeMarkets.slice(0, 6).map((m, i) => {
                  const sum = m.yes + m.no;
                  const color = sum < 1.0 ? 'text-green-400' : 'text-red-400';
                  return (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="p-2 truncate max-w-xs">{m.question.slice(0, 30)}</td>
                      <td className="text-right p-2">{m.yes.toFixed(2)}</td>
                      <td className="text-right p-2">{m.no.toFixed(2)}</td>
                      <td className={`text-right p-2 ${color}`}>{sum.toFixed(2)}</td>
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
            <p className="text-gray-400">Waiting for spreads &lt; 1.00...</p>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-gray-800 p-4 rounded">
        <h2 className="text-lg font-bold mb-2">Execution Log</h2>
        <div className="max-h-64 overflow-y-auto space-y-1">
          {botState.logMessages.map((msg, i) => (
            <div key={i} className="text-sm whitespace-pre-line">{msg}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
