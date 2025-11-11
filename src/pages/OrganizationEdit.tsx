import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { organizationsApi } from '@/api/client'
import type { UpdateOrganizationDTO } from '@/types/organization'

interface FormData {
  inn: string
  name: string
  exist_museum: boolean
}

export default function OrganizationEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadOrganization()
    }
  }, [id])

  const loadOrganization = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const orgId = parseInt(id)
      const org = await organizationsApi.getById(orgId)
      reset({
        inn: org.inn,
        name: org.name,
        exist_museum: org.exist_museum,
      })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при загрузке организации')
      console.error('Error loading organization:', err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!id) return

    try {
      setIsSubmitting(true)
      const orgId = parseInt(id)
      const dto: UpdateOrganizationDTO = {
        inn: data.inn,
        name: data.name,
        exist_museum: data.exist_museum,
      }
      await organizationsApi.update(orgId, dto)
      navigate(`/organizations/${orgId}`)
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при обновлении организации')
      console.error('Error updating organization:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Загрузка организации...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => navigate('/organizations')}
            className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Вернуться к списку организаций
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Редактировать организацию</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Название организации *
                </label>
                <input
                  {...register('name', { required: 'Название обязательно' })}
                  type="text"
                  id="name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Введите название организации"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
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
                  placeholder="Введите ИНН"
                />
                {errors.inn && (
                  <p className="mt-1 text-sm text-red-600">{errors.inn.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  {...register('exist_museum')}
                  type="checkbox"
                  id="exist_museum"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="exist_museum" className="ml-2 block text-sm text-gray-700">
                  Есть музей
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/organizations/${id}`)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



