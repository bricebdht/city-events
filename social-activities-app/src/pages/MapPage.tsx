import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Adjust path as needed
import { Coffee, Bike, Users, Anchor, Waves, Sparkles, HelpCircle } from 'lucide-react'; // Add more as needed

// It's good practice to move shared components/types to a common directory.
// For this exercise, we'll redefine it as requested.
const ActivityIcon: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  const size = 18; // Consistent icon size
  switch (type.toLowerCase()) {
    case 'apéro':
      return <Coffee size={size} className={className} />;
    case 'yoga':
      return <Sparkles size={size} className={className} />;
    case 'surf':
      return <Waves size={size} className={className} />;
    case 'meetup':
      return <Users size={size} className={className} />;
    case 'sport':
      return <Bike size={size} className={className} />;
    case 'party':
      return <Sparkles size={size} className={className} />;
    default:
      return <HelpCircle size={size} className={className} />;
  }
};

interface Activity {
  id: string;
  title: string;
  description: string; // Keep for potential future use or context
  date: string;
  location_url: string;
  type: string;
  language: string;
  created_by: string;
  // created_at: string; // Not strictly needed for this view
  // city: string; // Not strictly needed for this view
}

const MapPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      // Select only necessary fields for this page
      const { data, error } = await supabase
        .from('activities')
        .select('id, title, location_url, type, date, description, language, created_by') // Added more fields for context
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching activities for map:', error);
        setError(error.message);
      } else if (data) {
        setActivities(data as Activity[]); // Cast if select narrows down fields
      }
      setLoading(false);
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-gray-500">Loading map locations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-500">Error loading map locations: {error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Activities Map</h1>
        <p className="text-center text-gray-500">No activities with locations found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Activities on Map</h1>
      <p className="text-center text-gray-600 mb-8">
        These are direct links to Google Maps for each activity's location.
      </p>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">{activity.title}</h2>
            <p className="text-gray-500 text-sm mb-1 flex items-center">
              <span className="font-semibold mr-2">Type:</span> <ActivityIcon type={activity.type} className="mr-1 text-blue-500" /> {activity.type} | <span className="ml-2 font-semibold mr-2">Language:</span> {activity.language}
            </p>
            <p className="text-gray-500 text-sm mb-3">Date: {new Date(activity.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-gray-700 mb-4 text-sm">{activity.description}</p>
            <a
              href={activity.location_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors duration-300"
            >
              {/* Using a simple map marker icon from Lucide (optional) */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              View Location on Google Maps
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapPage;
