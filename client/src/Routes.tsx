import { useContext } from 'react'
import { Routes as Router, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import Home from './containers/HomePage'
import Login from './containers/LoginPage'
import PreferencePage from './containers/PreferencePage'
import RecommendationPage from './containers/RecommendationPage'
import MovieDetailsPage from './containers/MovieDetailsPage'

const PrivateRoutes = () => {
    const { authenticated } = useContext(AuthContext)

    if (!authenticated) return <Navigate to='/login' replace />

    return <Outlet />
}

const Routes = () => {
    return (
        <Router>
            {/* <Route path='/login' element={<Login />} /> */}
            <Route path='/' element={<Home />} />
            <Route path='/recommendation' element={<RecommendationPage />} />
            <Route path="/movie/:movieId/:title" element={<MovieDetailsPage />} />
            <Route path='/preference' element={<PreferencePage />} />
            <Route element={<PrivateRoutes />} />
        </Router>
    )
}

export default Routes