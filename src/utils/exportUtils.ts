import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import { FinancialData } from '../types/financial';

export const exportToPDF = async (elementId: string, filename: string = 'market-data') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#111827',
      scale: 2,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;

    pdf.setFontSize(16);
    pdf.text('Market Seasonality Report', pdfWidth / 2, 20, { align: 'center' });
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting PDF:', error);
  }
};

export const exportToCSV = (data: FinancialData[], filename: string = 'market-data') => {
  const csvData = data.map(item => ({
    Date: item.date,
    'Open Price': item.openPrice,
    'Close Price': item.closePrice,
    'High Price': item.highPrice,
    'Low Price': item.lowPrice,
    Volume: item.volume,
    'Volatility (%)': item.volatility,
    'Liquidity': item.liquidity,
    'Performance (%)': item.performance,
    RSI: item.rsi,
    'Moving Average': item.movingAverage,
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToImage = async (elementId: string, filename: string = 'market-data', format: 'png' | 'jpeg' = 'png') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#111827',
      scale: 2,
      logging: false,
    });

    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
  } catch (error) {
    console.error('Error exporting image:', error);
  }
};