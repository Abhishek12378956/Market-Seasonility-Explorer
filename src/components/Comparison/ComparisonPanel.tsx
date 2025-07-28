import React, { useState } from 'react';
import { GitCompare, Plus, X } from 'lucide-react';
import { ComparisonPeriod, FinancialData } from '../../types/financial';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface ComparisonPanelProps {
  data: FinancialData[];
  currentDate: Date;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({ data, currentDate }) => {
  const [comparisonPeriods, setComparisonPeriods] = useState<ComparisonPeriod[]>([
    {
      id: '1',
      name: 'Current Month',
      startDate: startOfMonth(currentDate),
      endDate: endOfMonth(currentDate),
      color: '#3B82F6',
    },
    {
      id: '2',
      name: 'Previous Month',
      startDate: startOfMonth(subMonths(currentDate, 1)),
      endDate: endOfMonth(subMonths(currentDate, 1)),
      color: '#10B981',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPeriod, setNewPeriod] = useState({
    name: '',
    startDate: format(startOfMonth(currentDate), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(currentDate), 'yyyy-MM-dd'),
    color: '#F59E0B',
  });

  const getDataForPeriod = (period: ComparisonPeriod) => {
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= period.startDate && itemDate <= period.endDate;
    });
  };

  const calculateMetrics = (periodData: FinancialData[]) => {
    if (periodData.length === 0) return null;

    const avgVolatility = periodData.reduce((sum, d) => sum + d.volatility, 0) / periodData.length;
    const avgPerformance = periodData.reduce((sum, d) => sum + d.performance, 0) / periodData.length;
    const totalVolume = periodData.reduce((sum, d) => sum + d.volume, 0);
    const avgPrice = periodData.reduce((sum, d) => sum + d.closePrice, 0) / periodData.length;

    return {
      avgVolatility,
      avgPerformance,
      totalVolume,
      avgPrice,
      dataPoints: periodData.length,
    };
  };

  const addPeriod = () => {
    if (newPeriod.name) {
      const period: ComparisonPeriod = {
        id: Date.now().toString(),
        name: newPeriod.name,
        startDate: new Date(newPeriod.startDate),
        endDate: new Date(newPeriod.endDate),
        color: newPeriod.color,
      };
      setComparisonPeriods([...comparisonPeriods, period]);
      setNewPeriod({
        name: '',
        startDate: format(startOfMonth(currentDate), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(currentDate), 'yyyy-MM-dd'),
        color: '#F59E0B',
      });
      setShowAddForm(false);
    }
  };

  const removePeriod = (id: string) => {
    setComparisonPeriods(comparisonPeriods.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GitCompare className="text-purple-400" size={20} />
          <h3 className="text-white font-semibold">Period Comparison</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Add Period</span>
        </button>
      </div>

      {/* Add Period Form */}
      {showAddForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Add Comparison Period</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Name</label>
              <input
                type="text"
                value={newPeriod.name}
                onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
                className="w-full bg-gray-700 text-white rounded px-3 py-2"
                placeholder="Period name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Start Date</label>
                <input
                  type="date"
                  value={newPeriod.startDate}
                  onChange={(e) => setNewPeriod({ ...newPeriod, startDate: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">End Date</label>
                <input
                  type="date"
                  value={newPeriod.endDate}
                  onChange={(e) => setNewPeriod({ ...newPeriod, endDate: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-1">Color</label>
              <input
                type="color"
                value={newPeriod.color}
                onChange={(e) => setNewPeriod({ ...newPeriod, color: e.target.value })}
                className="w-full bg-gray-700 rounded px-3 py-2 h-10"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={addPeriod}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Add Period
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Results */}
      <div className="space-y-4">
        {comparisonPeriods.map((period) => {
          const periodData = getDataForPeriod(period);
          const metrics = calculateMetrics(periodData);

          return (
            <div key={period.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: period.color }}
                  />
                  <h4 className="text-white font-medium">{period.name}</h4>
                </div>
                {comparisonPeriods.length > 1 && (
                  <button
                    onClick={() => removePeriod(period.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="text-sm text-gray-400 mb-3">
                {format(period.startDate, 'MMM dd, yyyy')} - {format(period.endDate, 'MMM dd, yyyy')}
              </div>

              {metrics ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Avg Volatility</div>
                    <div className="text-white font-medium">{metrics.avgVolatility.toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Avg Performance</div>
                    <div className={`font-medium ${metrics.avgPerformance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {metrics.avgPerformance >= 0 ? '+' : ''}{metrics.avgPerformance.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Total Volume</div>
                    <div className="text-white font-medium">{(metrics.totalVolume / 1000000000).toFixed(1)}B</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Avg Price</div>
                    <div className="text-white font-medium">${metrics.avgPrice.toLocaleString()}</div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-sm">No data available for this period</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison Summary */}
      {comparisonPeriods.length > 1 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Comparison Summary</h4>
          <div className="text-sm text-gray-300">
            <p>• Compare volatility patterns across different time periods</p>
            <p>• Identify seasonal trends and performance variations</p>
            <p>• Analyze volume and liquidity changes over time</p>
          </div>
        </div>
      )}
    </div>
  );
};