export interface Organization {
  id: number
  inn: string
  name: string
  exist_museum: boolean
}

export interface CreateOrganizationDTO {
  inn: string
  name: string
  exist_museum: boolean
}

export interface UpdateOrganizationDTO {
  inn: string
  name: string
  exist_museum: boolean
}



