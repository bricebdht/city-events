import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface Activity {
  id: number
  title: string
  description: string
  date: string
  location_url: string
}

function Home() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from<Activity>('activities')
        .select('id, title, description, date, location_url')
        .order('date', { ascending: true })
      if (!error) {
        setActivities(data)
      } else {
        console.error('Error fetching activities', error)
      }
    }

    fetchActivities()
  }, [])

  return (
    <div className="p-4 space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-1">{activity.title}</h2>
          <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
          <p className="text-sm text-gray-500 mb-2">
            {new Date(activity.date).toLocaleDateString()}
          </p>
          <a
            href={activity.location_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View on Google Maps
          </a>
        </div>
      ))}
    </div>
  )
}

export default Home
