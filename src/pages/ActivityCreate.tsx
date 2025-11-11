import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { activitiesApi } from '@/api/client'
import type { CreateActivityDTO, VisitorCategory } from '@/types/activity'

interface FormData {
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

export default function ActivityCreate() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      const dto: CreateActivityDTO = {
        inn: data.inn,
        activity_type_id: data.activity_type_id || null,
        custom_activity_id: data.custom_activity_id || null,
        visitor_category: data.visitor_category,
        cost_share_percent: data.cost_share_percent || null,
        revenue_amount: data.revenue_amount || null,
        total_count: data.total_count || null,
        state_task_count: data.state_task_count || null,
        revenue_activity_count: data.revenue_activity_count || null,
        year: data.year,
      }
      await activitiesApi.create(dto)
      navigate('/activities')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при создании записи о деятельности')
      console.error('Error creating activity:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/activities')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4"
          >
            ← Назад к списку деятельности
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Добавить деятельность</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="inn" className="block text-sm font-medium text-gray-700 mb-1">
                  ИНН музея *
                </label>
                <input
                  {...register('inn', { required: 'ИНН обязателен' })}
                  type="text"
                  id="inn"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Введите ИНН музея"
                />
                {errors.inn && (
                  <p className="mt-1 text-sm text-red-600">{errors.inn.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Год *
                </label>
                <input
                  {...register('year', { required: 'Год обязателен', valueAsNumber: true })}
                  type="number"
                  id="year"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Год"
                />
                {errors.year && (
                  <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="activity_type_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Тип деятельности
                </label>
                <input
                  {...register('activity_type_id', { valueAsNumber: true })}
                  type="number"
                  id="activity_type_id"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="ID типа деятельности (опционально)"
                />
              </div>

              <div>
                <label htmlFor="custom_activity_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Кастомный тип деятельности
                </label>
                <input
                  {...register('custom_activity_id', { valueAsNumber: true })}
                  type="number"
                  id="custom_activity_id"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="ID кастомного типа деятельности (опционально)"
                />
              </div>

              <div>
                <label htmlFor="visitor_category" className="block text-sm font-medium text-gray-700 mb-1">
                  Категория посетителей *
                </label>
                <select
                  {...register('visitor_category', { required: 'Категория обязательна' })}
                  id="visitor_category"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Выберите категорию</option>
                  <option value="internal">Внутренние</option>
                  <option value="external">Внешние</option>
                </select>
                {errors.visitor_category && (
                  <p className="mt-1 text-sm text-red-600">{errors.visitor_category.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="total_count" className="block text-sm font-medium text-gray-700 mb-1">
                  Всего
                </label>
                <input
                  {...register('total_count', { valueAsNumber: true })}
                  type="number"
                  id="total_count"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Общее количество"
                />
              </div>

              <div>
                <label htmlFor="state_task_count" className="block text-sm font-medium text-gray-700 mb-1">
                  Количество по госзаданию
                </label>
                <input
                  {...register('state_task_count', { valueAsNumber: true })}
                  type="number"
                  id="state_task_count"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Количество по госзаданию"
                />
              </div>

              <div>
                <label htmlFor="revenue_activity_count" className="block text-sm font-medium text-gray-700 mb-1">
                  Количество платных услуг
                </label>
                <input
                  {...register('revenue_activity_count', { valueAsNumber: true })}
                  type="number"
                  id="revenue_activity_count"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Количество платных услуг"
                />
              </div>

              <div>
                <label htmlFor="revenue_amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Сумма выручки
                </label>
                <input
                  {...register('revenue_amount', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  id="revenue_amount"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Сумма выручки"
                />
              </div>

              <div>
                <label htmlFor="cost_share_percent" className="block text-sm font-medium text-gray-700 mb-1">
                  Процент доли затрат
                </label>
                <input
                  {...register('cost_share_percent', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  id="cost_share_percent"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Процент доли затрат"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/activities')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Создание...' : 'Создать запись'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



