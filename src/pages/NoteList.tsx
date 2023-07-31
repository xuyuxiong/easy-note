import { useNoteContext } from '@/contexts/NoteContext';
import { ExtendDataNode } from '@/types';
import React, { useEffect, useMemo, useState } from 'react';
import { SearchBar } from '../components/NoteList/SearchBar';
import styles from './App.module.css';

const NoteList: React.FC = () => {
  // states
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedKey, setSelectedKey] = useState<string | number>('');
  const { noteList, setSelectedNote } = useNoteContext();
  // refs
  const searchRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  const filteredNotes = useMemo(() => {
    return noteList.filter((note: ExtendDataNode) => {
      return (note.title as string).includes(searchValue.toLowerCase());
    });
  }, [noteList]);

  const _searchNotes = (val: string) => {
    setSearchValue(val);
  };

  useEffect(() => {
    const item = noteList.find(
      (note: ExtendDataNode) => note.key === selectedKey,
    );
    if (item) {
      setSelectedNote(item)
    } else if (noteList.length){
      setSelectedNote(noteList[0]);
      setSelectedKey(noteList[0].key)
    } else {
      setSelectedNote(null)
    }
  }, [noteList]);
  
  return (
    <div className={styles.noteListWrapper}>
      <SearchBar searchRef={searchRef} searchNotes={_searchNotes} />
      <div>
        {filteredNotes.length
          ? filteredNotes.map((note: ExtendDataNode, index: number) => {
              let noteTitle = note.title;
              if (searchValue) {
                const highlightStart = (noteTitle as string).search(
                  searchValue,
                );

                if (highlightStart !== -1) {
                  const highlightEnd = highlightStart + searchValue.length;

                  noteTitle = (
                    <>
                      {(noteTitle as string).slice(0, highlightStart)}
                      <strong className="highlighted">
                        {(noteTitle as string).slice(
                          highlightStart,
                          highlightEnd,
                        )}
                      </strong>
                      {(noteTitle as string).slice(highlightEnd)}
                    </>
                  );
                } else {
                  return null;
                }
              }

              return (
                <div
                  className={`${
                    note.key === selectedKey ? styles.selected : ''
                  } ${styles.noteItem}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedKey(note.key);
                    setSelectedNote(note.type === 'file' ? note : null);
                  }}
                  key={index}
                >
                  <div className={styles.title}>{noteTitle as string}</div>
                  <div className={styles.content}>
                    {note.content?.replace(/<[^>]+>/g, '')}
                  </div>
                </div>
              );
            })
          : ''}
      </div>
      <div className={styles.count}>总共有{noteList.length | 0}条</div>
    </div>
  );
};

export default NoteList;
