import { NoteProvider } from '@/contexts/NoteContext';
import '../../override.scss';
import styles from './App.module.css';
import AppSidebar from './AppSidebar';
import NoteEditor from './NoteEditor';
import NoteList from './NoteList';

export default function HomePage() {
  return (
    <NoteProvider>
      <header className={styles.appHeader}>笔记</header>
      <span className={styles.app}>
        <AppSidebar />
        <NoteList />
        <NoteEditor />
      </span>
    </NoteProvider>
  );
}
