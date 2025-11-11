export interface LaborFOT {
  total_staff_annual?: number | null
  research_staff_internal?: number | null
  core_operational_staff_internal?: number | null
  admin_support_staff_internal?: number | null
  research_staff_external?: number | null
  core_operational_staff_external?: number | null
  admin_support_staff_external?: number | null
}

export interface LaborData {
  total_staff_annual?: number | null
  research_staff_internal?: number | null
  core_operational_staff_internal?: number | null
  admin_support_staff_internal?: number | null
  research_staff_external?: number | null
  core_operational_staff_external?: number | null
  admin_support_staff_external?: number | null
  fot?: LaborFOT
}
