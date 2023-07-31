import React from 'react';
import { useNoteContext } from '@/contexts/NoteContext';
import {
  FileTextOutlined,
  FolderOutlined,
  MoreOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { Popover, Tree } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import { useState } from 'react';
import { AddCategory } from '../components/AppSiderBar/AddCategory';
import AddModal from '../components/AppSiderBar/AddModal';
import { ExtendDataNode, ReactSubmitEvent } from '../types';
import {
  addTreeCategory,
  addTreeItemById,
  deleteTreeItemById,
  getNoteListBySelected,
  updateTreeItemById,
  getExpandedKeysByKey,
  getChildKeys,
} from '../utils/myDB';
import styles from './App.module.css';

const AppSidebar: React.FC = () => {
  // state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentEditItem, setCurrentEditItem] = useState<ExtendDataNode | null>(
    null,
  );
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [addingTempCategory, setAddingTempCategory] = useState<boolean>(false);

  // context
  const { setNoteList, treeData, setTreeData, noteList } = useNoteContext();

  const onAddCategory = () => {
    setAddingTempCategory(true);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <FileTextOutlined />;
      case 'folder':
        return <FolderOutlined />;
      default:
        return <FolderOutlined />;
    }
  };

  const moreActionCons = (note: ExtendDataNode) => [
    {
      isShow: note.type === 'folder',
      title: `${note.level && note.level < 3 ? '新建笔记本' : '新建笔记'}`,
      fn: (item: ExtendDataNode) => {
        setIsEdit(false);
        setIsModalOpen(true);
        setCurrentEditItem(item);
      },
    },
    {
      title: '重命名',
      fn: (item: ExtendDataNode) => {
        setIsEdit(true);
        setCurrentEditItem(item);
        setIsModalOpen(true);
      },
    },
    {
      title: '删除',
      fn: (item: ExtendDataNode) => {
        const keys = getChildKeys(treeData, item.key).concat(item.key);
        const newNoteList = noteList.filter((it) => !keys.includes(it.key));
        setNoteList(JSON.parse(JSON.stringify(newNoteList)));
        const newTreeData = deleteTreeItemById(treeData, item.key as string);
        setTreeData(newTreeData);
      },
    },
  ];

  const moreContent = (note: ExtendDataNode) => {
    return (
      <ul>
        {moreActionCons(note).map((it, index) => {
          if (it.isShow !== false) {
            return (
              <li
                key={index}
                className={styles.actionItem}
                onClick={(e) => {
                  e.stopPropagation();
                  it.fn(note);
                }}
              >
                {it.title}
              </li>
            );
          }
        })}
      </ul>
    );
  };

  const titleRender = (note: any) => {
    return (
      <div>
        {getFileIcon(note.type)}&nbsp;
        <span>{note.title}</span>
        <span className={styles.moreAction}>
          <Popover placement="topRight" content={() => moreContent(note)}>
            <MoreOutlined />
          </Popover>
        </span>
      </div>
    );
  };

  const resetTempCategory = () => {
    setAddingTempCategory(false);
    setCategoryName('');
  };

  const onSubmitNewCategory = (event: ReactSubmitEvent): void => {
    event.preventDefault();
    const newTreeData = addTreeCategory(treeData, categoryName);
    setTreeData(newTreeData);
    resetTempCategory();
  };

  const _setCategoryEdit = (val: string) => {
    setCategoryName(val);
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    setSelectedKeys([info.node.key]);
    setCurrentEditItem(info.node);
    if (selectedKeys.length) {
      const noteList: ExtendDataNode[] = getNoteListBySelected(info.node);
      setNoteList(noteList);
    }
    let newExpandedKeys: (string | number)[] = getExpandedKeysByKey(
      treeData,
      info.node.key,
    );
    if (expandedKeys.indexOf(info.node.key) === -1) {
      newExpandedKeys = newExpandedKeys.concat(info.node.key);
      setExpandedKeys(
        Array.from(
          new Set([...expandedKeys, ...newExpandedKeys, info.node.key]),
        ),
      );
    } else {
      newExpandedKeys = expandedKeys.filter((key) => key !== info.node.key);
      setExpandedKeys(newExpandedKeys);
    }
  };

  const handleModelOpen = (obj: ExtendDataNode) => {
    if (currentEditItem) {
      if (isEdit) {
        const newTreeData = updateTreeItemById(
          treeData,
          currentEditItem.key as string,
          {
            title: obj.title,
          },
        );
        setTreeData(JSON.parse(JSON.stringify(newTreeData)));
      } else {
        const newTreeData = addTreeItemById(
          treeData,
          currentEditItem.key as string,
          obj.title as string,
        );
        setTreeData(JSON.parse(JSON.stringify(newTreeData)));
        // 自动expand
        let newExpandedKeys: (string | number)[] = getExpandedKeysByKey(
          treeData,
          currentEditItem.key,
        );
        if (expandedKeys.indexOf(currentEditItem.key) === -1) {
          newExpandedKeys = newExpandedKeys.concat(currentEditItem.key);
          setExpandedKeys(
            Array.from(
              new Set([
                ...expandedKeys,
                ...newExpandedKeys,
                currentEditItem.key,
              ]),
            ),
          );
        }
      }
      const newCurrentEditItem = { ...currentEditItem, title: obj.title };
      const noteList: ExtendDataNode[] =
        getNoteListBySelected(newCurrentEditItem);
      setNoteList(noteList);
      setIsModalOpen(false);
    }
  };

  const handleModelClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.appSidebar}>
      <div className={styles.addButton} onClick={onAddCategory}>
        <ProfileOutlined /> &nbsp;
        <span>新建笔记本</span>
      </div>
      <Tree
        rootClassName="app-sidebar-tree"
        onSelect={onSelect}
        treeData={treeData}
        selectedKeys={selectedKeys}
        expandedKeys={expandedKeys}
        titleRender={titleRender}
      />
      {addingTempCategory && (
        <AddCategory
          submitHandler={onSubmitNewCategory}
          changeHandler={_setCategoryEdit}
          resetHandler={resetTempCategory}
          tempCategoryName={categoryName}
        />
      )}
      <AddModal
        isEdit={isEdit}
        values={currentEditItem}
        isModalOpen={isModalOpen}
        onModelOpen={handleModelOpen}
        onModelClose={handleModelClose}
      />
    </div>
  );
};

export default AppSidebar;
