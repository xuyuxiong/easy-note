import React from 'react';
import styles from './index.module.css';

export interface SearchBarProps {
  searchRef: React.MutableRefObject<HTMLInputElement>;
  searchNotes: (searchValue: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchRef,
  searchNotes,
}) => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        className={styles.searchInput}
        ref={searchRef}
        onChange={(event) => {
          event.preventDefault();
          searchNotes(event.target.value);
        }}
        placeholder="搜索笔记标题"
        onDragOver={(e) => {
          e.preventDefault();
        }}
      />
    </div>
  );
};
