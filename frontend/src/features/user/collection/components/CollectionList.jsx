import React from "react";
import CollectionItem from "./CollectionItem";

export const CollectionList = ({
  isLoading,
  collections = [],
  selectedCollection,
  onSelectCollection,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl h-56 animate-pulse border border-slate-100"
          />
        ))}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 text-slate-500">
        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
          auto_awesome_motion
        </span>
        <p className="text-sm font-medium">
          Hiện chưa có bộ sưu tập nào được công bố.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((col) => {
        const isSelected = selectedCollection?._id === col._id;
        return (
          <CollectionItem
            key={col._id || col.slug}
            collection={col}
            isSelected={isSelected}
            onSelect={onSelectCollection}
          />
        );
      })}
    </div>
  );
};

export default CollectionList;

