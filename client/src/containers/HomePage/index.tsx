import { Link } from 'react-router-dom'

function HomePage() {
    return (
        <div className="home-page">
            <div className="home-header">
                <h1 className="header">FLICK FINDER</h1>
                <p className="subtext">Discover Your Perfect Movie</p>
                <p className="short-desc">Welcome to Flick Finder, your personalized movie recommendation platform. Our advanced recommendation algorithm brings you the best content tailored to your tastes.</p>
            </div>
            <div className="login-button">
                <Link to={'/preference'}><button className="button-primary">Start exploring now</button></Link>

            </div>
        </div>
    )
}

export default HomePage