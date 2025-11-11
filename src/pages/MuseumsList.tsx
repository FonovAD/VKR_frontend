import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { museumsApi, organizationsApi } from '@/api/client'
import type { Museum } from '@/types/museum'
import type { Organization } from '@/types/organization'

const MUSEUM_TYPE_FIELDS = [
  ['is_memorial_reserve_museum', 'Мемориальный заповедник-музей'],
  ['is_historical_memorial_reserve', 'Историко-мемориальный заповедник'],
  ['is_art_museum', 'Художественный музей'],
  ['is_museum_reserve', 'Музей-заповедник'],
  ['is_estate_museum', 'Усадебный музей'],
  ['is_palace_park_ensemble', 'Дворцово-парковый ансамбль'],
  ['is_historical_architectural_reserve', 'Историко-архитектурный заповедник'],
  ['is_valuable_cultural_heritage', 'Ценное культурное наследие'],
] as const

type MuseumTypeKey = typeof MUSEUM_TYPE_FIELDS[number][0]

type NumericField = {
  key: keyof Pick<Museum, 'annual_visitor_capacity' | 'internal_visitors_count' | 'external_visitors_count' | 'valuable_museum_items_count'>
  label: string
}

const NUMERIC_FIELDS: NumericField[] = [
  { key: 'annual_visitor_capacity', label: 'Емкость посетителей' },
  { key: 'internal_visitors_count', label: 'Внутренние посетители' },
  { key: 'external_visitors_count', label: 'Внешние посетители' },
  { key: 'valuable_museum_items_count', label: 'Ценные музейные предметы' },
]

function formatTypes(museum: Museum) {
  const labels = MUSEUM_TYPE_FIELDS.filter(([key]) => museum[key as MuseumTypeKey])
    .map(([, label]) => label)
  return labels.length > 0 ? labels.join(', ') : 'Тип не указан'
}

function formatNumericStats(museum: Museum) {
  const stats = NUMERIC_FIELDS.map(({ key, label }) => {
    const value = museum[key]
    return value !== null && value !== undefined ? `${label}: ${value.toLocaleString('ru-RU')}` : null
  }).filter(Boolean)

  return stats.length > 0 ? stats.join('\n') : 'Нет данных'
}

export default function MuseumsList() {
  const [museums, setMuseums] = useState<Museum[]>([])
  const [owners, setOwners] = useState<Record<number, Organization>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMuseums()
  }, [])

  const loadOwners = async (items: Museum[]) => {
    const ownerIds = Array.from(new Set(items.map((museum) => museum.id_owner)))
    if (ownerIds.length === 0) {
      setOwners({})
      return
    }

    const entries: Array<[number, Organization]> = []

    await Promise.all(
      ownerIds.map(async (ownerId) => {
        try {
          const organization = await organizationsApi.getById(ownerId)
          entries.push([ownerId, organization])
        } catch (err) {
          console.warn(`Не удалось загрузить данные организации ${ownerId}`, err)
        }
      }),
    )

    const map: Record<number, Organization> = {}
    for (const [id, organization] of entries) {
      map[id] = organization
    }
    setOwners(map)
  }

  const loadMuseums = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await museumsApi.getAll()
      setMuseums(data)
      await loadOwners(data)
    } catch (err: any) {
      setOwners({})
      setError(err.response?.data?.error || 'Ошибка при загрузке музеев')
      console.error('Error loading museums:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот музей?')) {
      return
    }

    try {
      await museumsApi.delete(id)
      const updatedMuseums = museums.filter((museum) => museum.id !== id)
      setMuseums(updatedMuseums)
      await loadOwners(updatedMuseums)
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка при удалении музея')
      console.error('Error deleting museum:', err)
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Загрузка музеев...</p>
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
            onClick={loadMuseums}
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
          <h1 className="text-2xl font-semibold text-gray-900">Музеи</h1>
          <p className="mt-2 text-sm text-gray-700">
            Список всех музеев
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/museums/create"
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            Создать музей
          </Link>
        </div>
      </div>

      {museums.length === 0 ? (
        <div className="mt-8 text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">Музеев пока нет</p>
          <Link
            to="/museums/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Создать первый музей
          </Link>
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-0.5 leading-tight align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-1 leading-tight pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Название
                    </th>
                    <th className="px-3 py-1 leading-tight text-left text-sm font-semibold text-gray-900">
                      Организация
                    </th>
                    <th className="px-3 py-1 leading-tight text-left text-sm font-semibold text-gray-900">
                      КПП
                    </th>
                    <th className="px-3 py-1 leading-tight text-left text-sm font-semibold text-gray-900">
                      Тип музея
                    </th>
                    <th className="px-3 py-1 leading-tight text-left text-sm font-semibold text-gray-900">
                      Показатели
                    </th>
                    <th className="relative py-0.5 leading-tight pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Действия</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {museums.map((museum) => {
                    const typesText = formatTypes(museum)
                    const statsText = formatNumericStats(museum)
                    const owner = owners[museum.id_owner]

                    return (
                      <tr key={museum.id}>
                        <td className="whitespace-nowrap py-0.5 leading-tight pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          <Link to={`/museums/${museum.id}`} className="text-primary-600 hover:text-primary-900">
                            {museum.name}
                          </Link>
                        </td>
                        <td className="px-3 py-0.5 leading-tight text-sm text-gray-700">
                          {owner ? (
                            <div className="space-y-0.5">
                              <Link
                                to={`/organizations/${owner.id}`}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                {owner.name}
                              </Link>
                              <p className="text-xs text-gray-500">ИНН: {owner.inn}</p>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-0.5 leading-tight text-sm text-gray-500">
                          {museum.kpp || '—'}
                        </td>
                        <td className="px-3 py-0.5 leading-tight text-sm text-gray-700 whitespace-normal break-words">
                          {typesText}
                        </td>
                        <td className="px-3 py-0.5 leading-tight text-sm text-gray-700 whitespace-pre-line">
                          {statsText}
                        </td>
                        <td className="relative whitespace-nowrap py-0.5 leading-tight pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/museums/${museum.id}`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Просмотр
                            </Link>
                            <Link
                              to={`/museums/${museum.id}/edit`}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Редактировать
                            </Link>
                            <button
                              onClick={() => handleDelete(museum.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Удалить
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
