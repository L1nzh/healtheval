export const convertToCSV = (data: Record<string, any>[], headers?: string[]): string => {
  if (data.length === 0) return '';
  
  const headerKeys = headers || Object.keys(data[0]);
  
  const csvRows = [
    headerKeys.join(',')
  ];
  
  for (const item of data) {
    const values = headerKeys.map(key => {
      const value = item[key] !== undefined ? item[key] : '';
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

export const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};