import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { museumsApi } from '@/api/client'
import MuseumForm from '@/components/MuseumForm'
import type { UpdateMuseumDTO } from '@/types/museum'

export default function MuseumEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [initialData, setInitialData] = useState<UpdateMuseumDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadMuseum()
    }
  }, [id])

  const loadMuseum = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const museumId = parseInt(id)
      const museum = await museumsApi.getById(museumId)
      setInitialData(museum as UpdateMuseumDTO)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при загрузке музея')
      console.error('Error loading museum:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: UpdateMuseumDTO | any) => {
    if (!id) return

    try {
      setIsSubmitting(true)
      const museumId = parseInt(id)
      const dto: UpdateMuseumDTO = {
        id: museumId,
        id_owner: data.id_owner,
        inn: data.inn,
        kpp: data.kpp || null,
        founder: data.founder || null,
        museum_activity_in_charter: data.museum_activity_in_charter || false,
        name: data.name,
        museum_legal_status: data.museum_legal_status || null,
        is_memorial_reserve_museum: data.is_memorial_reserve_museum || false,
        is_historical_memorial_reserve: data.is_historical_memorial_reserve || false,
        is_art_museum: data.is_art_museum || false,
        is_museum_reserve: data.is_museum_reserve || false,
        is_estate_museum: data.is_estate_museum || false,
        is_palace_park_ensemble: data.is_palace_park_ensemble || false,
        is_historical_architectural_reserve: data.is_historical_architectural_reserve || false,
        annual_visitor_capacity: data.annual_visitor_capacity || null,
        internal_visitors_count: data.internal_visitors_count || null,
        external_visitors_count: data.external_visitors_count || null,
        is_valuable_cultural_heritage: data.is_valuable_cultural_heritage || false,
        valuable_museum_items_count: data.valuable_museum_items_count || null,
      }
      await museumsApi.update(museumId, dto)
      navigate(`/museums/${museumId}`)
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при обновлении музея')
      console.error('Error updating museum:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Загрузка музея...</p>
        </div>
      </div>
    )
  }

  if (error || !initialData) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error || 'Музей не найден'}</p>
          <button
            onClick={() => navigate('/museums')}
            className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Вернуться к списку музеев
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Редактировать музей</h1>
        </div>

        <MuseumForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/museums/${id}`)}
          isSubmitting={isSubmitting}
          submitLabel="Сохранить изменения"
        />
      </div>
    </div>
  )
}

