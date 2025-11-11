import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { activitiesApi } from '@/api/client'
import type { UpdateActivityDTO, Activity } from '@/types/activity'

interface FormData {
  cost_share_percent?: number | null
  revenue_amount?: number | null
  total_count?: number | null
  state_task_count?: number | null
  revenue_activity_count?: number | null
  year?: number
}

export default function ActivityEdit() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register, handleSubmit, reset } = useForm<FormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activity, setActivity] = useState<Activity | null>(null)
  const [error, setError] = useState<string | null>(null)

  const activityId = parseInt(searchParams.get('id') || '0')

  useEffect(() => {
    if (activityId) {
      loadActivity()
    } else {
      setError('ID активности не указан')
      setLoading(false)
    }
  }, [activityId])

  const loadActivity = async () => {
    try {
      setLoading(true)
      setError(null)
      const activities = await activitiesApi.getAll()
      const found = activities.find(a => a.id === activityId)
      if (found) {
        setActivity(found)
        reset({
          cost_share_percent: found.cost_share_percent || null,
          revenue_amount: found.revenue_amount || null,
          total_count: found.total_count || null,
          state_task_count: found.state_task_count || null,
          revenue_activity_count: found.revenue_activity_count || null,
          year: found.year,
        })
      } else {
        setError('Активность не найдена')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при загрузке активности')
      console.error('Error loading activity:', err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!activityId) return

    try {
      setIsSubmitting(true)
      const dto: UpdateActivityDTO = {
        id: activityId,
        cost_share_percent: data.cost_share_percent || null,
        revenue_amount: data.revenue_amount || null,
        total_count: data.total_count || null,
        state_task_count: data.state_task_count || null,
        revenue_activity_count: data.revenue_activity_count || null,
        year: data.year,
      }
      await activitiesApi.update(dto)
      navigate('/activities')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при обновлении записи о деятельности')
      console.error('Error updating activity:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    )
  }

  if (error || !activity) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error || 'Активность не найдена'}</p>
          <button
            onClick={() => navigate('/activities')}
            className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Вернуться к списку деятельности
          </button>
        </div>
      </div>
    )
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
          <h1 className="text-2xl font-semibold text-gray-900">Редактировать деятельность</h1>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Информация об активности</h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">ИНН</dt>
              <dd className="mt-1 text-sm text-gray-900">{activity.inn}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Тип деятельности</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {activity.custom_activity_name || activity.activity_type_name || 
                 (activity.custom_activity_id ? `Кастомный тип #${activity.custom_activity_id}` : 
                  activity.activity_type_id ? `Тип #${activity.activity_type_id}` : 'Тип не указан')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Категория посетителей</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{activity.visitor_category}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Год</dt>
              <dd className="mt-1 text-sm text-gray-900">{activity.year}</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Год
                </label>
                <input
                  {...register('year', { valueAsNumber: true })}
                  type="number"
                  id="year"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Год"
                />
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
              {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

