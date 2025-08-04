import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Search } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

// Helper function to extract text content from React elements
const extractTextFromReactElement = (element: React.ReactElement): string => {
  if (typeof element.props.children === 'string') {
    return element.props.children;
  }
  
  if (Array.isArray(element.props.children)) {
    return element.props.children
      .map((child: any) => {
        if (typeof child === 'string') {
          return child;
        }
        if (React.isValidElement(child)) {
          return extractTextFromReactElement(child);
        }
        return '';
      })
      .join(' ');
  }
  
  if (React.isValidElement(element.props.children)) {
    return extractTextFromReactElement(element.props.children);
  }
  
  return '';
};

// Types for the table component
export interface TableColumn<T = any> {
  key: string;
  header: string;
  accessor: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
  headerClassName?: string;
  searchable?: boolean; // Add searchable property
  searchValue?: (item: T) => string; // Add custom search value function
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  sortable?: boolean;
  pagination?: boolean;
  searchable?: boolean;
  selectable?: boolean;
  onRowClick?: (item: T) => void;
  onSelectionChange?: (selectedItems: T[]) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  className?: string;
  emptyMessage?: string | React.ReactNode;
  loading?: boolean;
  actions?: {
    label: string | ((item: T) => string);
    icon?: React.ReactNode | ((item: T) => React.ReactNode);
    onClick: (item: T) => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | ((item: T) => 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link');
    disabled?: (item: T) => boolean;
  }[];
  bulkActions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: (selectedItems: T[]) => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    disabled?: (selectedItems: T[]) => boolean;
  }[];
}

export interface TableState {
  currentPage: number;
  pageSize: number;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
  selectedItems: Set<string>;
}

// Table Header Component
const TableHeader = <T extends Record<string, any>>({
  columns,
  sortable,
  sortColumn,
  sortDirection,
  onSort,
  selectable,
  allSelected,
  onSelectAll,
  className = ""
}: {
  columns: TableColumn<T>[];
  sortable?: boolean;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
  selectable?: boolean;
  allSelected?: boolean;
  onSelectAll?: (selected: boolean) => void;
  className?: string;
}) => {
  return (
    <thead className={`bg-gray-50 border-b border-gray-200 ${className}`}>
      <tr>
        {selectable && (
          <th className="w-12 px-4 py-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAll?.(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </th>
        )}
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
              column.sortable && sortable ? 'cursor-pointer hover:bg-gray-100' : ''
            } ${column.headerClassName || ''}`}
            style={{ width: column.width }}
            onClick={() => {
              if (column.sortable && sortable) {
                onSort(column.key);
              }
            }}
          >
            <div className="flex items-center space-x-1">
              <span>{column.header}</span>
              {column.sortable && sortable && (
                <div className="flex flex-col">
                  {sortColumn === column.key ? (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )
                  ) : (
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3 text-gray-300" />
                      <ChevronDown className="h-3 w-3 text-gray-300" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </th>
        ))}
        {(columns.some(col => col.key === 'actions') || columns.length > 0) && (
          <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        )}
      </tr>
    </thead>
  );
};

// Table Row Component
const TableRow = <T extends Record<string, any>>({
  item,
  columns,
  selectable,
  selected,
  onSelect,
  onRowClick,
  actions,
  getItemId,
  className = ""
}: {
  item: T;
  columns: TableColumn<T>[];
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onRowClick?: (item: T) => void;
  actions?: TableProps<T>['actions'];
  getItemId: (item: T) => string;
  className?: string;
}) => {
  return (
    <tr
      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        onRowClick ? 'cursor-pointer' : ''
      } ${selected ? 'bg-blue-50' : ''} ${className}`}
      onClick={() => onRowClick?.(item)}
    >
      {selectable && (
        <td className="w-12 px-4 py-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect?.(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </td>
      )}
      {columns.map((column) => (
        <td
          key={column.key}
          className={`px-4 py-3 text-sm text-gray-900 ${column.className || ''}`}
        >
          {column.accessor(item)}
        </td>
      ))}
      {actions && actions.length > 0 && (
        <td className="w-20 px-4 py-3">
          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
            {actions.map((action, index) => {
              const label = typeof action.label === 'function' ? action.label(item) : action.label;
              const icon = typeof action.icon === 'function' ? action.icon(item) : action.icon;
              const variant = typeof action.variant === 'function' ? action.variant(item) : (action.variant || 'ghost');
              
              return (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={variant}
                        size="sm"
                        onClick={() => action.onClick(item)}
                        disabled={action.disabled?.(item)}
                        className="h-8 w-8 p-0"
                      >
                        {icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </td>
      )}
    </tr>
  );
};

// Pagination Component
const TablePagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100]
}: {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-700">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show:</span>
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className="w-8 h-8 p-0"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Main Table Component
export const Table = <T extends Record<string, any>>({
  data,
  columns,
  sortable = true,
  pagination = true,
  searchable = true,
  selectable = false,
  onRowClick,
  onSelectionChange,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  className = "",
  emptyMessage = "No data available",
  loading = false,
  actions = [],
  bulkActions = []
}: TableProps<T>) => {
  const [state, setState] = useState<TableState>({
    currentPage: 1,
    pageSize: initialPageSize,
    sortColumn: null,
    sortDirection: 'asc',
    searchTerm: '',
    selectedItems: new Set()
  });

  // Get unique identifier for items (default to 'id' property)
  const getItemId = (item: T): string => {
    return (item as any).id || JSON.stringify(item);
  };

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchable && state.searchTerm) {
      filtered = filtered.filter((item) => {
        return columns.some((column) => {
          // Skip columns that are not searchable
          if (column.searchable === false) {
            return false;
          }
          
          // Use custom search value function if provided
          if (column.searchValue) {
            const searchValue = column.searchValue(item);
            return searchValue.toLowerCase().includes(state.searchTerm.toLowerCase());
          }
          
          // For columns without custom search value, try to get a string representation
          const value = column.accessor(item);
          
          // If it's a string, search directly
          if (typeof value === 'string') {
            return value.toLowerCase().includes(state.searchTerm.toLowerCase());
          }
          
          // If it's a React element, we can't search it effectively
          // Only search columns that have searchable=true explicitly
          if (column.searchable === true) {
            // Try to extract text content from React elements (basic approach)
            if (React.isValidElement(value)) {
              const textContent = extractTextFromReactElement(value);
              return textContent.toLowerCase().includes(state.searchTerm.toLowerCase());
            }
          }
          
          return false;
        });
      });
    }

    // Apply sorting
    if (sortable && state.sortColumn) {
      const column = columns.find(col => col.key === state.sortColumn);
      if (column) {
        filtered = [...filtered].sort((a, b) => {
          const aValue = column.accessor(a);
          const bValue = column.accessor(b);
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return state.sortDirection === 'asc' 
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }
          
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return state.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
          }
          
          return 0;
        });
      }
    }

    return filtered;
  }, [data, columns, state.searchTerm, state.sortColumn, state.sortDirection, searchable, sortable]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const endIndex = startIndex + state.pageSize;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, state.currentPage, state.pageSize, pagination]);

  const totalPages = Math.ceil(processedData.length / state.pageSize);
  const allSelected = paginatedData.length > 0 && paginatedData.every(item => 
    state.selectedItems.has(getItemId(item))
  );

  // Event handlers
  const handleSort = (columnKey: string) => {
    setState(prev => ({
      ...prev,
      sortColumn: columnKey,
      sortDirection: prev.sortColumn === columnKey && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setState(prev => ({ 
      ...prev, 
      pageSize: newPageSize, 
      currentPage: 1 
    }));
  };

  const handleSelectAll = (selected: boolean) => {
    const newSelectedItems = new Set(state.selectedItems);
    
    if (selected) {
      paginatedData.forEach(item => {
        newSelectedItems.add(getItemId(item));
      });
    } else {
      paginatedData.forEach(item => {
        newSelectedItems.delete(getItemId(item));
      });
    }
    
    setState(prev => ({ ...prev, selectedItems: newSelectedItems }));
    onSelectionChange?.(data.filter(item => newSelectedItems.has(getItemId(item))));
  };

  const handleSelectItem = (item: T, selected: boolean) => {
    const newSelectedItems = new Set(state.selectedItems);
    const itemId = getItemId(item);
    
    if (selected) {
      newSelectedItems.add(itemId);
    } else {
      newSelectedItems.delete(itemId);
    }
    
    setState(prev => ({ ...prev, selectedItems: newSelectedItems }));
    onSelectionChange?.(data.filter(item => newSelectedItems.has(getItemId(item))));
  };

  const selectedItems = data.filter(item => state.selectedItems.has(getItemId(item)));

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Search and Bulk Actions */}
      {(searchable || bulkActions.length > 0) && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {searchable && (
              <div className="relative w-80">
                <Input
                  placeholder="Search..."
                  value={state.searchTerm}
                  onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value, currentPage: 1 }))}
                  className="pl-8"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            )}
            {bulkActions.length > 0 && selectedItems.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedItems.length} selected
                </span>
                {bulkActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'outline'}
                    size="sm"
                    onClick={() => action.onClick(selectedItems)}
                    disabled={action.disabled?.(selectedItems)}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader
            columns={columns}
            sortable={sortable}
            sortColumn={state.sortColumn}
            sortDirection={state.sortDirection}
            onSort={handleSort}
            selectable={selectable}
            allSelected={allSelected}
            onSelectAll={handleSelectAll}
          />
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={getItemId(item)}
                  item={item}
                  columns={columns}
                  selectable={selectable}
                  selected={state.selectedItems.has(getItemId(item))}
                  onSelect={(selected) => handleSelectItem(item, selected)}
                  onRowClick={onRowClick}
                  actions={actions}
                  getItemId={getItemId}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && processedData.length > 0 && (
        <TablePagination
          currentPage={state.currentPage}
          totalPages={totalPages}
          pageSize={state.pageSize}
          totalItems={processedData.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
};

// Re-export commonly used components
export { TableHeader, TableRow, TablePagination }; 