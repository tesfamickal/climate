import { Button } from "./ui/button";
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-screen h-screen flex justify-center items-center">
        <div className="flex justify-center itmes-center w-8/12 h-3/5 rounded-2xl shadow-2xl text-center">
          <div className="font-serif mb-4 self-center">
            <h1 className="mb-4 text-8xl text-slate-100">Bay Area</h1>
            <p className="mb-4 text-6xl text-slate-300">Climate Data</p>
            <Button asChild className="mb-4 justify-self-center w-20 bg-slate-800">
              <Link to="/map">Go to Map</Link>
            </Button>
          </div>
        </div>
      </div >
    </>
  )
}

export default Home;
