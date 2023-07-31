import { useNoteContext } from '@/contexts/NoteContext';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditHeader from '../components/Editor/EditorHeader';
import {
  deleteTreeItemById,
  removeNoteItemById,
  updateNoteItemById,
  updateTreeItemById,
} from '../utils/myDB';

const NoteEditor: React.FC = () => {
  const { selectedNote, treeData, setTreeData, noteList, setNoteList } =
    useNoteContext();
  const [value, setValue] = useState<string | undefined>('');
  const _onChange = (val: string) => {
    setValue(val);
  };

  const _onDeleteNote = () => {
    const newTreeData = deleteTreeItemById(
      treeData,
      selectedNote!.key as string,
    );
    const newNoteList = removeNoteItemById(noteList, selectedNote!.key);
    setNoteList(newNoteList);
    setTreeData(newTreeData);
  };

  const _onSaveNote = () => {
    const newTreeData = updateTreeItemById(treeData, selectedNote!.key, {
      content: value,
    });
    const newNoteList = updateNoteItemById(noteList, selectedNote!.key, {
      content: value,
    });
    setNoteList(newNoteList);
    setTreeData(newTreeData);
  };

  useEffect(() => {
    selectedNote && setValue(selectedNote.content);
  }, [selectedNote]);

  return (
    <div style={{ flex: 1 }}>
      {selectedNote ? (
        <EditHeader
          title={selectedNote?.title}
          deleteNote={_onDeleteNote}
          saveNote={_onSaveNote}
        />
      ) : null}
      {selectedNote ? (
        <ReactQuill
          style={{ flex: 1, height: '75vh' }}
          theme="snow"
          value={value}
          onChange={_onChange}
        />
      ) : null}
    </div>
  );
};

export default NoteEditor;
