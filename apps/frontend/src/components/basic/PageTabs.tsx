import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/basic/tabs';
import { Button } from '@/components/basic/button';
import { LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/utils';

interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  content: React.ReactNode;
  badge?: React.ReactNode;
}

interface PageTabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
  showNavigation?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
}

const PageTabs: React.FC<PageTabsProps> = ({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
  tabsListClassName,
  tabsTriggerClassName,
  tabsContentClassName,
  showNavigation = false,
  onNext,
  onPrevious,
  canGoNext = true,
  canGoPrevious = true
}) => {
  const getGridCols = () => {
    const count = items.length;
    if (count <= 2) return 'grid-cols-2';
    if (count <= 3) return 'grid-cols-3';
    if (count <= 4) return 'grid-cols-4';
    if (count <= 5) return 'grid-cols-5';
    if (count <= 6) return 'grid-cols-6';
    if (count <= 7) return 'grid-cols-7';
    if (count <= 8) return 'grid-cols-8';
    if (count <= 9) return 'grid-cols-9';
    return 'grid-cols-10';
  };

  const styles = {
    tabsList: `grid w-full ${getGridCols()} bg-gray-100/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg p-1`,
    tabsTrigger: 'flex items-center justify-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-md transition-all duration-300 px-3 py-1 text-sm',
    tabsContent: 'space-y-6 mt-6'
  };

  return (
    <div className={cn('space-y-6', className)}>
      <Tabs 
        defaultValue={defaultValue} 
        value={value} 
        onValueChange={onValueChange} 
        className="space-y-6"
      >
        <TabsList className={cn(styles.tabsList, tabsListClassName)}>
          {items.map((item) => {
            const IconComponent = item.icon;
            return (
              <TabsTrigger 
                key={item.id} 
                value={item.id} 
                className={cn(styles.tabsTrigger, tabsTriggerClassName)}
              >
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <span>{item.label}</span>
                {item.badge && item.badge}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {items.map((item) => (
          <TabsContent 
            key={item.id} 
            value={item.id} 
            className={cn(styles.tabsContent, tabsContentClassName)}
          >
            {item.content}
          </TabsContent>
        ))}
      </Tabs>

      {showNavigation && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PageTabs; 