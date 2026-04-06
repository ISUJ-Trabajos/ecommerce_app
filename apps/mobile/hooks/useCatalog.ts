import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { CatalogAPI } from '../services/catalog.service';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: CatalogAPI.getCategories,
    staleTime: 5 * 60 * 1000, // 5 min stale — stays cached in memory
  });

export const useFeatured = () =>
  useQuery({
    queryKey: ['products', 'featured'],
    queryFn: CatalogAPI.getFeatured,
    staleTime: 3 * 60 * 1000,
  });

export const useProducts = (filters: {
  category?: string;
  search?: string;
  sort?: string;
}) =>
  useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: ({ pageParam = 1 }) =>
      CatalogAPI.getProducts({ ...filters, page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage: any) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages)
        return lastPage.pagination.page + 1;
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });

export const useProductDetail = (slug: string) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: () => CatalogAPI.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000,
  });
