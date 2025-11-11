import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { organizationsApi } from '@/api/client'
import type { CreateOrganizationDTO } from '@/types/organization'

interface FormData {
  inn: string
  name: string
  exist_museum: boolean
}

export default function OrganizationCreate() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      const dto: CreateOrganizationDTO = {
        inn: data.inn,
        name: data.name,
        exist_museum: data.exist_museum,
      }
      const created = await organizationsApi.create(dto)
      navigate(`/organizations/${created.id}`)
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при создании организации')
      console.error('Error creating organization:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Создать организацию</h1>

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
              onClick={() => navigate('/organizations')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Создание...' : 'Создать организацию'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



