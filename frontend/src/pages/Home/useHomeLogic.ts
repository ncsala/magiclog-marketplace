import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { productService } from '@/services';
import { SearchFilters } from '@/types';

export const useHomeLogic = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    sku: '',
    minPrice: 0,
    maxPrice: 1000,
  });

  const debouncedSearch = useCallback(
    debounce((newFilters: SearchFilters) => {
      setFilters(newFilters);
    }, 300),
    []
  );

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.searchProducts(filters),
    placeholderData: (previousData) => previousData,
  });

  const updateSearch = (newFilters: Partial<SearchFilters>) => {
    debouncedSearch({ ...filters, ...newFilters });
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    const [minPrice, maxPrice] = newValue as number[];
    updateSearch({ minPrice, maxPrice });
  };  

  return { products, isLoading, error, filters, updateSearch, handlePriceChange };
};