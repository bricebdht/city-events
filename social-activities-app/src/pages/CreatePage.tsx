import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

// Optional: Define a type for the form data, excluding auto-generated fields
interface ActivityFormData {
  title: string;
  description: string;
  date: string;
  location_url: string;
  type: string;
  language: string;
  created_by: string;
  city: string; // Defaulted in DB, but can be explicit
}

const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ActivityFormData>({
    title: '',
    description: '',
    date: '',
    location_url: '',
    type: 'Meetup', // Default value
    language: 'EN',   // Default value
    created_by: '',
    city: 'Florianópolis', // Default value
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // Basic Validation
    if (!formData.title || !formData.date || !formData.location_url || !formData.created_by) {
      setError('Please fill in all required fields: Title, Date, Location URL, and Your Name.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('activities')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            date: formData.date, // Ensure this is a valid ISO 8601 string for TIMESTAMP
            location_url: formData.location_url,
            type: formData.type,
            language: formData.language,
            created_by: formData.created_by,
            city: formData.city,
            // created_at is auto-filled by Supabase
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      setSuccessMessage('Activity created successfully! Redirecting to homepage...');
      setFormData({ // Reset form
        title: '', description: '', date: '', location_url: '',
        type: 'Meetup', language: 'EN', created_by: '', city: 'Florianópolis',
      });
      setTimeout(() => navigate('/'), 2000); // Redirect after a short delay

    } catch (err: any) {
      console.error('Error creating activity:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Create New Activity</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">{error}</div>}
      {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6" role="alert">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Activity Title*</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date and Time*</label>
          <input
            type="datetime-local"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="location_url" className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL*</label>
          <input
            type="url"
            name="location_url"
            id="location_url"
            value={formData.location_url}
            onChange={handleChange}
            required
            placeholder="https://maps.google.com/..."
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option>Apéro</option>
              <option>Yoga</option>
              <option>Surf</option>
              <option>Meetup</option>
              <option>Sport</option>
              <option>Party</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Primary Language</label>
            <select
              name="language"
              id="language"
              value={formData.language}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option>EN</option>
              <option>PT</option>
              <option>FR</option>
              <option>ES</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="created_by" className="block text-sm font-medium text-gray-700 mb-1">Your Name/Pseudo*</label>
          <input
            type="text"
            name="created_by"
            id="created_by"
            value={formData.created_by}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* City is defaulted, could be a hidden input or confirmed if needed */}
        {/* <input type="hidden" name="city" value={formData.city} /> */}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Create Activity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePage;
