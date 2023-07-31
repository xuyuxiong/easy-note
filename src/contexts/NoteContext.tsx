import { ExtendDataNode } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { getDBData } from '../utils/myDB';

interface NoteContextInterface {
  selectedNote: ExtendDataNode | null;
  setSelectedNote: (note: ExtendDataNode | null) => void;
  noteList: ExtendDataNode[];
  setNoteList: (noteList: ExtendDataNode[]) => void;
  treeData: ExtendDataNode[];
  setTreeData: (treeData: ExtendDataNode[]) => void;
}

const initialContextValue = {
  selectedNote: null,
  setSelectedNote: (note: ExtendDataNode | null) => undefined,
  noteList: [],
  setNoteList: (noteList: ExtendDataNode[]) => undefined,
  treeData: [],
  setTreeData: (treeData: ExtendDataNode[]) => undefined,
};

const NoteContext = createContext<NoteContextInterface>(initialContextValue);

const useNoteContext = () => {
  const context = useContext(NoteContext);

  return context;
};

const NoteProvider = (props: { children: React.ReactNode }) => {
  const [selectedNote, setSelectedNote] = useState<ExtendDataNode | null>(null);
  const [noteList, setNoteList] = useState<ExtendDataNode[]>([]);
  const [treeData, setTreeData] = useState<ExtendDataNode[]>([]);

  const { children } = props;
  const value: NoteContextInterface = {
    selectedNote,
    setSelectedNote,
    noteList,
    setNoteList,
    treeData,
    setTreeData,
  };

  useEffect(() => {
    getDBData('treeData').then((data: ExtendDataNode[]) => {
      setTreeData(data);
    });
  }, []);

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};

const useNoteContext1 = 11;

export { NoteProvider, useNoteContext, useNoteContext1 };
