import { ExtendDataNode } from '@/types';
import type { DataNode } from 'antd/es/tree';
import { v4 as uuid } from 'uuid';

export default class IndexedDBService {
  private db!: IDBDatabase;

  constructor(private dbName: string, private storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.open();
  }

  public async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) resolve();
      const request = window.indexedDB.open(this.dbName);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        this.db = request.result;
        this.db.createObjectStore(this.storeName);
      };
    });
  }

  public async put(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value, key);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  public async get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public async delete(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onerror = (event: any) => {
        reject(`Delete error: ${event.target.error}`);
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  public close(): void {
    this.db.close();
  }
}

const dbService = new IndexedDBService('my-db', 'my-store');
export async function getDBData(key: string) {
  await dbService.open();
  const data = await dbService.get(key);
  return data;
}

export async function setDBData(key: string, val: any) {
  await dbService.open();
  await dbService.put(key, val);
}

export function addTreeCategory(treeData: DataNode[], title: string) {
  const category: ExtendDataNode = {
    key: uuid(),
    title,
    type: 'folder',
    level: 1,
    children: [],
  };
  const newCategory = [...treeData, category];
  setDBData('treeData', newCategory);
  return newCategory;
}

export function addTreeItemById(
  treeData: ExtendDataNode[],
  key: string,
  name: string,
) {
  treeData.forEach((item) => {
    if (item.key === key) {
      const newItem: ExtendDataNode = {
        key: uuid(),
        title: name.trim(),
        type: `${item.level && item.level > 2 ? 'file' : 'folder'}`,
        level: item.level ? item.level + 1 : 1,
        children: [],
      };
      item.children?.push(newItem);
    } else if (item.children && item.children.length) {
      addTreeItemById(item.children as ExtendDataNode[], key, name);
    }
  });
  setDBData('treeData', treeData);
  return treeData;
}

export function updateTreeItemById(
  treeData: ExtendDataNode[],
  key: string | number,
  updateCon: object,
) {
  treeData.forEach((item, index) => {
    if (item.key === key) {
      treeData[index] = { ...item, ...updateCon };
    } else if (item.children && item.children.length) {
      updateTreeItemById(item.children as ExtendDataNode[], key, updateCon);
    }
  });
  setDBData('treeData', treeData);
  return treeData;
}

export function deleteTreeItemById(treeData: DataNode[], key: string) {
  function filterData(treeData: DataNode[], key: string) {
    const newData = treeData.filter(item => {
      if (item.children) {
        item.children = filterData(item.children, key)
      }
      if (item.key !== key) {
        return true;
      }
      return false
    });
    return newData;
  }
  const result = filterData(treeData, key);
  setDBData('treeData', result);
  return result;
}

export function getNoteListBySelected(
  note: ExtendDataNode,
  result: ExtendDataNode[] = [],
) {
  if (note.type === 'file') {
    return [note]
  }
  if (note?.type !== 'file') {
    note?.children?.forEach((child: ExtendDataNode) => {
      if (child.type === 'file') {
        result.push(child)
      }
      getNoteListBySelected(child, result);
    });
  }
  return result;
}

export function removeNoteItemById(
  noteList: ExtendDataNode[],
  key: string | number,
) {
  return noteList.filter((it) => it.key !== key);
}

export function updateNoteItemById(
  noteList: ExtendDataNode[],
  key: string | number,
  updateCon: object,
) {
  noteList.forEach((item, index) => {
    if (item.key === key) {
      noteList[index] = { ...item, ...updateCon };
    }
  });
  return JSON.parse(JSON.stringify(noteList));
}

export function getExpandedKeysByKey(
  noteList: ExtendDataNode[],
  key: string | number) {
    const allNotes = getAllNotes(noteList, [])
    const extendKes = getParentKeysByKey(allNotes, key)
    return extendKes
  }

const getAllNotes = function(noteList: ExtendDataNode[], result: ExtendDataNode[]) {
  noteList.forEach(it => {
    result.push(it)
    getAllNotes((it.children) as ExtendDataNode[], result)
  })
  return result
}

const getParentKeysByKey = (noteList: ExtendDataNode[], key: string | number, resultKeys: (string | number)[] = []) => {
  const item = noteList.find(it => {
    const keys: any = it.children?.map(it => it.key)
    return keys.includes(key)
  })
  if (item) {
    resultKeys.push(item.key)
    getParentKeysByKey(noteList, item.key, resultKeys)
  }
  return resultKeys
}

const getChildKeysByKey = (note: ExtendDataNode | undefined, resultKeys: (string | number)[] = []) => {
  if (note) {
    note.children?.forEach(it => {
      resultKeys.push(it.key)
      getChildKeysByKey(it, resultKeys)
    })
  }
  return resultKeys
}

export const getChildKeys = (noteList: ExtendDataNode[], key: string | number) => {
  const allNotes = getAllNotes(noteList, [])
  const item: ExtendDataNode | undefined = allNotes.find(it => it.key === key)
  if (item) {
    return getChildKeysByKey(item, [])
  } else {
    return []
  }
}