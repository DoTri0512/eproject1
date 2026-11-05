import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useDestinations from "./useDestinations";

export const useDestinationsListState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state from URL query or defaults
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    region: searchParams.get("region") || "",
    theme: searchParams.get("theme") || "",
    budget: searchParams.get("budget") || "",
    season: searchParams.get("season") || "",
  });

  const [sortBy, setSortBy] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Sync to API hook
  const { destinations, isLoading } = useDestinations(filters);

  // Update URL and filters
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.region) params.set("region", newFilters.region);
    if (newFilters.theme) params.set("theme", newFilters.theme);
    if (newFilters.budget) params.set("budget", newFilters.budget);
    if (newFilters.season) params.set("season", newFilters.season);
    setSearchParams(params);
    setVisibleCount(9);
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      search: "",
      region: "",
      theme: "",
      budget: "",
      season: "",
    };
    setFilters(emptyFilters);
    setSearchParams(new URLSearchParams());
    setVisibleCount(9);
  };

  // Sort destinations
  const sortedDestinations = useMemo(() => {
    const list = [...destinations];
    if (sortBy === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    } else if (sortBy === "name-desc") {
      list.sort((a, b) => b.name.localeCompare(a.name, "vi"));
    }
    return list;
  }, [destinations, sortBy]);

  const displayedDestinations = sortedDestinations.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const hasActiveFilters = Boolean(
    filters.region || filters.theme || filters.budget || filters.season
  );

  return {
    filters,
    sortBy,
    setSortBy,
    isLoading,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    hasActiveFilters,
    sortedDestinations,
    displayedDestinations,
    visibleCount,
    handleFilterChange,
    handleResetFilters,
    handleLoadMore,
  };
};

export default useDestinationsListState;

