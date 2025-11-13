import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import OrganizationsList from './pages/OrganizationsList'
import OrganizationDetail from './pages/OrganizationDetail'
import OrganizationEdit from './pages/OrganizationEdit'
import MuseumsList from './pages/MuseumsList'
import MuseumDetail from './pages/MuseumDetail'
import MuseumEdit from './pages/MuseumEdit'
import ActivitiesList from './pages/ActivitiesList'
import ActivityEdit from './pages/ActivityEdit'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/organizations" element={<OrganizationsList />} />
          <Route path="/organizations/:id/edit" element={<OrganizationEdit />} />
          <Route path="/organizations/:id" element={<OrganizationDetail />} />
          <Route path="/museums" element={<MuseumsList />} />
          <Route path="/museums/:id/edit" element={<MuseumEdit />} />
          <Route path="/museums/:id" element={<MuseumDetail />} />
          <Route path="/activities" element={<ActivitiesList />} />
          <Route path="/activities/edit" element={<ActivityEdit />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
