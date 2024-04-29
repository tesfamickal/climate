import { Button } from "./ui/button";
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="text-center">
          <h1>Bay Area</h1>
          <p>Climate Data</p>
          <Button asChild>
            <Link to="/map">Go to Map</Link>
          </Button>
        </div>
      </div >
    </>
  )
}

export default Home;
