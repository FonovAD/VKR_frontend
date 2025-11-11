import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Система управления музеями
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Управление организациями, музеями и их деятельностью
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/organizations"
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Организации
            </h3>
            <p className="text-gray-600 text-sm">
              Управление организациями, которые владеют музеями
            </p>
          </Link>

          <Link
            to="/museums"
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Музеи
            </h3>
            <p className="text-gray-600 text-sm">
              Информация о музеях, их характеристиках и посетителях
            </p>
          </Link>

          <Link
            to="/activities"
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Деятельность
            </h3>
            <p className="text-gray-600 text-sm">
              Учет различных видов деятельности музеев
            </p>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/organizations/create"
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium"
            >
              Создать организацию
            </Link>
            <Link
              to="/museums/create"
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium"
            >
              Создать музей
            </Link>
            <Link
              to="/activities/create"
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium"
            >
              Добавить деятельность
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
