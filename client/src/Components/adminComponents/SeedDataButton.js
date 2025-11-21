// components/SeedDataButton.js
import React, { useState } from 'react';

const SeedDataButton = ({ onSeedComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSeed = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const SERVER_URL = process.env.REACT_APP_SERVER_URL;
      const response = await fetch(`${SERVER_URL}/api/seed-tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to seed data');
      }

      setSuccess(true);
      if (onSeedComplete) {
        onSeedComplete();
      }
    } catch (err) {
      setError(err.message);
      console.error('Error seeding data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleSeed}
        disabled={loading}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          loading
            ? 'bg-gray-300 cursor-not-allowed'
            : success
            ? 'bg-green-500 text-white'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {loading ? 'Adding Tasks...' : success ? 'Tasks Added!' : 'Add Sample Tasks'}
      </button>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default SeedDataButton;