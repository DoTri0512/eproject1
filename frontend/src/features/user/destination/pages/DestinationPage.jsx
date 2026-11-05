import React from "react";
import DestinationFilter from "../components/DestinationFilter";
import DestinationBanner from "../components/list/DestinationBanner";
import DestinationResultsHeader from "../components/list/DestinationResultsHeader";
import DestinationList from "../components/DestinationList";
import DestinationMobileFilterDrawer from "../components/list/DestinationMobileFilterDrawer";
import useDestinationsListState from "../hooks/useDestinationsListState";

export const DestinationPage = () => {
  const {
    filters,
    sortBy,
    setSortBy,
    isLoading,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    hasActiveFilters,
    sortedDestinations,
    displayedDestinations,
    handleFilterChange,
    handleResetFilters,
    handleLoadMore,
  } = useDestinationsListState();

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-[110px] pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Banner Section */}
        <DestinationBanner
          searchValue={filters.search}
          onSearchChange={(val) =>
            handleFilterChange({ ...filters, search: val })
          }
        />

        {/* Filters Topbar (Desktop) & Trigger (Mobile) */}
        <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1">
            <DestinationFilter
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              className="hidden lg:block"
            />
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm shadow-xs hover:bg-slate-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">
                filter_list
              </span>
              <span>Bộ lọc</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Results Header: Count & Sort */}
        <DestinationResultsHeader
          isLoading={isLoading}
          totalCount={sortedDestinations.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Destination List (Grid of DestinationItem / Loading / Empty State) */}
        <DestinationList
          isLoading={isLoading}
          destinations={displayedDestinations}
          totalCount={sortedDestinations.length}
          onResetFilters={handleResetFilters}
          onLoadMore={handleLoadMore}
        />
      </div>

      {/* Mobile Off-canvas Filter Sheet */}
      <DestinationMobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default DestinationPage;

