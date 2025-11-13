import type { PaginatedResponse } from '@/types/pagination'

interface PaginationProps {
  pagination: PaginatedResponse<unknown>
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export default function Pagination({ pagination, onPageChange, onPageSizeChange }: PaginationProps) {
  const { page, page_size, total_pages, total_count } = pagination

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (total_pages <= maxVisible) {
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i)
      }
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(total_pages)
      } else if (page >= total_pages - 3) {
        pages.push(1)
        pages.push('...')
        for (let i = total_pages - 4; i <= total_pages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(total_pages)
      }
    }

    return pages
  }

  const startItem = total_count === 0 ? 0 : (page - 1) * page_size + 1
  const endItem = Math.min(page * page_size, total_count)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4 py-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          Показано {startItem}–{endItem} из {total_count}
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm text-gray-700">
            Элементов на странице:
          </label>
          <select
            id="page-size"
            value={page_size}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {total_pages > 0 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Назад
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                    ...
                  </span>
                )
              }

              const pageNumber = pageNum as number
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    pageNumber === page
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === total_pages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  )
}



