import React, { useState } from 'react';
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Alert } from '../../types/financial';

interface AlertsPanelProps {
  alerts: Alert[];
  triggeredAlerts: Alert[];
  onAddAlert: (alert: Omit<Alert, 'id' | 'triggeredDates'>) => void;
  onUpdateAlert: (id: string, updates: Partial<Alert>) => void;
  onDeleteAlert: (id: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  triggeredAlerts,
  onAddAlert,
  onUpdateAlert,
  onDeleteAlert,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: 'volatility' as Alert['type'],
    condition: 'above' as Alert['condition'],
    threshold: 0,
    message: '',
    isActive: true,
  });

  const handleAddAlert = () => {
    if (newAlert.message && newAlert.threshold !== 0) {
      onAddAlert(newAlert);
      setNewAlert({
        type: 'volatility',
        condition: 'above',
        threshold: 0,
        message: '',
        isActive: true,
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="text-yellow-400" size={20} />
          <h3 className="text-white font-semibold">Alert System</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Add Alert</span>
        </button>
      </div>

      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <h4 className="text-red-200 font-medium mb-3">Active Alerts ({triggeredAlerts.length})</h4>
          <div className="space-y-2">
            {triggeredAlerts.map((alert) => (
              <div key={alert.id} className="bg-red-800 p-3 rounded">
                <div className="text-red-100 font-medium">{alert.message}</div>
                <div className="text-red-200 text-sm">
                  Triggered on {alert.triggeredDates.length} dates
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Alert Form */}
      {showAddForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Create New Alert</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Type</label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as Alert['type'] })}
                className="w-full bg-gray-700 text-white rounded px-3 py-2"
              >
                <option value="volatility">Volatility</option>
                <option value="performance">Performance</option>
                <option value="volume">Volume</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-1">Condition</label>
              <select
                value={newAlert.condition}
                onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value as Alert['condition'] })}
                className="w-full bg-gray-700 text-white rounded px-3 py-2"
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-1">Threshold</label>
              <input
                type="number"
                value={newAlert.threshold}
                onChange={(e) => setNewAlert({ ...newAlert, threshold: parseFloat(e.target.value) })}
                className="w-full bg-gray-700 text-white rounded px-3 py-2"
                placeholder="Enter threshold value"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-1">Message</label>
              <input
                type="text"
                value={newAlert.message}
                onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                className="w-full bg-gray-700 text-white rounded px-3 py-2"
                placeholder="Alert message"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleAddAlert}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Create Alert
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

      {/* Existing Alerts */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Configured Alerts</h4>
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-medium">{alert.message}</div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateAlert(alert.id, { isActive: !alert.isActive })}
                  className="text-gray-400 hover:text-white"
                >
                  {alert.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
                <button
                  onClick={() => onDeleteAlert(alert.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              {alert.type} {alert.condition} {alert.threshold}
              {alert.type === 'volatility' || alert.type === 'performance' ? '%' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};