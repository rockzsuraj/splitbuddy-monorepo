
export type TransactionsType = TransactionType[]

export interface TransactionType {
  id: string;
  userName: string;
  transactionsType: 'debit' | 'credit';
  amount: number;
  timestamp: TimestampType;
  description: string;
  transactionName: string;
}

export interface TimestampType {
  seconds: number
  nanoseconds: number
}

export type values = {
  name: string;
  amount: string;
  description: string;
  type?: 'debit' | 'credit';
}


export interface Asset {
  height: number;
  width: number;
  base64: string;
  type: string;
  fileName: string;
  fileSize: number;
  uri: string;
}

export interface AssetsTypes {
  assets: Asset[];
}

export interface userData {
  name: string;
  email: string;
  password: string;
}

export interface Groups {
  group_id: string;
  groupMember: GroupMember[];
  description: string;
  members: string[];
  group_name: string;
  createdAt?: CreatedAt;
  admin: string;
  group_icon: string;
  transactions: TransactionType;
  totalIncome: number;
  totalExpense: number;
  currentUserTotalIncome: number;
  currentUserTotalExpense: number;
}

export interface CreatedAt {
  seconds: number;
  nanoseconds: number;
}

export interface GroupMember {
  name: string;
  id: string;
  photoUrl: string;
}