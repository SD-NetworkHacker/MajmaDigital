import React, { useState, useMemo } from 'react';
import { 
  Search, ChevronDown, ChevronLeft, ChevronRight, 
  Download, Filter, CheckSquare, Square, ArrowUp, ArrowDown 
} from 'lucide-react';
import { exportToCSV } from '../../services/analyticsEngine';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  enableSelection?: boolean;
  enableSearch?: boolean;
  enableExport?: boolean;
  actions?: React.ReactNode;
  onRowClick?: (item: T) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  identifierKey?: string; // Clé unique pour la sélection (ex: 'id')
}

function DataTable<T extends Record<string, any>>({ 
  data, 
  columns, 
  title, 
  enableSelection = false, 
  enableSearch = true, 
  enableExport = true,
  actions,
  onRowClick,
  onSelectionChange,
  identifierKey = 'id'
}: DataTableProps<T>) {
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // --- LOGIC ---

  // 1. Filtering
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // 2. Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // 3. Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  // --- HANDLERS ---

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    } else {
      const newIds = new Set(paginatedData.map(item => String(item[identifierKey])));
      setSelectedIds(newIds);
      onSelectionChange?.(Array.from(newIds) as string[]);
    }
  };

  const handleSelectRow = (id: string) => {
    const newIds = new Set(selectedIds);
    if (newIds.has(id)) newIds.delete(id);
    else newIds.add(id);
    setSelectedIds(newIds);
    onSelectionChange?.(Array.from(newIds) as string[]);
  };

  const handleExport = () => {
    exportToCSV(`export_table_${new Date().toISOString().slice(0,10)}.csv`, sortedData);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      
      {/* Header Toolbar */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/30">
         <div className="flex items-center gap-4 w-full md:w-auto">
            {title && (
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h3>
            )}
            {enableSearch && (
              <div className="relative flex-1 md:w-64 group">
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Rechercher..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                 />
              </div>
            )}
         </div>
         
         <div className="flex items-center gap-2 self-end md:self-auto">
            {actions}
            {enableExport && (
              <button 
                onClick={handleExport}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm" 
                title="Exporter CSV"
              >
                 <Download size={18} />
              </button>
            )}
         </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
           <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                 {enableSelection && (
                   <th className="px-6 py-4 w-12 text-center">
                      <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-600">
                         {selectedIds.size > 0 && selectedIds.size === paginatedData.length 
                            ? <CheckSquare size={16} className="text-emerald-500"/> 
                            : <Square size={16}/>}
                      </button>
                   </th>
                 )}
                 {columns.map((col) => (
                   <th 
                     key={col.key} 
                     className={`px-6 py-4 ${col.sortable ? 'cursor-pointer hover:bg-slate-100 hover:text-slate-600 transition-colors' : ''}`}
                     style={{ width: col.width }}
                     onClick={() => col.sortable && handleSort(col.key)}
                   >
                      <div className="flex items-center gap-2">
                         {col.label}
                         {sortConfig?.key === col.key && (
                            sortConfig.direction === 'asc' ? <ArrowUp size={10}/> : <ArrowDown size={10}/>
                         )}
                      </div>
                   </th>
                 ))}
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
              {paginatedData.length > 0 ? paginatedData.map((row, index) => (
                <tr 
                  key={row[identifierKey] || index} 
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`group transition-all ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''} ${selectedIds.has(row[identifierKey]) ? 'bg-emerald-50/30' : ''}`}
                >
                   {enableSelection && (
                     <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleSelectRow(String(row[identifierKey]))} className="text-slate-300 hover:text-emerald-500">
                           {selectedIds.has(String(row[identifierKey])) 
                              ? <CheckSquare size={16} className="text-emerald-500"/> 
                              : <Square size={16}/>}
                        </button>
                     </td>
                   )}
                   {columns.map((col) => (
                     <td key={`${row[identifierKey]}-${col.key}`} className="px-6 py-4 text-xs font-medium text-slate-700">
                        {col.render ? col.render(row) : row[col.key]}
                     </td>
                   ))}
                </tr>
              )) : (
                <tr>
                   <td colSpan={columns.length + (enableSelection ? 1 : 0)} className="px-6 py-20 text-center text-slate-400 italic text-xs">
                      Aucune donnée trouvée.
                   </td>
                </tr>
              )}
           </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/30">
         <span className="text-[10px] font-bold text-slate-400 uppercase">
            Page {currentPage} sur {totalPages || 1} • {sortedData.length} résultats
         </span>
         <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
               <ChevronLeft size={16} />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
               <ChevronRight size={16} />
            </button>
         </div>
      </div>
    </div>
  );
}

export default DataTable;