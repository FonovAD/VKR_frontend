export interface PaginatedResponse<T> {
  data: T[]
  page: number
  page_size: number
  total_count: number
  total_pages: number
}

export interface PaginationParams {
  page?: number
  page_size?: number
}

export interface OrganizationFilters extends PaginationParams {
  name?: string
}

export type MuseumType =
  | 'art'
  | 'memorial_reserve'
  | 'historical_memorial_reserve'
  | 'museum_reserve'
  | 'estate'
  | 'palace_park_ensemble'
  | 'historical_architectural_reserve'

export interface MuseumFilters extends PaginationParams {
  name?: string
  museum_type?: MuseumType
}

