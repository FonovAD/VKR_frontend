import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { organizationsApi, museumsApi, laborApi } from '@/api/client'
import type { Organization } from '@/types/organization'
import type { Museum } from '@/types/museum'
import type { LaborData } from '@/types/labor'

const LABOR_FIELDS: Array<{ key: keyof LaborData; label: string }> = [
  { key: 'total_staff_annual', label: 'Всего сотрудников, шт.' },
  { key: 'research_staff_internal', label: 'Научные сотрудники (внутр.), шт.' },
  { key: 'core_operational_staff_internal', label: 'Ключевые сотрудники (внутр.), шт.' },
  { key: 'admin_support_staff_internal', label: 'Административный персонал (внутр.), шт.' },
  { key: 'research_staff_external', label: 'Научные сотрудники (внеш.), шт.' },
  { key: 'core_operational_staff_external', label: 'Ключевые сотрудники (внеш.), шт.' },
  { key: 'admin_support_staff_external', label: 'Административный персонал (внеш.), шт.' },
]

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

const LABOR_FOT_FIELDS: Array<{ key: keyof NonNullable<LaborData['fot']>; label: string }> = [
  { key: 'total_staff_annual', label: 'ФОТ — всего' },
  { key: 'research_staff_internal', label: 'ФОТ — научные (внутр.)' },
  { key: 'core_operational_staff_internal', label: 'ФОТ — ключевые (внутр.)' },
  { key: 'admin_support_staff_internal', label: 'ФОТ — админ. персонал (внутр.)' },
  { key: 'research_staff_external', label: 'ФОТ — научные (внеш.)' },
  { key: 'core_operational_staff_external', label: 'ФОТ — ключевые (внеш.)' },
  { key: 'admin_support_staff_external', label: 'ФОТ — админ. персонал (внеш.)' },
]

export default function OrganizationDetail() {
  const { id } = useParams<{ id: string }>()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [museums, setMuseums] = useState<Museum[]>([])
  const [labor, setLabor] = useState<LaborData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const loadData = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const orgId = parseInt(id, 10)
      const [orgData, museumsData] = await Promise.all([
        organizationsApi.getById(orgId),
        museumsApi.findByOwner(orgId).catch(() => []),
      ])
      setOrganization(orgData)
      setMuseums(museumsData)

      try {
        const laborData = await laborApi.getByOrganizationId(orgId)
        setLabor(laborData)
      } catch (laborError) {
        console.warn('Labor data not found', laborError)
        setLabor(null)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при загрузке данных')
      console.error('Error loading organization:', err)
    } finally {
      setLoading(false)
    }
  }

  const laborRows = useMemo(() => {
    if (!labor) return []
    return LABOR_FIELDS.map(({ key, label }) => {
      const raw = labor[key]
      const value = raw === null || raw === undefined
        ? '—'
        : typeof raw === 'number'
          ? raw.toLocaleString('ru-RU')
          : String(raw)
      return { label, value }
    })
  }, [labor])

  const laborFotRows = useMemo(() => {
    if (!labor?.fot) return []
    return LABOR_FOT_FIELDS.map(({ key, label }) => {
      const raw = labor.fot?.[key]
      const value = raw === null || raw === undefined
        ? '—'
        : typeof raw === 'number'
          ? raw.toLocaleString('ru-RU')
          : String(raw)
      return { label, value }
    })
  }, [labor])

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

  if (error || !organization) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error || 'Организация не найдена'}</p>
          <Link
            to="/organizations"
            className="mt-2 inline-block text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Вернуться к списку организаций
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/organizations" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          ← Назад к списку организаций
        </Link>
        <Link
          to={`/organizations/${organization.id}/edit`}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
        >
          Редактировать организацию
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{organization.name}</h1>
        <p className="text-sm text-gray-500 mt-1">ID: {organization.id}</p>

        <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">ИНН</dt>
            <dd className="mt-1 text-sm text-gray-900">{organization.inn}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Наличие музея</dt>
            <dd className="mt-1 text-sm text-gray-900">{organization.exist_museum ? 'Да' : 'Нет'}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Музеи организации</h2>
          <Link
            to="/museums/create"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
          >
            Добавить музей
          </Link>
        </div>

        {museums.length === 0 ? (
          <p className="text-gray-500 text-center py-8">У этой организации пока нет музеев</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Название
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    ИНН
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Типы
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Действия</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {museums.map(museum => (
                  <tr key={museum.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      <Link to={`/museums/${museum.id}`} className="text-primary-600 hover:text-primary-900">
                        {museum.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {museum.inn}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-700 whitespace-normal break-words">
                      {formatTypes(museum)}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <div className="flex justify-end gap-2">
                        <Link to={`/museums/${museum.id}`} className="text-primary-600 hover:text-primary-900">
                          Просмотр
                        </Link>
                        <Link to={`/museums/${museum.id}/edit`} className="text-gray-600 hover:text-gray-900">
                          Редактировать
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Трудовые ресурсы</h2>
          {labor && labor.fot && (
            <span className="text-sm text-gray-500">ФОТ включен</span>
          )}
        </div>

        {labor ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {laborRows.map(row => (
              <div key={row.label}>
                <dt className="text-sm font-medium text-gray-500">{row.label}</dt>
                <dd className="mt-1 text-sm text-gray-900">{row.value ?? '—'}</dd>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Данные о трудовых ресурсах недоступны.</p>
        )}

        {labor && laborFotRows.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-2">Фонд оплаты труда</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {laborFotRows.map(row => (
                <div key={row.label}>
                  <dt className="text-sm font-medium text-gray-500">{row.label}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{row.value ?? '—'}</dd>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function formatTypes(museum: Museum) {
  const labels = MUSEUM_TYPE_FIELDS.filter(([key]) => museum[key as MuseumTypeKey])
    .map(([, label]) => label)
  return labels.length > 0 ? labels.join(', ') : 'Тип не указан'
}
