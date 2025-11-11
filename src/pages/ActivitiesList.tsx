import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { activitiesApi, organizationsApi } from '@/api/client'
import type { Activity } from '@/types/activity'
import type { Organization } from '@/types/organization'

export default function ActivitiesList() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [owners, setOwners] = useState<Record<number, Organization>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await activitiesApi.getAll()
      setActivities(data)
      await loadOwners(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при загрузке деятельности')
      console.error('Error loading activities:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadOwners = async (items: Activity[]) => {
    const ownerIds = Array.from(new Set(items.map((activity) => activity.id_owner).filter(Boolean)))
    if (ownerIds.length === 0) {
      setOwners({})
      return
    }

    const entries: Array<[number, Organization]> = []
    await Promise.all(
      ownerIds.map(async (id) => {
        try {
          const organization = await organizationsApi.getById(id)
          entries.push([id, organization])
        } catch (err) {
          console.warn(`Не удалось получить организацию ${id}`, err)
        }
      }),
    )

    const map: Record<number, Organization> = {}
    for (const [id, org] of entries) {
      map[id] = org
    }
    setOwners(map)
  }

  const handleDelete = async (activity: Activity) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись о деятельности?')) {
      return
    }

    try {
      await activitiesApi.delete(activity.id)
      const updated = activities.filter(a => a.id !== activity.id)
      setActivities(updated)
      await loadOwners(updated)
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка при удалении деятельности')
      console.error('Error deleting activity:', err)
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Загрузка деятельности...</p>
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
            onClick={loadActivities}
            className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Деятельность музеев</h1>
          <p className="mt-2 text-sm text-gray-700">
            Список всех записей о деятельности музеев
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/activities/create"
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            Добавить деятельность
          </Link>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="mt-8 text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">Записей о деятельности пока нет</p>
          <Link
            to="/activities/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Добавить первую запись
          </Link>
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Организация
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      ИНН
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Год
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[200px] max-w-[300px]">
                      Тип деятельности
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Категория посетителей
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Всего
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Выручка
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Действия</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {owners[activity.id_owner] ? (
                          <Link
                            to={`/organizations/${owners[activity.id_owner].id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            {owners[activity.id_owner].name}
                          </Link>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {activity.inn}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {activity.year}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-700 whitespace-normal break-words max-w-[300px]">
                        <div className="leading-relaxed">
                          {activity.custom_activity_name || activity.activity_type_name || 
                           (activity.custom_activity_id ? `Кастомный тип #${activity.custom_activity_id}` : 
                            activity.activity_type_id ? `Тип #${activity.activity_type_id}` : 'Тип не указан')}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {activity.visitor_category}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {activity.total_count || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {activity.revenue_amount || '-'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/activities/edit?id=${activity.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Редактировать
                          </Link>
                          <button
                            onClick={() => handleDelete(activity)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

