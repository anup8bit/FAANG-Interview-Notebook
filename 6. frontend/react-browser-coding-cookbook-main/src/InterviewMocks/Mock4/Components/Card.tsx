import LazyImage from "../../../Components/LazyImage";
import { User } from "./types"

const Card = ({
  userData
}: { userData: User}) => {
  return (
    <div className="user-card-container">
      <header>
        <h3>{userData.login}</h3>
      </header>
      <LazyImage src={userData.avatar_url} alt="alt" />
    </div>
  )
}

export default Card;