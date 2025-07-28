import React, { useState } from 'react';
import { Download, FileText, Image, FileSpreadsheet } from 'lucide-react';
import { exportToPDF, exportToCSV, exportToImage } from '../../utils/exportUtils';
import { FinancialData } from '../../types/financial';

interface ExportPanelProps {
  data: FinancialData[];
  currentDate: Date;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ data, currentDate }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<string>('');

  const handleExport = async (type: 'pdf' | 'csv' | 'png' | 'jpeg') => {
    setIsExporting(true);
    setExportType(type);

    const filename = `market-data-${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;

    try {
      switch (type) {
        case 'pdf':
          await exportToPDF('calendar-container', filename);
          break;
        case 'csv':
          exportToCSV(data, filename);
          break;
        case 'png':
          await exportToImage('calendar-container', filename, 'png');
          break;
        case 'jpeg':
          await exportToImage('calendar-container', filename, 'jpeg');
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportType('');
    }
  };

  const exportOptions = [
    {
      type: 'pdf' as const,
      label: 'Export as PDF',
      description: 'Complete calendar with charts',
      icon: FileText,
      color: 'bg-red-600 hover:bg-red-700',
    },
    {
      type: 'csv' as const,
      label: 'Export as CSV',
      description: 'Raw data for analysis',
      icon: FileSpreadsheet,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      type: 'png' as const,
      label: 'Export as PNG',
      description: 'High-quality image',
      icon: Image,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      type: 'jpeg' as const,
      label: 'Export as JPEG',
      description: 'Compressed image',
      icon: Image,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Download className="text-blue-400" size={20} />
        <h3 className="text-white font-semibold">Export Options</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          const isCurrentlyExporting = isExporting && exportType === option.type;

          return (
            <button
              key={option.type}
              onClick={() => handleExport(option.type)}
              disabled={isExporting}
              className={`
                flex items-center space-x-3 p-4 rounded-lg transition-all duration-200
                ${option.color} disabled:opacity-50 disabled:cursor-not-allowed
                ${isCurrentlyExporting ? 'animate-pulse' : ''}
              `}
            >
              <Icon size={20} className="text-white" />
              <div className="flex-1 text-left">
                <div className="text-white font-medium">{option.label}</div>
                <div className="text-gray-200 text-sm">{option.description}</div>
              </div>
              {isCurrentlyExporting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-700 rounded-lg">
        <h4 className="text-white font-medium mb-2">Export Information</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <p>• PDF: Includes calendar, charts, and legends</p>
          <p>• CSV: Raw data with all metrics for analysis</p>
          <p>• PNG: High-quality image with transparency</p>
          <p>• JPEG: Compressed image for sharing</p>
        </div>
      </div>
    </div>
  );
};