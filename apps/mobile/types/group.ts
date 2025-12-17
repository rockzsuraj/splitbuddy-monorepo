import { SplitMode } from "../src/Components/GroupSummary"

export interface GroupsRes {
  success: boolean
  message: string
  data: Data
  timestamp: string
}

export interface Data {
  group: Group
}

export interface Group {
  group_id: number
  group_name: string
  description: string
  created_by: number
  group_icon: string
  created_at: string
  split_mode: SplitMode
  members: Member[]
  expenses: Expense[]
  total_expense: string
  settlements: Settlement[]
  balances: Balance[]
  net_balance: string
  recommended_settlements: RecommendedSettlement[]
}

export interface Member {
  group_id: number
  user_id: number
  joined_at: string
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  image_url: string
  role: string
  verified: boolean
  status: string
}

export interface Expense {
  expense_id: number
  group_id: number
  paid_by: number
  amount: number
  description: string
  expense_date: string
  created_at: string
  payer: Payer
}

export interface Payer {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  role: string
  verified: boolean
}

export interface Settlement {
  settlement_id: number
  group_id: number
  from_user: number
  to_user: number
  amount: number
  settled_at: string
  is_paid: boolean
  from_user_details: FromUserDetails
  to_user_details: ToUserDetails
}

export interface FromUserDetails {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  role: string
}

export interface ToUserDetails {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  role: string
}

export interface Balance {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  role: string
  verified: boolean
  status: string
  balance: number
}

export interface RecommendedSettlement {
  from_user_id: number
  to_user_id: number
  amount: number
}
