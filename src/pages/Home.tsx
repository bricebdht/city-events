import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import mockApi from "../lib/mockApi";

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  location_url: string;
}

function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [locationUrl, setLocationUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await mockApi.getActivities();
        setActivities(data);
      } catch (err) {
        console.error("Error fetching activities", err);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    // autofocus
    setTimeout(() => titleRef.current?.focus(), 0);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setLocationUrl("");
  };

  const handleCreate = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!title.trim() || !date.trim()) {
      alert("Please provide at least a title and date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const createdRaw = await mockApi.addActivity({
        title: title.trim(),
        description: description.trim(),
        date,
        location_url: locationUrl.trim(),
      });
      const created = createdRaw as Activity;
      setActivities((prev: Activity[]) =>
        [...prev, created].sort(
          (a: Activity, b: Activity) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
      resetForm();
      closeModal();
    } catch (err) {
      console.error("Failed to create activity", err);
      alert("Failed to create activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Activities</h1>
        <div className="flex items-center gap-3">
          <Link
            to="/map"
            className="bg-white border rounded px-4 py-2 text-gray-700 hover:shadow"
          >
            View Map
          </Link>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={openModal}
          >
            Create Activity
          </button>
        </div>
      </div>

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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Create Activity</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  ref={titleRef}
                  className="mt-1 block w-full border rounded px-2 py-1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  className="mt-1 block w-full border rounded px-2 py-1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full border rounded px-2 py-1"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Location URL
                </label>
                <input
                  className="mt-1 block w-full border rounded px-2 py-1"
                  value={locationUrl}
                  onChange={(e) => setLocationUrl(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded border"
                  onClick={() => {
                    resetForm();
                    closeModal();
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
