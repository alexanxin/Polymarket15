'use client';

import Link from 'next/link';

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white font-mono p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
                    ← Back to Trading Bot
                </Link>
                <h1 className="text-4xl font-bold text-blue-400 mb-2">Help & Guide</h1>
                <p className="text-gray-300 text-lg">Understanding Polymarket Prediction Markets & This Trading Bot</p>
            </div>

            <div className="space-y-8">
                {/* What is Polymarket */}
                <section className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-green-400 mb-4">🤔 What is Polymarket?</h2>
                    <p className="text-gray-300 mb-4">
                        Polymarket is a decentralized prediction market platform built on Polygon, where users can trade on the outcomes of real-world events.
                        Unlike traditional betting, Polymarket uses blockchain technology to create transparent, efficient markets for event outcomes.
                    </p>
                    <div className="bg-blue-900/20 p-4 rounded border-l-4 border-blue-400">
                        <strong className="text-blue-400">Key Concept:</strong> Prediction markets allow people to bet on the probability of future events.
                        The market price reflects the collective wisdom of traders about the likelihood of an event occurring.
                    </div>
                </section>

                {/* What are Prediction Markets */}
                <section className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-green-400 mb-4">🎯 What are Prediction Markets?</h2>
                    <p className="text-gray-300 mb-4">
                        Prediction markets are like stock markets, but instead of trading company shares, you trade the probability of events happening.
                        Each market has two outcomes: "Yes" and "No", and their prices always add up to 1.00 (or 100%).
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-700 p-4 rounded">
                            <h3 className="font-bold text-yellow-400 mb-2">Example: BTC Price Prediction</h3>
                            <p className="text-sm text-gray-300 mb-2">Market: "Will BTC be above $100k on Dec 31?"</p>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span>Yes (Above $100k):</span>
                                    <span className="text-green-400">$0.75</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>No (Below $100k):</span>
                                    <span className="text-red-400">$0.25</span>
                                </div>
                                <div className="flex justify-between font-bold pt-1 border-t border-gray-600">
                                    <span>Total:</span>
                                    <span>$1.00</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-700 p-4 rounded">
                            <h3 className="font-bold text-yellow-400 mb-2">What This Means</h3>
                            <ul className="text-sm text-gray-300 space-y-1">
                                <li>• Market thinks 75% chance BTC hits $100k</li>
                                <li>• 25% chance it stays below</li>
                                <li>• Traders can buy/sell these probabilities</li>
                                <li>• Market self-corrects as new info arrives</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 15M Markets Explained */}
                <section className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-green-400 mb-4">⏰ What are 15M Markets?</h2>
                    <p className="text-gray-300 mb-4">
                        This bot specializes in <strong>15-minute prediction markets</strong> for cryptocurrency price movements.
                        These markets predict whether a crypto's price will be higher or lower at the end of a 15-minute window.
                    </p>
                    <div className="bg-orange-900/20 p-4 rounded border-l-4 border-orange-400 mb-4">
                        <strong className="text-orange-400">Example:</strong> "Bitcoin Up or Down - December 11, 2:00PM-2:15PM ET"
                        <br />
                        <span className="text-sm text-gray-300 mt-1 block">
                            This market resolves "Up" if Bitcoin's price at 2:15PM is higher than at 2:00PM, "Down" if lower.
                        </span>
                    </div>
                    <p className="text-gray-300">
                        These short-term markets are perfect for high-frequency trading because they resolve quickly and have high liquidity during active market hours.
                    </p>
                </section>

                {/* How the Bot Works */}
                <section className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-green-400 mb-4">🤖 How This Trading Bot Works</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-blue-400 mb-2">1. Market Scanning</h3>
                            <p className="text-gray-300">
                                The bot continuously scans for arbitrage opportunities where the sum of Yes + No prices is less than 1.00.
                                This creates a "risk-free" profit opportunity (in theory).
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-400 mb-2">2. Arbitrage Detection</h3>
                            <p className="text-gray-300">
                                When Yes + No < 1.00, the bot calculates the profit potential and executes trades to capture the spread.
                                For example, if Yes = $0.45 and No = $0.50, the bot can profit $0.05 per dollar traded.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-400 mb-2">3. High-Frequency Execution</h3>
                            <p className="text-gray-300">
                                In live mode, the bot scans every 200ms for opportunities. When found, it executes trades instantly
                                to capture fleeting arbitrage opportunities before the market corrects itself.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Interface Guide */}
                <section className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-green-400 mb-4">🎮 How to Use the Interface</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-purple-400 mb-3">Crypto Selection Tabs</h3>
                            <p className="text-gray-300 mb-2">Click BTC, ETH, SOL, or XRP tabs to switch between different cryptocurrencies.</p>
                            <div className="bg-gray-700 p-3 rounded text-sm">
                                <strong>Note:</strong> Each tab loads the latest 15M market for that crypto with 10-second throttling to prevent API spam.
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-purple-400 mb-3">Market Data Table</h3>
                            <div className="space-y-2 text-gray-300">
                                <div><strong className="text-blue-400">Market:</strong> The prediction question</div>
                                <div><strong className="text-blue-400">Status:</strong> Active (open for trading) or Resolved (finished)</div>
                                <div><strong className="text-blue-400">Resolution:</strong> Shows outcome once market resolves</div>
                                <div><strong className="text-blue-400">Yes/No:</strong> Current market prices (flash green/red on changes)</div>
                                <div><strong className="text-blue-400">Sum:</strong> Yes + No prices (green when < 1.00 = arbitrage opportunity)</div>
                                <div><strong className="text-blue-400">Arb Opportunity:</strong> Potential profit per $100 traded</div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-purple-400 mb-3">Execution Control</h3>
                            <p className="text-gray-300 mb-2">Use the "Start Mock Execution" / "Stop Mock Execution" button to control the bot.</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-green-900/20 p-3 rounded border border-green-600">
                                    <div className="text-green-400 font-bold">DEMO Mode (Default)</div>
                                    <div className="text-sm text-gray-300">Safe testing - simulates trades without real money</div>
                                </div>
                                <div className="bg-red-900/20 p-3 rounded border border-red-600">
                                    <div className="text-red-400 font-bold">LIVE Mode</div>
                                    <div className="text-sm text-gray-300">Real trading - requires wallet connection</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-purple-400 mb-3">Visual Indicators</h3>
                            <ul className="text-gray-300 space-y-1">
                                <li><span className="text-yellow-400">⟳</span> Refresh icon shows when market data is updating</li>
                                <li><span className="text-green-400 animate-pulse">Green flash</span> when prices increase</li>
                                <li><span className="text-red-400 animate-pulse">Red flash</span> when prices decrease</li>
                                <li><span className="text-green-400">Green sum</span> indicates arbitrage opportunity (< 1.00)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Performance Metrics */}
                <section className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-green-400 mb-4">📊 Understanding Performance Metrics</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-cyan-400 mb-3">Balance & PnL</h3>
                            <ul className="text-gray-300 space-y-2">
                                <li><strong>Starting Balance:</strong> $1000 (demo default)</li>
                                <li><strong>Current Balance:</strong> Your account value</li>
                                <li><strong>Last Profit:</strong> Most recent trade result</li>
                                <li><strong>Total Trades:</strong> Number of executed trades</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-cyan-400 mb-3">Market Activity</h3>
                            <ul className="text-gray-300 space-y-2">
                                <li><strong>ARB FOUND!</strong> Profitable opportunity detected</li>
                                <li><strong>Scanning:</strong> Bot is actively monitoring markets</li>
                                <li><strong>Sum:</strong> Indicates market efficiency (closer to 1.00 = more efficient)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Safety & Disclaimers */}
                <section className="bg-red-900/20 p-6 rounded-lg border border-red-600">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ Important Safety Information</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-red-300 mb-2">Demo Mode Only</h3>
                            <p className="text-gray-300">
                                This application runs in <strong>DEMO mode by default</strong>. It simulates trading without risking real money.
                                All "profits" and "losses" are fictional and for educational purposes only.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-red-300 mb-2">High Risk Activity</h3>
                            <p className="text-gray-300">
                                Prediction market trading involves substantial risk. Prices can be extremely volatile,
                                and you can lose your entire investment. Past performance does not predict future results.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-red-300 mb-2">Educational Purpose</h3>
                            <p className="text-gray-300">
                                This bot is built for educational and research purposes to demonstrate algorithmic trading concepts.
                                It is not intended as financial advice or a recommendation to trade.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-red-300 mb-2">Legal Compliance</h3>
                            <p className="text-gray-300">
                                Ensure you comply with all applicable laws and regulations in your jurisdiction.
                                Prediction markets may be restricted or illegal in some areas.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Technical Details */}
                <section className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-green-400 mb-4">⚙️ Technical Details</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-purple-400 mb-3">Data Updates</h3>
                            <ul className="text-gray-300 space-y-1 text-sm">
                                <li>• Market data: Every 5 seconds</li>
                                <li>• Slug refresh: Every 10 seconds (per crypto)</li>
                                <li>• Arbitrage scan: Every 200ms (when running)</li>
                                <li>• Price flash duration: 1 second</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-purple-400 mb-3">API Rate Limits</h3>
                            <ul className="text-gray-300 space-y-1 text-sm">
                                <li>• Polymarket Gamma API</li>
                                <li>• Smart throttling prevents abuse</li>
                                <li>• Error handling with retries</li>
                                <li>• Graceful degradation on failures</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Getting Started */}
                <section className="bg-blue-900/20 p-6 rounded-lg border border-blue-600">
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">🚀 Getting Started</h2>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">1</div>
                            <div>
                                <h3 className="font-bold text-blue-300">Explore the Interface</h3>
                                <p className="text-gray-300">Click through different crypto tabs to see live market data and price movements.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">2</div>
                            <div>
                                <h3 className="font-bold text-blue-300">Watch Price Changes</h3>
                                <p className="text-gray-300">Observe how prices update every 5 seconds and flash when they change.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">3</div>
                            <div>
                                <h3 className="font-bold text-blue-300">Try Demo Execution</h3>
                                <p className="text-gray-300">Start the mock execution to see how the arbitrage detection works in real-time.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">4</div>
                            <div>
                                <h3 className="font-bold text-blue-300">Monitor Performance</h3>
                                <p className="text-gray-300">Watch the execution log and performance metrics to understand the trading activity.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-8 text-center">
                <Link href="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold text-white">
                    Start Trading Bot
                </Link>
            </div>
        </div>
    );
}
