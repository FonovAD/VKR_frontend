import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useParams, Link } from 'react-router-dom'
import { museumsApi, activitiesApi, organizationsApi } from '@/api/client'
import type { Museum } from '@/types/museum'
import type { Activity } from '@/types/activity'
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

const NUMERIC_FIELDS: Array<{ key: keyof Museum; label: string }> = [
  { key: 'annual_visitor_capacity', label: 'Емкость посетителей' },
  { key: 'internal_visitors_count', label: 'Внутренние посетители' },
  { key: 'external_visitors_count', label: 'Внешние посетители' },
  { key: 'valuable_museum_items_count', label: 'Ценные музейные предметы' },
]

const VISITOR_CATEGORY_LABELS: Record<Activity['visitor_category'], string> = {
  internal: 'Внутренние посетители',
  external: 'Внешние посетители',
}

export default function MuseumDetail() {
  const { id } = useParams<{ id: string }>()
  const [museum, setMuseum] = useState<Museum | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
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
      const museumId = Number(id)
      const museumData = await museumsApi.getById(museumId)
      setMuseum(museumData)

      // Загружаем организацию-владельца для получения ИНН
      try {
        const orgData = await organizationsApi.getById(museumData.id_owner)
        setOrganization(orgData)
      } catch (orgError) {
        console.warn('Organization not found', orgError)
      }

      // Загружаем активности по ID музея
      try {
        const activitiesData = await activitiesApi.getByMuseumId(museumId)
        setActivities(activitiesData)
      } catch (activityError) {
        console.warn('Activities not found', activityError)
        setActivities([])
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при загрузке данных')
      console.error('Error loading museum:', err)
    } finally {
      setLoading(false)
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

  if (error || !museum) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error || 'Музей не найден'}</p>
          <Link to="/museums" className="mt-2 inline-block text-red-600 hover:text-red-700 text-sm font-medium">
            Вернуться к списку музеев
          </Link>
        </div>
      </div>
    )
  }

  const typeLabels = formatTypes(museum)
  const statsList = formatNumericStats(museum)

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/museums" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          ← Назад к списку музеев
        </Link>
        <Link
          to={`/museums/${museum.id}/edit`}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
        >
          Редактировать музей
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-gray-900">{museum.name}</h1>
          <p className="text-sm text-gray-500 mt-1">ID музея: {museum.id}</p>
        </header>

        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Основная информация</h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <InfoItem label="ИНН" value={organization?.inn || museum.inn || '—'} />
            <InfoItem label="КПП" value={museum.kpp || '—'} />
            <InfoItem label="Учредитель" value={museum.founder || '—'} />
            <InfoItem 
              label="Организация-владелец" 
              value={organization ? (
                <Link to={`/organizations/${organization.id}`} className="text-primary-600 hover:text-primary-900">
                  {organization.name}
                </Link>
              ) : museum.id_owner} 
            />
            <InfoItem label="Правовой статус" value={museum.museum_legal_status || '—'} />
            <InfoItem label="Музейная деятельность в уставе" value={museum.museum_activity_in_charter ? 'Да' : 'Нет'} />
          </dl>
        </section>

        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Типы музея</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">{typeLabels.join('\n')}</p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Показатели</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">{statsList.join('\n')}</p>
        </section>
      </div>

      <div className="mt-6 bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Деятельность</h2>
        </div>

        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Информация о деятельности отсутствует.</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {activity.custom_activity_name || activity.activity_type_name || 
                       (activity.custom_activity_id ? `Кастомный тип #${activity.custom_activity_id}` : 
                        activity.activity_type_id ? `Тип #${activity.activity_type_id}` : 'Тип не указан')}
                    </h3>
                    <p className="text-sm text-gray-500">Год: {activity.year}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                    {formatVisitorCategory(activity.visitor_category)}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ActivityInfo label="Всего посетителей" value={formatNumber(activity.total_count)} />
                  <ActivityInfo label="По госзаданию" value={formatNumber(activity.state_task_count)} />
                  <ActivityInfo label="Платные мероприятия" value={formatNumber(activity.revenue_activity_count)} />
                  <ActivityInfo label="Доля затрат" value={formatPercent(activity.cost_share_percent)} />
                  <ActivityInfo label="Выручка" value={formatCurrency(activity.revenue_amount)} />
                </dl>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function formatTypes(museum: Museum) {
  const labels = MUSEUM_TYPE_FIELDS.filter(([key]) => museum[key as MuseumTypeKey])
    .map(([, label]) => label)
  return labels.length > 0 ? labels : ['Тип не указан']
}

function formatNumericStats(museum: Museum) {
  return NUMERIC_FIELDS.map(({ key, label }) => {
    const rawValue = museum[key]
    if (rawValue === null || rawValue === undefined) {
      return `${label}: —`
    }
    const formatted = typeof rawValue === 'number' ? rawValue.toLocaleString('ru-RU') : rawValue
    return `${label}: ${formatted}`
  })
}

interface InfoItemProps {
  label: string
  value: ReactNode
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  )
}

interface ActivityInfoProps {
  label: string
  value: string
}

function ActivityInfo({ label, value }: ActivityInfoProps) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  )
}

function formatVisitorCategory(category: Activity['visitor_category']) {
  return VISITOR_CATEGORY_LABELS[category] ?? category
}

function formatNumber(value?: number | null) {
  return value === null || value === undefined ? '—' : value.toLocaleString('ru-RU')
}

function formatPercent(value?: number | null) {
  if (value === null || value === undefined) return '—'
  return `${value.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}%`
}

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined) return '—'
  return `${value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })}`
}
