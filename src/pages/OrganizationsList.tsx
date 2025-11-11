import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { organizationsApi } from '@/api/client'
import type { Organization } from '@/types/organization'

export default function OrganizationsList() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await organizationsApi.getAll()
      setOrganizations(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при загрузке организаций')
      console.error('Error loading organizations:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту организацию?')) {
      return
    }

    try {
      await organizationsApi.delete(id)
      setOrganizations(organizations.filter(org => org.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка при удалении организации')
      console.error('Error deleting organization:', err)
    }
  }

  if (loading) {
    return (
      <div className="px-2 sm:px-4 lg:px-6 xl:px-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Загрузка организаций...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-2 sm:px-4 lg:px-6 xl:px-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadOrganizations}
            className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-2 sm:px-4 lg:px-6 xl:px-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Организации</h1>
          <p className="mt-2 text-sm text-gray-700">
            Список всех организаций
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/organizations/create"
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            Создать организацию
          </Link>
        </div>
      </div>

      {organizations.length === 0 ? (
        <div className="mt-8 text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">Организаций пока нет</p>
          <Link
            to="/organizations/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Создать первую организацию
          </Link>
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-2 -my-2 overflow-x-auto sm:-mx-4 lg:-mx-6 xl:-mx-12">
            <div className="inline-block min-w-full py-2 align-middle px-2 sm:px-4 lg:px-6">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      ID
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Название
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      ИНН
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Есть музей
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Действия</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {organizations.map((org) => (
                    <tr key={org.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {org.id}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-700 whitespace-normal break-words">
                        {org.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {org.inn}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {org.exist_museum ? 'Да' : 'Нет'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/organizations/${org.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Просмотр
                          </Link>
                          <Link
                            to={`/organizations/${org.id}/edit`}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Редактировать
                          </Link>
                          <button
                            onClick={() => handleDelete(org.id)}
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



