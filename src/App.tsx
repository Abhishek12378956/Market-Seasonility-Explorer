import React, { useState, useEffect } from 'react';
import { CalendarGrid } from './components/Calendar/CalendarGrid';
import { CalendarHeader } from './components/Calendar/CalendarHeader';
import { DataPanel } from './components/Dashboard/DataPanel';
import { VolatilityChart } from './components/Charts/VolatilityChart';
import { Modal } from './components/UI/Modal';
import { ExportPanel } from './components/Export/ExportPanel';
import { AlertsPanel } from './components/Alerts/AlertsPanel';
import { ComparisonPanel } from './components/Comparison/ComparisonPanel';
import { PatternsPanel } from './components/Patterns/PatternsPanel';
import { useFinancialData } from './hooks/useFinancialData';
import { useAlerts } from './hooks/useAlerts';
import { CalendarCellData, TimeframeType, MetricType } from './types/financial';
import { BarChart3, Settings, Download, Filter, Palette, Bell, GitCompare, Activity } from 'lucide-react';
import { themes, getTheme } from './utils/themes';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedData, setSelectedData] = useState<CalendarCellData | null>(null);
  const [timeframe, setTimeframe] = useState<TimeframeType>('daily');
  const [activeMetric, setActiveMetric] = useState<MetricType>('volatility');
  const [currentTheme, setCurrentTheme] = useState('default');
  const [showSettings, setShowSettings] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showPatterns, setShowPatterns] = useState(false);
  
  const { data, loading } = useFinancialData(currentDate, timeframe);
  const { alerts, triggeredAlerts, addAlert, updateAlert, deleteAlert } = useAlerts(data);

  const theme = getTheme(currentTheme);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--color-${key}`, value);
      }
    });
  }, [theme]);

  const handleDateSelect = (date: Date, cellData: CalendarCellData) => {
    setSelectedDate(date);
    setSelectedData(cellData);
  };

  const handleTimeframeChange = (newTimeframe: TimeframeType) => {
    setTimeframe(newTimeframe);
    setSelectedDate(null);
    setSelectedData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white transition-colors duration-300"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <BarChart3 className="text-blue-400" size={32} />
            <div>
              <h1 className="text-3xl font-bold">Market Seasonality Explorer</h1>
              <p className="text-gray-400">Interactive calendar for financial data visualization</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCharts(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <BarChart3 size={16} />
              <span>Charts</span>
            </button>
            
            <button
              onClick={() => setShowExport(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Download size={16} />
              <span>Export</span>
            </button>

            <button
              onClick={() => setShowAlerts(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-all duration-200 hover:scale-105 relative"
            >
              <Bell size={16} />
              <span>Alerts</span>
              {triggeredAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {triggeredAlerts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowComparison(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <GitCompare size={16} />
              <span>Compare</span>
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Metric Filter */}
        <div 
          className="mb-6 p-4 rounded-lg border transition-colors duration-300"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border 
          }}
        >
          <div className="flex items-center space-x-4">
            <Filter className="text-gray-400" size={20} />
            <span className="text-gray-300">Display Metric:</span>
            <div className="flex space-x-2">
              {(['volatility', 'liquidity', 'performance'] as MetricType[]).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setActiveMetric(metric)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    activeMetric === metric
                      ? 'text-white'
                      : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600'
                  }`}
                  style={activeMetric === metric ? { backgroundColor: theme.colors.primary } : {}}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="calendar-container">
          {/* Calendar Section */}
          <div className="xl:col-span-2">
            <CalendarHeader
              currentDate={currentDate}
              timeframe={timeframe}
              onDateChange={setCurrentDate}
              onTimeframeChange={handleTimeframeChange}
            />
            
            <CalendarGrid
              currentDate={currentDate}
              data={data}
              timeframe={timeframe}
              activeMetric={activeMetric}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* Data Panel */}
          <div className="xl:col-span-1">
            <DataPanel
              selectedData={selectedData}
              historicalData={data.map(item => ({
                ...item,
                dayOfMonth: new Date(item.date).getDate(),
                isToday: false,
                isSelected: false,
                isInCurrentMonth: true,
              }))}
            />
          </div>
        </div>

        {/* Legend */}
        <div 
          className="mt-8 p-4 rounded-lg border transition-colors duration-300"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border 
          }}
        >
          <h3 className="text-white font-semibold mb-3">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="text-gray-300 font-medium mb-2">
                {activeMetric === 'volatility' && 'Volatility Colors'}
                {activeMetric === 'liquidity' && 'Liquidity Colors'}
                {activeMetric === 'performance' && 'Performance Colors'}
              </h4>
              <div className="space-y-1">
                {activeMetric === 'volatility' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-gray-400">Low (0-2%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                      <span className="text-gray-400">Medium (2-6%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-gray-400">High (6%+)</span>
                    </div>
                  </>
                )}
                {activeMetric === 'liquidity' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-gray-400">High (80%+)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-300 rounded"></div>
                      <span className="text-gray-400">Medium (40-80%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-100 rounded"></div>
                      <span className="text-gray-400">Low (0-40%)</span>
                    </div>
                  </>
                )}
                {activeMetric === 'performance' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-gray-400">Positive (3%+)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-400 rounded"></div>
                      <span className="text-gray-400">Neutral (-1% to 1%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-gray-400">Negative (-3%+)</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-gray-300 font-medium mb-2">Indicators</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-1 bg-white rounded"></div>
                  <span className="text-gray-400">{activeMetric} bar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-400">Volume indicator</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-gray-300 font-medium mb-2">Navigation</h4>
              <div className="space-y-1">
                <span className="text-gray-400">• Click dates for details</span>
                <span className="text-gray-400">• Use arrow keys to navigate</span>
                <span className="text-gray-400">• Hover for quick info</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Settings & Preferences"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-medium mb-3">Color Theme</h3>
            <div className="grid grid-cols-1 gap-3">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => setCurrentTheme(themeOption.id)}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 ${
                    currentTheme === themeOption.id ? 'border-blue-500' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: themeOption.colors.surface }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium" style={{ color: themeOption.colors.text }}>
                        {themeOption.name}
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: themeOption.colors.volatility.low }} />
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: themeOption.colors.volatility.medium }} />
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: themeOption.colors.volatility.high }} />
                      </div>
                    </div>
                    {currentTheme === themeOption.id && (
                      <Palette className="text-blue-400" size={20} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-3">Data Display</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-gray-300">Show volume indicators</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-gray-300">Show performance arrows</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-gray-300">Show volatility bars</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-3">Advanced Features</h3>
            <button
              onClick={() => { setShowSettings(false); setShowPatterns(true); }}
              className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <span className="text-gray-300">Pattern Analysis</span>
              <Activity size={16} className="text-orange-400" />
            </button>
          </div>
        </div>
      </Modal>

      {/* Charts Modal */}
      <Modal
        isOpen={showCharts}
        onClose={() => setShowCharts(false)}
        title="Advanced Charts"
      >
        <VolatilityChart data={data} />
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        title="Export Data"
      >
        <ExportPanel data={data} currentDate={currentDate} />
      </Modal>

      {/* Alerts Modal */}
      <Modal
        isOpen={showAlerts}
        onClose={() => setShowAlerts(false)}
        title="Alert Management"
      >
        <AlertsPanel
          alerts={alerts}
          triggeredAlerts={triggeredAlerts}
          onAddAlert={addAlert}
          onUpdateAlert={updateAlert}
          onDeleteAlert={deleteAlert}
        />
      </Modal>

      {/* Comparison Modal */}
      <Modal
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        title="Period Comparison"
      >
        <ComparisonPanel data={data} currentDate={currentDate} />
      </Modal>

      {/* Patterns Modal */}
      <Modal
        isOpen={showPatterns}
        onClose={() => setShowPatterns(false)}
        title="Pattern Analysis"
      >
        <PatternsPanel data={data} />
      </Modal>
    </div>
  );
}

export default App;