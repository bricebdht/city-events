import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Adjust path as needed
import { Link } from 'react-router-dom'; // If using for map links, or just <a>
import { Coffee, Bike, Users, Anchor, Waves, Sparkles, HelpCircle } from 'lucide-react'; // Add more as needed

const ActivityIcon: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  const size = 18; // Consistent icon size
  switch (type.toLowerCase()) {
    case 'apéro':
      return <Coffee size={size} className={className} />;
    case 'yoga':
      return <Sparkles size={size} className={className} />; // Example, choose appropriate
    case 'surf':
      return <Waves size={size} className={className} />;
    case 'meetup':
      return <Users size={size} className={className} />;
    case 'sport':
      return <Bike size={size} className={className} />; // Example
    case 'party':
      return <Sparkles size={size} className={className} />; // Example
    default:
      return <HelpCircle size={size} className={className} />;
  }
};

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location_url: string;
  type: string;
  language: string;
  created_by: string;
  created_at: string;
  city: string;
}

const HomePage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: true }); // Show upcoming first

      if (error) {
        console.error('Error fetching activities:', error);
        setError(error.message);
      } else if (data) {
        setActivities(data);
      }
      setLoading(false);
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-gray-500">Loading activities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-500">Error loading activities: {error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Upcoming Activities</h1>
        <p className="text-center text-gray-500">No activities found. Why not <Link to="/create" className="text-blue-500 hover:underline">create one</Link>?</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Upcoming Activities in Florianópolis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-blue-600">{activity.title}</h2>
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">{activity.description}</p>
              <div className="text-sm text-gray-500 mb-3">
                <p><span className="font-semibold">Date:</span> {new Date(activity.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(activity.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="flex items-center"><span className="font-semibold mr-2">Type:</span> <ActivityIcon type={activity.type} className="mr-1 text-blue-500" /> <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">{activity.type}</span></p>
                <p><span className="font-semibold">Language:</span> {activity.language}</p>
                <p><span className="font-semibold">Posted by:</span> {activity.created_by}</p>
              </div>
              <a
                href={activity.location_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors duration-300"
              >
                View on Google Maps
              </a>
            </div>
            <div className="bg-gray-50 px-6 py-3">
                <p className="text-xs text-gray-400">Activity in: {activity.city}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
