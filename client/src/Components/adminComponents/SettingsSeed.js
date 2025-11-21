import { useState } from "react";
import { useMongoUser } from "../context/mongoContext";

// AdminPanel.jsx or wherever you want to add the seed button
const SettingsSeed = () => {
    const { settings } = useMongoUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
  
    const handleSeedSettings = async () => {
      setLoading(true);
      setError(null);
      setSuccess(false);
  
      try {
        const SERVER_URL = process.env.REACT_APP_SERVER_URL;
        const response = await fetch(`${SERVER_URL}/api/seed-settings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Failed to seed settings');
        }
  
        setSuccess(true);
  
      } catch (err) {
        setError(err.message);
        console.error('Error seeding settings:', err);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <button
        onClick={handleSeedSettings}
        disabled={loading}
        className={`px-4 py-2 rounded ${
          loading 
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {loading ? 'Seeding...' : 'Seed Settings'}
      </button>
    );
  };
  
  export default SettingsSeed;