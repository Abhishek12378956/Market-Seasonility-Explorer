import { useState, useEffect } from 'react';
import { Alert, FinancialData } from '../types/financial';

export const useAlerts = (data: FinancialData[]) => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'volatility',
      condition: 'above',
      threshold: 8,
      isActive: true,
      message: 'High volatility alert (>8%)',
      triggeredDates: [],
    },
    {
      id: '2',
      type: 'performance',
      condition: 'below',
      threshold: -5,
      isActive: true,
      message: 'Significant loss alert (<-5%)',
      triggeredDates: [],
    },
    {
      id: '3',
      type: 'volume',
      condition: 'above',
      threshold: 200000000,
      isActive: true,
      message: 'High volume alert (>200M)',
      triggeredDates: [],
    },
  ]);

  const [triggeredAlerts, setTriggeredAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const checkAlerts = () => {
      const newTriggeredAlerts: Alert[] = [];

      alerts.forEach(alert => {
        if (!alert.isActive) return;

        const triggeredDates: string[] = [];

        data.forEach(item => {
          let shouldTrigger = false;

          switch (alert.type) {
            case 'volatility':
              shouldTrigger = alert.condition === 'above' 
                ? item.volatility > alert.threshold
                : item.volatility < alert.threshold;
              break;
            case 'performance':
              shouldTrigger = alert.condition === 'above'
                ? item.performance > alert.threshold
                : item.performance < alert.threshold;
              break;
            case 'volume':
              shouldTrigger = alert.condition === 'above'
                ? item.volume > alert.threshold
                : item.volume < alert.threshold;
              break;
          }

          if (shouldTrigger) {
            triggeredDates.push(item.date);
          }
        });

        if (triggeredDates.length > 0) {
          newTriggeredAlerts.push({
            ...alert,
            triggeredDates,
          });
        }
      });

      setTriggeredAlerts(newTriggeredAlerts);
    };

    checkAlerts();
  }, [data, alerts]);

  const addAlert = (alert: Omit<Alert, 'id' | 'triggeredDates'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      triggeredDates: [],
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const updateAlert = (id: string, updates: Partial<Alert>) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, ...updates } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return {
    alerts,
    triggeredAlerts,
    addAlert,
    updateAlert,
    deleteAlert,
  };
};