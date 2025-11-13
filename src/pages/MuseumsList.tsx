import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { museumsApi, organizationsApi } from '@/api/client'
import type { Museum } from '@/types/museum'
import type { Organization } from '@/types/organization'
import type { PaginatedResponse, MuseumType } from '@/types/pagination'
import Pagination from '@/components/Pagination'

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

function formatTypes(museum: Museum) {
  const labels = MUSEUM_TYPE_FIELDS.filter(([key]) => museum[key as MuseumTypeKey])
    .map(([, label]) => label)
  return labels.length > 0 ? labels.join(', ') : 'Тип не указан'
}

const MUSEUM_TYPE_OPTIONS: Array<{ value: MuseumType; label: string }> = [
  { value: 'art', label: 'Художественный музей' },
  { value: 'memorial_reserve', label: 'Мемориальный заповедник-музей' },
  { value: 'historical_memorial_reserve', label: 'Историко-мемориальный заповедник' },
  { value: 'museum_reserve', label: 'Музей-заповедник' },
  { value: 'estate', label: 'Усадебный музей' },
  { value: 'palace_park_ensemble', label: 'Дворцово-парковый ансамбль' },
  { value: 'historical_architectural_reserve', label: 'Историко-архитектурный заповедник' },
]

export default function MuseumsList() {
  const [pagination, setPagination] = useState<PaginatedResponse<Museum> | null>(null)
  const [owners, setOwners] = useState<Record<number, Organization>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [nameFilterInput, setNameFilterInput] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [museumTypeFilter, setMuseumTypeFilter] = useState<MuseumType | ''>('')
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const nameInputRef = useRef<HTMLInputElement | null>(null)

  // Debounce для фильтра по названию
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      // Сохраняем фокус и позицию курсора перед изменением состояния
      const inputElement = nameInputRef.current
      const wasFocused = inputElement && document.activeElement === inputElement
      const cursorPosition = inputElement?.selectionStart || 0
      
      // Преобразуем в верхний регистр перед отправкой на бэкенд
      const upperCaseValue = nameFilterInput.toUpperCase()
      setNameFilter(upperCaseValue)
      setPage(1)
      
      // Восстанавливаем фокус и позицию курсора после ререндера
      if (wasFocused && inputElement) {
        requestAnimationFrame(() => {
          if (nameInputRef.current) {
            nameInputRef.current.focus()
            const newCursorPosition = Math.min(cursorPosition, nameInputRef.current.value.length)
            nameInputRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
          }
        })
      }
    }, 500) // Задержка 500мс

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [nameFilterInput])

  useEffect(() => {
    loadMuseums()
  }, [page, pageSize, nameFilter, museumTypeFilter])

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
      const result = await museumsApi.getPaginated({
        page,
        page_size: pageSize,
        name: nameFilter ? nameFilter.toUpperCase() : undefined,
        museum_type: museumTypeFilter || undefined,
      })
      setPagination(result)
      await loadOwners(result.data)
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
      loadMuseums()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка при удалении музея')
      console.error('Error deleting museum:', err)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
  }

  const handleNameFilterChange = (value: string) => {
    setNameFilterInput(value)
  }

  const handleMuseumTypeFilterChange = (value: string) => {
    setMuseumTypeFilter(value as MuseumType | '')
    setPage(1)
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

  const museums = pagination?.data || []

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Музеи</h1>
          <p className="mt-2 text-sm text-gray-700">
            Список всех музеев
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <div className="max-w-xs">
          <label htmlFor="name-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Фильтр по названию
          </label>
          <input
            ref={nameInputRef}
            id="name-filter"
            type="text"
            value={nameFilterInput}
            onChange={(e) => handleNameFilterChange(e.target.value)}
            placeholder="Введите название..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoComplete="off"
          />
        </div>
        <div className="max-w-xs">
          <label htmlFor="museum-type-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Фильтр по типу музея
          </label>
          <select
            id="museum-type-filter"
            value={museumTypeFilter}
            onChange={(e) => handleMuseumTypeFilterChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Все типы</option>
            {MUSEUM_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {museums.length === 0 && !loading ? (
        <div className="mt-8 text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">Музеев пока нет</p>
        </div>
      ) : (
        <>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
              <div className="inline-block w-full py-0.5 leading-tight align-middle sm:px-6 lg:px-8">
                <table className="w-full divide-y divide-gray-300">
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
                      <th className="relative py-0.5 leading-tight pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Действия</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {museums.map((museum) => {
                      const typesText = formatTypes(museum)
                      const owner = owners[museum.id_owner]

                      // Функция для сокращения названия организации
                      const shortenOrganizationName = (name: string): string => {
                        const quoteIndex = name.indexOf('"')
                        
                        // Если есть кавычки, сокращаем все до кавычки
                        if (quoteIndex > 0) {
                          const beforeQuote = name.substring(0, quoteIndex).trim()
                          const afterQuote = name.substring(quoteIndex)
                          
                          // Разбиваем на слова и берем первые буквы
                          const words = beforeQuote.split(/\s+/).filter(word => word.length > 0)
                          const abbreviation = words.map(word => word[0].toUpperCase()).join('')
                          
                          // Объединяем аббревиатуру с частью после кавычки
                          return abbreviation + ' ' + afterQuote
                        }
                        
                        // Если кавычек нет, возвращаем как есть (или можно обрезать если очень длинное)
                        if (name.length > 80) {
                          return name.substring(0, 77) + '...'
                        }
                        
                        return name
                      }

                      return (
                        <tr key={museum.id} className="group">
                          <td className="py-0.5 leading-tight pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            <Link 
                              to={`/museums/${museum.id}`} 
                              className="text-primary-600 hover:text-primary-900 whitespace-normal break-words max-w-xs block"
                            >
                              {museum.name}
                            </Link>
                          </td>
                          <td className="px-3 py-0.5 leading-tight text-sm text-gray-700">
                            {owner ? (
                              <div className="space-y-0.5">
                                <Link
                                  to={`/organizations/${owner.id}`}
                                  className="text-primary-600 hover:text-primary-900"
                                  title={owner.name}
                                >
                                  {shortenOrganizationName(owner.name)}
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
                          <td className="relative py-0.5 leading-tight pl-3 pr-4 text-sm font-medium sm:pr-0">
                            <div className="flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                              <Link
                                to={`/museums/${museum.id}`}
                                className="text-primary-600 hover:text-primary-900 whitespace-nowrap"
                              >
                                Просмотр
                              </Link>
                              <Link
                                to={`/museums/${museum.id}/edit`}
                                className="text-gray-600 hover:text-gray-900 whitespace-nowrap"
                              >
                                Редактировать
                              </Link>
                              <button
                                onClick={() => handleDelete(museum.id)}
                                className="text-red-600 hover:text-red-900 whitespace-nowrap"
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

          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}
    </div>
  )
}
