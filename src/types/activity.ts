export type VisitorCategory = 'internal' | 'external'

export interface Activity {
  id: number
  inn: string
  id_owner: number
  activity_type_id?: number | null
  activity_type_name?: string | null
  custom_activity_id?: number | null
  custom_activity_name?: string | null
  visitor_category: VisitorCategory
  cost_share_percent?: number | null
  revenue_amount?: number | null
  total_count?: number | null
  state_task_count?: number | null
  revenue_activity_count?: number | null
  year: number
}

export interface CreateActivityDTO {
  inn: string
  activity_type_id?: number | null
  custom_activity_id?: number | null
  visitor_category: VisitorCategory
  cost_share_percent?: number | null
  revenue_amount?: number | null
  total_count?: number | null
  state_task_count?: number | null
  revenue_activity_count?: number | null
  year: number
}

export interface UpdateActivityDTO {
  id: number
  cost_share_percent?: number | null
  revenue_amount?: number | null
  total_count?: number | null
  state_task_count?: number | null
  revenue_activity_count?: number | null
  year?: number
}



