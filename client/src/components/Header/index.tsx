import { Link } from "react-router-dom"

function Header() {
  return (
    <div className="top-header">
      <Link to={'/recommendation'}>
        <h1 className="title">FLICK FINDER</h1>
      </Link>
      <Link to={'/preference'}>
        <p className="user-profile">Change Genre Preference</p>
      </Link>
      {/* <div className="user-profile">User</div> */}
    </div>
  )
}

export default Header