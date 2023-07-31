import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import * as React from 'react';
import styles from './style.module.css';
type Props = {
  title: any;
  deleteNote: () => void;
  saveNote: () => void;
};
const EditorHeader: React.FC<Props> = ({ title, deleteNote, saveNote }) => {
  return (
    <div className={styles.EditorHeader}>
      <span>{title}</span>
      <div>
        <DeleteOutlined onClick={deleteNote} />
        &nbsp;
        <span>
          <SaveOutlined />
          &nbsp;
          <span className={styles.save} onClick={saveNote}>
            保存
          </span>
        </span>
      </div>
    </div>
  );
};

export default EditorHeader;
