import React, { useState } from 'react';

const TelegramInvites = () => {
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Sample user IDs - replace with your actual user IDs
  const userIds = [
    'ignatiousmunchos' /* ... add all 20 user IDs here */
  ];

  
  // Replace these with your actual Telegram Bot API credentials
  const BOT_TOKEN = '7289349142:AAEnObwRhENGyPkNXXSqzO0txw4NzqSweYc';
  const CHANNEL_ID = '-1002366676830';

  const addUserToChannel = async (userId) => {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/inviteChannelMember`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHANNEL_ID,
          user_id: userId,
        })
      });

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error(`Error inviting user ${userId}:`, error);
      return false;
    }
  };

  const handleInviteUsers = async () => {
    setLoading(true);
    const results = {};

    for (const userId of userIds) {
      const success = await addUserToChannel(userId);
      results[userId] = success;
      setStatus(prev => ({ ...prev, [userId]: success }));
      
      // Adding delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setLoading(false);
    return results;
  };

  return (
    <div className="p-4">
      <button
        onClick={handleInviteUsers}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {loading ? 'Adding Users...' : 'Add Users to Channel'}
      </button>

      {Object.keys(status).length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Invitation Status:</h3>
          <ul className="space-y-2">
            {Object.entries(status).map(([userId, success]) => (
              <li key={userId} className={`flex items-center ${success ? 'text-green-600' : 'text-red-600'}`}>
                <span className="mr-2">{userId}:</span>
                <span>{success ? 'Successfully added' : 'Failed to add'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TelegramInvites;