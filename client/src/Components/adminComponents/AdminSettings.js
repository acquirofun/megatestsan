import React, { useState, useEffect } from 'react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    tonWallet: '',
    coolDownTime: 0,
    tappingGuru: 0
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/codec-settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch settings');
      }

      setSettings(data.data);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name === 'tonWallet' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${SERVER_URL}/api/settings/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update settings');
      }

      setSuccess(true);
      setSettings(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error updating settings:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading settings...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            TON Wallet Address
          </label>
          <input
            type="text"
            name="tonWallet"
            value={settings.tonWallet}
            onChange={handleChange}
            className="bg-[#4b4b4b] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
            disabled={updating}
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium mb-1">
            Cool Down Time (seconds)
          </label>
          <input
            type="number"
            name="coolDownTime"
            value={settings.coolDownTime}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border rounded"
            disabled={updating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tapping Guru
          </label>
          <input
            type="number"
            name="tappingGuru"
            value={settings.tappingGuru}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border rounded"
            disabled={updating}
          />
        </div> */}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={updating}
            className={`px-4 py-2 rounded ${
              updating 
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {updating ? 'Updating...' : 'Update Settings'}
          </button>

          <button
            type="button"
            onClick={fetchSettings}
            disabled={updating || loading}
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="text-red-500 mt-2">
            Error: {error}
          </div>
        )}

        {success && (
          <div className="text-green-500 mt-2">
            Settings updated successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminSettings;