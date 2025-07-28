import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { PatternMatch, FinancialData } from '../../types/financial';
import { detectPatterns } from '../../utils/patternAnalysis';

interface PatternsPanelProps {
  data: FinancialData[];
}

export const PatternsPanel: React.FC<PatternsPanelProps> = ({ data }) => {
  const [patterns, setPatterns] = useState<PatternMatch[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<PatternMatch | null>(null);

  useEffect(() => {
    const detectedPatterns = detectPatterns(data);
    setPatterns(detectedPatterns);
  }, [data]);

  const getPatternIcon = (type: PatternMatch['type']) => {
    switch (type) {
      case 'seasonal':
        return <Activity className="text-blue-400" size={16} />;
      case 'anomaly':
        return <AlertTriangle className="text-red-400" size={16} />;
      case 'trend':
        return <TrendingUp className="text-green-400" size={16} />;
      default:
        return <Activity className="text-gray-400" size={16} />;
    }
  };

  const getPatternColor = (type: PatternMatch['type']) => {
    switch (type) {
      case 'seasonal':
        return 'border-blue-500 bg-blue-900';
      case 'anomaly':
        return 'border-red-500 bg-red-900';
      case 'trend':
        return 'border-green-500 bg-green-900';
      default:
        return 'border-gray-500 bg-gray-900';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Activity className="text-orange-400" size={20} />
        <h3 className="text-white font-semibold">Pattern Analysis</h3>
      </div>

      {patterns.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
          <Activity className="text-gray-400 mx-auto mb-3" size={32} />
          <p className="text-gray-400">Analyzing patterns in your data...</p>
          <p className="text-gray-500 text-sm mt-2">
            Patterns will appear as more data becomes available
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {patterns.map((pattern, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${getPatternColor(pattern.type)}`}
              onClick={() => setSelectedPattern(selectedPattern?.description === pattern.description ? null : pattern)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getPatternIcon(pattern.type)}
                  <span className="text-white font-medium capitalize">{pattern.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${getConfidenceColor(pattern.confidence)}`}>
                    {(pattern.confidence * 100).toFixed(0)}%
                  </span>
                  <span className="text-gray-400 text-sm">
                    {pattern.dates.length} dates
                  </span>
                </div>
              </div>
              
              <p className="text-gray-200 text-sm mb-2">{pattern.description}</p>
              
              {selectedPattern?.description === pattern.description && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <h5 className="text-white font-medium mb-2">Affected Dates:</h5>
                  <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                    {pattern.dates.slice(0, 12).map((date, idx) => (
                      <div key={idx} className="text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded">
                        {new Date(date).toLocaleDateString()}
                      </div>
                    ))}
                    {pattern.dates.length > 12 && (
                      <div className="text-xs text-gray-400 px-2 py-1">
                        +{pattern.dates.length - 12} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pattern Legend */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3">Pattern Types</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <Activity className="text-blue-400" size={14} />
            <span className="text-gray-300">Seasonal: Recurring patterns based on time periods</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-red-400" size={14} />
            <span className="text-gray-300">Anomaly: Unusual events or outliers</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-green-400" size={14} />
            <span className="text-gray-300">Trend: Sustained directional movements</span>
          </div>
        </div>
      </div>
    </div>
  );
};