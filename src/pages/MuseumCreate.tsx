import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { museumsApi } from '@/api/client'
import MuseumForm from '@/components/MuseumForm'
import type { CreateMuseumDTO } from '@/types/museum'

export default function MuseumCreate() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: CreateMuseumDTO | any) => {
    try {
      setIsSubmitting(true)
      const dto: CreateMuseumDTO = {
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
      const created = await museumsApi.create(dto)
      navigate(`/museums/${created.id}`)
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при создании музея')
      console.error('Error creating museum:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Создать музей</h1>
        </div>

        <MuseumForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/museums')}
          isSubmitting={isSubmitting}
          submitLabel="Создать музей"
        />
      </div>
    </div>
  )
}

