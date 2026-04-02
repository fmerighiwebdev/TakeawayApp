"use client";

import axios from "axios";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((response) => response.data.customizations);

export function useProductCustomizations(productId, open) {
  return useSWR(open ? `/api/products/customizations/${productId}` : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
  });
}
