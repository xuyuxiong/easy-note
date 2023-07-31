import type { DataNode } from 'antd/es/tree';
export type ReactSubmitEvent =
  | React.FormEvent<HTMLFormElement>
  | React.FocusEvent<HTMLInputElement>;

export type ExtendDataNode = DataNode & {
  type?: string;
  isOpen?: boolean;
  content?: string
  level?: number
};
