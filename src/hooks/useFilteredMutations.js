import { useMemo } from 'react';

export const useFilteredMutations = (dataMutation, type) => {
  return useMemo(() => {
    if (!dataMutation?.content) return [];
    
    return dataMutation.content.filter(item => {
      const itemType = item.typePaymentWarranty?.toLowerCase() || 
                       item.mutationType?.toLowerCase();
      return itemType === type.toLowerCase();
    });
  }, [dataMutation, type]);
};
