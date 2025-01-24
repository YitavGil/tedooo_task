// src/components/layout/Header/SearchBar.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
  minQueryLength?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search',
  className,
  initialValue = '',
  minQueryLength = 2
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    debounce((searchQuery: string) => {
      if (!onSearch || searchQuery.length < minQueryLength) return;

      setIsLoading(true);
      try {
        onSearch(searchQuery);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [onSearch, minQueryLength]
  );

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  }, [handleSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    handleSearch('');
    inputRef.current?.focus();
  }, [handleSearch]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleClear();
    }
  }, [handleClear]);

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  return (
    <Container 
      className={className} 
      isFocused={isFocused}
      role="search"
    >
      <SearchIcon 
        aria-hidden="true"
        isLoading={isLoading}
      >
        {isLoading ? '⌛' : '🔍'}
      </SearchIcon>
      
      <Input
        ref={inputRef}
        type="search"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        aria-label="Search input"
        aria-busy={isLoading}
        autoComplete="off"
      />

      {query && (
        <ClearButton
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          tabIndex={0}
        >
          ✕
        </ClearButton>
      )}
    </Container>
  );
};

export default React.memo(SearchBar);

const Container = styled.div<{ isFocused: boolean }>`
  position: relative;
  width: 100%;
  max-width: 400px;
  background: ${props => props.isFocused ? '#FFFFFF' : '#F3F4F6'};
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid ${props => props.isFocused ? '#3B82F6' : 'transparent'};

  &:hover {
    background: ${props => props.isFocused ? '#FFFFFF' : '#E5E7EB'};
  }
`;

const SearchIcon = styled.span<{ isLoading: boolean }>`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
  pointer-events: none;
  opacity: ${props => props.isLoading ? 0.6 : 1};
  transition: opacity 0.2s ease;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 8px 36px;
  background: transparent;
  border: none;
  font-size: 14px;
  color: #111827;
  caret-color: #3B82F6;

  &::placeholder {
    color: #9CA3AF;
    opacity: 0.8;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-search-cancel-button,
  &::-webkit-search-decoration {
    display: none;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  color: #6B7280;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #F3F4F6;
    color: #4B5563;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3B82F6;
  }
`;