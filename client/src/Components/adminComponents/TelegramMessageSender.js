import React, { useState } from 'react';
import axios from 'axios';

const BulkMessageSender = () => {
  const [message, setMessage] = useState('');
  const [webAppUrl, setWebAppUrl] = useState('');
  const [buttonTitle, setButtonTitle] = useState('');
  const [includeButtons, setIncludeButtons] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post(`${SERVER_URL}/api/sendBulkMessage`, {
        message,
        webAppUrl: includeButtons ? webAppUrl : undefined,
        buttonTitle: includeButtons ? buttonTitle : undefined,
        includeButtons
      });
      
      setResults(response.data);
      setMessage('');
      if (!includeButtons) {
        setWebAppUrl('');
        setButtonTitle('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send messages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full flex justify-start h-screen'>
    <div className="w-full p-4 sm:max-w-[70%]">
      <h2 className="text-2xl font-bold mb-4">Send Broadcast to Users</h2>
      <form onSubmit={handleSendMessage}>
        <div className="w-full">
          <div className="mb-4">
            <label className="mb-4 flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeButtons}
                onChange={(e) => setIncludeButtons(e.target.checked)}
                className="form-checkbox"
              />
              <span>Include buttons in Broadcast</span>
            </label>
          </div>

          {includeButtons && (
            <div className='w-full flex flex-col space-y-2'>
            <div className="w-full">
              <label className="block mb-2">Web App URL:</label>
              <input
                type="url"
                value={webAppUrl}
                onChange={(e) => setWebAppUrl(e.target.value)}
                placeholder="Enter your web app URL..."
                disabled={loading}
                className="bg-white/25 w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-2"
                required={includeButtons}
              />
            </div>
            <div className="w-full">
              <label className="block mb-2">Button Title:</label>
              <input
                type="text"
                value={buttonTitle}
                onChange={(e) => setButtonTitle(e.target.value)}
                placeholder="Enter button title.."
                disabled={loading}
                className="bg-white/25 w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-2"
                required={includeButtons}
              />
            </div>
            </div>
          )}

          <label className="block mb-2 mt-3">Broadcast Content:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message to send to all users..."
            disabled={loading}
            rows={8}
            className="bg-white/25 w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light border-none outline-none rounded-[10px] flex items-center px-2 pt-3"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !message.trim() || (includeButtons && !webAppUrl.trim())}
          className="px-4 mt-3 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {loading ? 'Sending...' : 'Send to All Users'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {results && (
        <div className="mt-4 p-4 border rounded-[16px] border-purple-400/40 bg-cards">
          <h3 className="font-bold mb-2">Results:</h3>
          <div className="space-y-2">
            <p>Total Users: {results.totalUsers}</p>
            <p className="text-green-600">Successfully Sent: {results.successCount}</p>
            <p className="text-red-600">Failed: {results.failureCount}</p>
            <p className="text-blue-600">
              Estimated Time: {Math.floor(results.estimatedTimeSeconds / 60)} minutes and{' '}
              {results.estimatedTimeSeconds % 60} seconds
            </p>
            {results.failures?.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold mb-2">Failed Messages:</h4>
                <div className="max-h-40 overflow-y-auto">
                  {results.failures.map((failure, index) => (
                    <div key={index} className="text-sm text-red-600">
                      User ID: {failure.telegramId} - {failure.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default BulkMessageSender;