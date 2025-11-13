import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { organizationsApi } from '@/api/client'
import type { Organization } from '@/types/organization'
import type { PaginatedResponse } from '@/types/pagination'
import Pagination from '@/components/Pagination'

export default function OrganizationsList() {
  const [pagination, setPagination] = useState<PaginatedResponse<Organization> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [nameFilterInput, setNameFilterInput] = useState('')
  const [nameFilter, setNameFilter] = useState('')
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
    loadOrganizations()
  }, [page, pageSize, nameFilter])

  const loadOrganizations = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await organizationsApi.getPaginated({
        page,
        page_size: pageSize,
        name: nameFilter ? nameFilter.toUpperCase() : undefined,
      })
      setPagination(result)
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
      loadOrganizations()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка при удалении организации')
      console.error('Error deleting organization:', err)
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

  const organizations = pagination?.data || []

  return (
    <div className="px-2 sm:px-4 lg:px-6 xl:px-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Организации</h1>
          <p className="mt-2 text-sm text-gray-700">
            Список всех организаций
          </p>
        </div>
      </div>

      <div className="mt-4">
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
      </div>

      {organizations.length === 0 && !loading ? (
        <div className="mt-8 text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">Организаций пока нет</p>
        </div>
      ) : (
        <>
          <div className="mt-8 flow-root">
            <div className="-mx-2 -my-2 sm:-mx-4 lg:-mx-6 xl:-mx-12">
              <div className="inline-block w-full py-2 align-middle px-2 sm:px-4 lg:px-6">
                <table className="w-full divide-y divide-gray-300">
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
                      <tr key={org.id} className="group">
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
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium sm:pr-0">
                          <div className="flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            <Link
                              to={`/organizations/${org.id}`}
                              className="text-primary-600 hover:text-primary-900 whitespace-nowrap"
                            >
                              Просмотр
                            </Link>
                            <Link
                              to={`/organizations/${org.id}/edit`}
                              className="text-gray-600 hover:text-gray-900 whitespace-nowrap"
                            >
                              Редактировать
                            </Link>
                            <button
                              onClick={() => handleDelete(org.id)}
                              className="text-red-600 hover:text-red-900 whitespace-nowrap"
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



