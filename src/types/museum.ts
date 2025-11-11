export interface Museum {
  id: number
  id_owner: number
  inn: string
  kpp?: string | null
  founder?: string | null
  museum_activity_in_charter: boolean
  name: string
  museum_legal_status?: string | null
  is_memorial_reserve_museum: boolean
  is_historical_memorial_reserve: boolean
  is_art_museum: boolean
  is_museum_reserve: boolean
  is_estate_museum: boolean
  is_palace_park_ensemble: boolean
  is_historical_architectural_reserve: boolean
  annual_visitor_capacity?: number | null
  internal_visitors_count?: number | null
  external_visitors_count?: number | null
  is_valuable_cultural_heritage: boolean
  valuable_museum_items_count?: number | null
}

export interface CreateMuseumDTO {
  id_owner: number
  inn: string
  kpp?: string | null
  founder?: string | null
  museum_activity_in_charter: boolean
  name: string
  museum_legal_status?: string | null
  is_memorial_reserve_museum: boolean
  is_historical_memorial_reserve: boolean
  is_art_museum: boolean
  is_museum_reserve: boolean
  is_estate_museum: boolean
  is_palace_park_ensemble: boolean
  is_historical_architectural_reserve: boolean
  annual_visitor_capacity?: number | null
  internal_visitors_count?: number | null
  external_visitors_count?: number | null
  is_valuable_cultural_heritage: boolean
  valuable_museum_items_count?: number | null
}

export interface UpdateMuseumDTO {
  id: number
  id_owner: number
  inn: string
  kpp?: string | null
  founder?: string | null
  museum_activity_in_charter: boolean
  name: string
  museum_legal_status?: string | null
  is_memorial_reserve_museum: boolean
  is_historical_memorial_reserve: boolean
  is_art_museum: boolean
  is_museum_reserve: boolean
  is_estate_museum: boolean
  is_palace_park_ensemble: boolean
  is_historical_architectural_reserve: boolean
  annual_visitor_capacity?: number | null
  internal_visitors_count?: number | null
  external_visitors_count?: number | null
  is_valuable_cultural_heritage: boolean
  valuable_museum_items_count?: number | null
}



