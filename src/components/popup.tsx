import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { MapPin } from 'lucide-react';

interface PopupProps {
  data: ActivityData;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ data, onClose }) => {
  return (
    <>

      <div className="w-0 h-0 z-0 fixed right-96 top-20
  border-t-[55px] border-t-transparent
  border-r-[70px] border-r-rose-200
  border-b-[55px] border-b-transparent">
      </div>
      <div className='w-96 h-4/5 z-10 fixed top-16 right-12'>
        <Card>
          <CardHeader className='bg-rose-200 p-2 border-b'>
            <div className='flex justify-between'>
              <div className='text-sm'>{data?.iso3_country}</div>
              <button className='text-white border rounded bg-slate-500 px-2' onClick={onClose}>X</button>
            </div>
            <CardTitle className='bold text-md'>{data?.source_name}</CardTitle>
            <div className='flex'>
              <MapPin size={16} strokeWidth={0.5} />
              <span className='text-sm'> {data?.lat} {data?.lon}</span>
            </div>
            <div className='inline-flex'>
              <p className='text-sm bg-orange-300 px-2 py-1 rounded-xl'>{data?.original_inventory_sector}</p>
            </div>
          </CardHeader>
          <CardContent className='w-full p-0'>
            <div className='flex bg-orange-200 w-full border-b border-gray-300 p-2 m-0'>
              <span className='pr-2 text-center'>Source ID: </span>
              <p className='pr-2 text-center'>{data.source_id}</p>
            </div>

            <div className='flex bg-orange-200 w-full border-b border-gray-300 p-2 m-0'>
              <span className='pr-2 text-center'>Source Type: </span>
              <p className='pr-2 text-center'>{data.source_type}</p>
            </div>
            <div className='flex bg-sky-200 w-full border-b border-gray-300 p-2 m-0'>
              <span className='pr-2 text-center'>Emissions: </span>
              <p className='pr-2 text-center'>{data?.emissions_quantity ? data?.emissions_quantity : "N/A"}</p>
              <span>{data?.emissions_factor_units ? data.emissions_factor_units : data?.gas} </span>
            </div>
            <div className='flex bg-green-200 justify-between w-full border-b border-gray-300 p-2 m-0'>
              <span className='pr-2 text-center'>Activity: </span>
              <p className='pr-2 text-center'>{data?.activity ? data?.activity : "N/A"}</p>
              <span>{data?.activity_units ? data?.activity_units : "N/A"}</span>
            </div>
            <div className='flex bg-yellow-200 justify-between w-full border-b border-gray-300 p-2 m-0'>
              <span className='pr-2 text-center'>Capacity: </span>
              <p className='pr-2 text-center'>{data?.capacity ? data?.capacity : "N/A"}</p>
              <span>{!data?.capacity_units ? data?.capacity_units : "N/A"}</span>
              <span>{!data?.capacity_factor ? data?.capacity_factor : "N/A"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default Popup
