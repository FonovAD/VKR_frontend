import axios from 'axios'
import type { Organization, CreateOrganizationDTO, UpdateOrganizationDTO } from '@/types/organization'
import type { Museum, CreateMuseumDTO, UpdateMuseumDTO } from '@/types/museum'
import type { Activity, CreateActivityDTO, UpdateActivityDTO } from '@/types/activity'
import type { LaborData } from '@/types/labor'
import {
  transformOrganization,
  transformOrganizationList,
  transformMuseum,
  transformMuseumList,
  transformActivityList,
  transformLabor,
} from './transformers'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Organizations API
export const organizationsApi = {
  getAll: async (): Promise<Organization[]> => {
    const response = await apiClient.get('/organization')
    return transformOrganizationList(response.data)
  },

  getById: async (id: number): Promise<Organization> => {
    const response = await apiClient.get(`/organization/${id}`)
    return transformOrganization(response.data)
  },

  create: async (data: CreateOrganizationDTO): Promise<Organization> => {
    const response = await apiClient.post('/organization', data)
    return transformOrganization(response.data)
  },

  update: async (id: number, data: UpdateOrganizationDTO): Promise<Organization> => {
    const response = await apiClient.put(`/organization/${id}`, data)
    return transformOrganization(response.data)
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/organization/${id}`)
  },

  findByINN: async (inn: string): Promise<Organization> => {
    const response = await apiClient.get(`/organization/search/by-inn?inn=${encodeURIComponent(inn)}`)
    return transformOrganization(response.data)
  },
}

// Museums API
export const museumsApi = {
  getAll: async (): Promise<Museum[]> => {
    const response = await apiClient.get('/museum')
    return transformMuseumList(response.data)
  },

  getById: async (id: number): Promise<Museum> => {
    const response = await apiClient.get(`/museum/${id}`)
    return transformMuseum(response.data)
  },

  create: async (data: CreateMuseumDTO): Promise<Museum> => {
    const response = await apiClient.post('/museum', data)
    return transformMuseum(response.data)
  },

  update: async (id: number, data: UpdateMuseumDTO): Promise<Museum> => {
    const response = await apiClient.put(`/museum/${id}`, data)
    return transformMuseum(response.data)
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/museum/${id}`)
  },

  findByINN: async (inn: string): Promise<Museum> => {
    const response = await apiClient.get(`/museum/search/by-inn?inn=${encodeURIComponent(inn)}`)
    return transformMuseum(response.data)
  },

  findByOwner: async (ownerId: number): Promise<Museum[]> => {
    const response = await apiClient.get(`/museum/owner/${ownerId}`)
    return transformMuseumList(response.data)
  },
}

// Activities API
export const activitiesApi = {
  getAll: async (): Promise<Activity[]> => {
    const response = await apiClient.get('/activity')
    return transformActivityList(response.data)
  },

  getByINN: async (inn: string): Promise<Activity[]> => {
    const response = await apiClient.get(`/activity/search/by-inn?inn=${encodeURIComponent(inn)}`)
    return transformActivityList(response.data)
  },

  getByMuseumId: async (museumId: number): Promise<Activity[]> => {
    const response = await apiClient.get(`/activity/museum/${museumId}`)
    return transformActivityList(response.data)
  },

  create: async (data: CreateActivityDTO): Promise<void> => {
    await apiClient.post('/activity', data)
  },

  update: async (data: UpdateActivityDTO): Promise<void> => {
    await apiClient.put('/activity', data)
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/activity?id=${id}`)
  },
}

// Labor API
export const laborApi = {
  getByOrganizationId: async (organizationId: number): Promise<LaborData> => {
    const response = await apiClient.get(`/labor/organization/${organizationId}`)
    return transformLabor(response.data)
  },

  getByINN: async (inn: string): Promise<LaborData> => {
    const response = await apiClient.get(`/labor/search/by-inn?inn=${encodeURIComponent(inn)}`)
    return transformLabor(response.data)
  },
}

export default apiClient
