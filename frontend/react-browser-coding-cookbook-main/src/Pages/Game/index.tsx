import { useEffect } from "react"
import ResponsiveLayout from "../../Components/ResponsiveLayout"
import TicTacToe from "../../Components/TicTacToe"

const Game = () => {
  useEffect(() => {
    if (navigator && navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition((val) => console.log(val));
    }
  }, [])
  return (
    <ResponsiveLayout>
      <TicTacToe />
    </ResponsiveLayout>
  )
}

export default Game;