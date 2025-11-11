import type { Organization } from '@/types/organization'
import type { Museum } from '@/types/museum'
import type { Activity } from '@/types/activity'
import type { LaborData, LaborFOT } from '@/types/labor'

interface BackendOrganization {
  ID: number
  INN: string
  Name: string
  ExistMuseum: boolean
}

interface BackendMuseum {
  Id: number
  IdOwner: number
  INN: string
  KPP?: string | null
  Founder?: string | null
  MuseumActivityInCharter: boolean
  Name: string
  MuseumLegalStatus?: string | null
  IsMemorialReserveMuseum: boolean
  IsHistoricalMemorialReserve: boolean
  IsArtMuseum: boolean
  IsMuseumReserve: boolean
  IsEstateMuseum: boolean
  IsPalaceParkEnsemble: boolean
  IsHistoricalArchitecturalReserve: boolean
  AnnualVisitorCapacity?: number | null
  InternalVisitorsCount?: number | null
  ExternalVisitorsCount?: number | null
  IsValuableCulturalHeritage: boolean
  ValuableMuseumItemsCount?: number | null
}

interface BackendActivity {
  ID?: number
  id?: number
  INN: string
  IDOwner?: number
  id_owner?: number
  ActivityTypeID?: number | null
  activity_type_id?: number | null
  ActivityTypeName?: string | null
  activity_type_name?: string | null
  CustomActivityID?: number | null
  custom_activity_id?: number | null
  CustomActivityName?: string | null
  custom_activity_name?: string | null
  VisitorCategory?: string
  visitor_category?: string
  CostSharePercent?: number | null
  cost_share_percent?: number | null
  RevenueAmount?: number | null
  revenue_amount?: number | null
  TotalCount?: number | null
  total_count?: number | null
  StateTaskCount?: number | null
  state_task_count?: number | null
  RevenueActivityCount?: number | null
  revenue_activity_count?: number | null
  Year?: number
  year?: number
}

interface BackendLabor {
  total_staff_annual?: number | null
  research_staff_internal?: number | null
  core_operational_staff_internal?: number | null
  admin_support_staff_internal?: number | null
  research_staff_external?: number | null
  core_operational_staff_external?: number | null
  admin_support_staff_external?: number | null
  fot?: BackendLaborFOT
}

interface BackendLaborFOT {
  total_staff_annual?: number | null
  research_staff_internal?: number | null
  core_operational_staff_internal?: number | null
  admin_support_staff_internal?: number | null
  research_staff_external?: number | null
  core_operational_staff_external?: number | null
  admin_support_staff_external?: number | null
}

export function transformOrganization(backend: BackendOrganization): Organization {
  return {
    id: backend.ID,
    inn: backend.INN,
    name: backend.Name,
    exist_museum: backend.ExistMuseum,
  }
}

export function transformOrganizationList(backend: BackendOrganization[]): Organization[] {
  return backend.map(transformOrganization)
}

export function transformMuseum(backend: BackendMuseum): Museum {
  return {
    id: backend.Id,
    id_owner: backend.IdOwner,
    inn: backend.INN,
    kpp: backend.KPP ?? null,
    founder: backend.Founder ?? null,
    museum_activity_in_charter: backend.MuseumActivityInCharter,
    name: backend.Name,
    museum_legal_status: backend.MuseumLegalStatus ?? null,
    is_memorial_reserve_museum: backend.IsMemorialReserveMuseum,
    is_historical_memorial_reserve: backend.IsHistoricalMemorialReserve,
    is_art_museum: backend.IsArtMuseum,
    is_museum_reserve: backend.IsMuseumReserve,
    is_estate_museum: backend.IsEstateMuseum,
    is_palace_park_ensemble: backend.IsPalaceParkEnsemble,
    is_historical_architectural_reserve: backend.IsHistoricalArchitecturalReserve,
    annual_visitor_capacity: backend.AnnualVisitorCapacity ?? null,
    internal_visitors_count: backend.InternalVisitorsCount ?? null,
    external_visitors_count: backend.ExternalVisitorsCount ?? null,
    is_valuable_cultural_heritage: backend.IsValuableCulturalHeritage,
    valuable_museum_items_count: backend.ValuableMuseumItemsCount ?? null,
  }
}

export function transformMuseumList(backend: BackendMuseum[]): Museum[] {
  return backend.map(transformMuseum)
}

export function transformActivity(backend: BackendActivity): Activity {
  const visitorCategory =
    (backend.VisitorCategory ?? backend.visitor_category ?? 'internal') as Activity['visitor_category']
  return {
    id: backend.ID ?? backend.id ?? 0,
    inn: backend.INN,
    id_owner: backend.IDOwner ?? backend.id_owner ?? 0,
    activity_type_id: backend.ActivityTypeID ?? backend.activity_type_id ?? null,
    activity_type_name: backend.ActivityTypeName ?? backend.activity_type_name ?? null,
    custom_activity_id: backend.CustomActivityID ?? backend.custom_activity_id ?? null,
    custom_activity_name: backend.CustomActivityName ?? backend.custom_activity_name ?? null,
    visitor_category: visitorCategory,
    cost_share_percent: backend.CostSharePercent ?? backend.cost_share_percent ?? null,
    revenue_amount: backend.RevenueAmount ?? backend.revenue_amount ?? null,
    total_count: backend.TotalCount ?? backend.total_count ?? null,
    state_task_count: backend.StateTaskCount ?? backend.state_task_count ?? null,
    revenue_activity_count: backend.RevenueActivityCount ?? backend.revenue_activity_count ?? null,
    year: backend.Year ?? backend.year ?? 0,
  }
}

export function transformActivityList(backend: BackendActivity[]): Activity[] {
  return backend.map(transformActivity)
}

export function transformLabor(backend: BackendLabor): LaborData {
  return {
    total_staff_annual: backend.total_staff_annual ?? null,
    research_staff_internal: backend.research_staff_internal ?? null,
    core_operational_staff_internal: backend.core_operational_staff_internal ?? null,
    admin_support_staff_internal: backend.admin_support_staff_internal ?? null,
    research_staff_external: backend.research_staff_external ?? null,
    core_operational_staff_external: backend.core_operational_staff_external ?? null,
    admin_support_staff_external: backend.admin_support_staff_external ?? null,
    fot: backend.fot ? transformLaborFOT(backend.fot) : undefined,
  }
}

function transformLaborFOT(backend: BackendLaborFOT): LaborFOT {
  return {
    total_staff_annual: backend.total_staff_annual ?? null,
    research_staff_internal: backend.research_staff_internal ?? null,
    core_operational_staff_internal: backend.core_operational_staff_internal ?? null,
    admin_support_staff_internal: backend.admin_support_staff_internal ?? null,
    research_staff_external: backend.research_staff_external ?? null,
    core_operational_staff_external: backend.core_operational_staff_external ?? null,
    admin_support_staff_external: backend.admin_support_staff_external ?? null,
  }
}
