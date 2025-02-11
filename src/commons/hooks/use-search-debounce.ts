import { useState, useEffect } from "react";
import debounce from "lodash/debounce";

export function useSearchDebounce(
  callback: (value: string) => void,
  delay = 300
) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const debouncedSearch = debounce((term: string) => {
      callback(term);
    }, delay);

    if (searchTerm) {
      debouncedSearch(searchTerm);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, callback, delay]);

  return { searchTerm, setSearchTerm };
}
