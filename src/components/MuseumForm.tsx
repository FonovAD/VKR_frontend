import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { CreateMuseumDTO, UpdateMuseumDTO } from '@/types/museum'
import { organizationsApi } from '@/api/client'
import type { Organization } from '@/types/organization'

interface MuseumFormProps {
  initialData?: CreateMuseumDTO | UpdateMuseumDTO
  onSubmit: (data: CreateMuseumDTO | UpdateMuseumDTO) => void
  onCancel?: () => void
  isSubmitting: boolean
  submitLabel?: string
}

export default function MuseumForm({ initialData, onSubmit, onCancel, isSubmitting, submitLabel = 'Сохранить' }: MuseumFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateMuseumDTO | UpdateMuseumDTO>()
  const [organizations, setOrganizations] = useState<Organization[]>([])

  const loadOrganizations = async () => {
    try {
      const orgs = await organizationsApi.getAll()
      setOrganizations(orgs)
    } catch (err) {
      console.error('Error loading organizations:', err)
    }
  }

  useEffect(() => {
    loadOrganizations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Основная информация */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Основная информация</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Название музея *
            </label>
            <input
              {...register('name', { required: 'Название обязательно' })}
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="id_owner" className="block text-sm font-medium text-gray-700 mb-1">
              ID владельца (организация) *
            </label>
            <select
              {...register('id_owner', { required: 'Владелец обязателен', valueAsNumber: true })}
              id="id_owner"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Выберите организацию</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} (ID: {org.id})
                </option>
              ))}
            </select>
            {errors.id_owner && <p className="mt-1 text-sm text-red-600">{errors.id_owner.message}</p>}
          </div>

          <div>
            <label htmlFor="inn" className="block text-sm font-medium text-gray-700 mb-1">
              ИНН *
            </label>
            <input
              {...register('inn', { required: 'ИНН обязателен' })}
              type="text"
              id="inn"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.inn && <p className="mt-1 text-sm text-red-600">{errors.inn.message}</p>}
          </div>

          <div>
            <label htmlFor="kpp" className="block text-sm font-medium text-gray-700 mb-1">
              КПП
            </label>
            <input
              {...register('kpp')}
              type="text"
              id="kpp"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="founder" className="block text-sm font-medium text-gray-700 mb-1">
              Учредитель
            </label>
            <input
              {...register('founder')}
              type="text"
              id="founder"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="museum_legal_status" className="block text-sm font-medium text-gray-700 mb-1">
              Правовой статус
            </label>
            <input
              {...register('museum_legal_status')}
              type="text"
              id="museum_legal_status"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center pt-6">
            <input
              {...register('museum_activity_in_charter')}
              type="checkbox"
              id="museum_activity_in_charter"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="museum_activity_in_charter" className="ml-2 block text-sm text-gray-700">
              Музейная деятельность в уставе
            </label>
          </div>
        </div>
      </div>

      {/* Типы музеев */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Типы музеев</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center">
            <input
              {...register('is_memorial_reserve_museum')}
              type="checkbox"
              id="is_memorial_reserve_museum"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_memorial_reserve_museum" className="ml-2 block text-sm text-gray-700">
              Мемориальный заповедник-музей
            </label>
          </div>
          <div className="flex items-center">
            <input
              {...register('is_historical_memorial_reserve')}
              type="checkbox"
              id="is_historical_memorial_reserve"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_historical_memorial_reserve" className="ml-2 block text-sm text-gray-700">
              Историко-мемориальный заповедник
            </label>
          </div>
          <div className="flex items-center">
            <input
              {...register('is_art_museum')}
              type="checkbox"
              id="is_art_museum"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_art_museum" className="ml-2 block text-sm text-gray-700">
              Художественный музей
            </label>
          </div>
          <div className="flex items-center">
            <input
              {...register('is_museum_reserve')}
              type="checkbox"
              id="is_museum_reserve"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_museum_reserve" className="ml-2 block text-sm text-gray-700">
              Музей-заповедник
            </label>
          </div>
          <div className="flex items-center">
            <input
              {...register('is_estate_museum')}
              type="checkbox"
              id="is_estate_museum"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_estate_museum" className="ml-2 block text-sm text-gray-700">
              Усадебный музей
            </label>
          </div>
          <div className="flex items-center">
            <input
              {...register('is_palace_park_ensemble')}
              type="checkbox"
              id="is_palace_park_ensemble"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_palace_park_ensemble" className="ml-2 block text-sm text-gray-700">
              Дворцово-парковый ансамбль
            </label>
          </div>
          <div className="flex items-center">
            <input
              {...register('is_historical_architectural_reserve')}
              type="checkbox"
              id="is_historical_architectural_reserve"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_historical_architectural_reserve" className="ml-2 block text-sm text-gray-700">
              Историко-архитектурный заповедник
            </label>
          </div>
        </div>
      </div>

      {/* Посетители и наследие */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Посетители и культурное наследие</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="annual_visitor_capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Емкость посетителей в год
            </label>
            <input
              {...register('annual_visitor_capacity', { valueAsNumber: true })}
              type="number"
              id="annual_visitor_capacity"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="internal_visitors_count" className="block text-sm font-medium text-gray-700 mb-1">
              Количество внутренних посетителей
            </label>
            <input
              {...register('internal_visitors_count', { valueAsNumber: true })}
              type="number"
              id="internal_visitors_count"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="external_visitors_count" className="block text-sm font-medium text-gray-700 mb-1">
              Количество внешних посетителей
            </label>
            <input
              {...register('external_visitors_count', { valueAsNumber: true })}
              type="number"
              id="external_visitors_count"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="valuable_museum_items_count" className="block text-sm font-medium text-gray-700 mb-1">
              Количество ценных музейных предметов
            </label>
            <input
              {...register('valuable_museum_items_count', { valueAsNumber: true })}
              type="number"
              id="valuable_museum_items_count"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center">
            <input
              {...register('is_valuable_cultural_heritage')}
              type="checkbox"
              id="is_valuable_cultural_heritage"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_valuable_cultural_heritage" className="ml-2 block text-sm text-gray-700">
              Ценное культурное наследие
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Отмена
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Сохранение...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

