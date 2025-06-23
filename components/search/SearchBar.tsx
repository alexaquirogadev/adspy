import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ImageSearchButton from './ImageSearchButton';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onImageSearch?: (image: File) => void;
  onOpenFilters: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onImageSearch, onOpenFilters }) => {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleImageSearch = (file: File) => {
    if (onImageSearch) {
      onImageSearch(file);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="sticky top-0 z-30 -mx-4 px-4 py-2 bg-neutral-100 md:mx-0 md:px-0 md:py-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar anuncios..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <ImageSearchButton onImageSearch={handleImageSearch} />
        <button 
          type="button"
          onClick={onOpenFilters}
          className="p-2.5 bg-white border-2 border-black rounded-full hover:bg-neutral-50 transition-colors"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;