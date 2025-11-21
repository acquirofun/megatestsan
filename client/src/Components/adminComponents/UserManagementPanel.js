import React, { useState, useEffect } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiCheck, FiX, FiUser } from 'react-icons/fi';
import { TfiWallet } from "react-icons/tfi";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [walletUsers, setWalletUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState('top');

  const SERVER_URL = process.env.REACT_APP_SERVER_URL;


  const fetchTopUsers = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/users/top`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletUsers = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/users/with-wallets`);
      const data = await response.json();
      if (data.success) {
        setWalletUsers(data.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${SERVER_URL}/api/users/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (telegramId, updatedData) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/users/${telegramId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map(user => 
          user.telegramId === telegramId ? data.data : user
        ));
        setEditingUser(null);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (telegramId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${SERVER_URL}/api/users/${telegramId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter(user => user.telegramId !== telegramId));
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (activeTab === 'top') {
      fetchTopUsers();
    } else if (activeTab === 'wallet') {
      fetchWalletUsers();
    }
    // eslint-disable-next-line
  }, [activeTab]);

  const UserCard = ({ user }) => {
    const isEditing = editingUser?.telegramId === user.telegramId;
    const [formData, setFormData] = useState({
      balance: user.balance,
      miningTotal: user.miningTotal,
      miningPower: user.miningPower,
      taskPoints: user.taskPoints
    });

    const StatItem = ({ label, value, isEditing, onChange }) => (
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{label}</span>
        {isEditing ? (
          <input
            type="number"
            value={value}
            onChange={onChange}
            className="bg-[#4b4b4b] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                  />
        ) : (
          <span className="font-medium">{value}</span>
        )}
      </div>
    );

    return (
      <div className="bg-[#282828] rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-lg">
              {user.username || `User${user.telegramId.substr(-4)}`}
            </h3>
            <p className="text-sm">ID: {user.telegramId}</p>
            {user.walletAddress && (
              <p className="text-sm truncate max-w-xs">
                Wallet: {user.walletAddress}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleUpdate(user.telegramId, formData)}
                  className="p-2 text-green-600 hover:text-green-800"
                >
                  <FiCheck className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditingUser(user)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(user.telegramId)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatItem
            label="Balance"
            value={isEditing ? formData.balance : user.balance}
            isEditing={isEditing}
            onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
          />
          <StatItem
            label="Mining Total"
            value={isEditing ? formData.miningTotal : user.miningTotal}
            isEditing={isEditing}
            onChange={(e) => setFormData({ ...formData, miningTotal: Number(e.target.value) })}
          />
          <StatItem
            label="Mining Power"
            value={isEditing ? formData.miningPower : user.miningPower}
            isEditing={isEditing}
            onChange={(e) => setFormData({ ...formData, miningPower: Number(e.target.value) })}
          />
          <StatItem
            label="Task Points"
            value={isEditing ? formData.taskPoints : user.taskPoints}
            isEditing={isEditing}
            onChange={(e) => setFormData({ ...formData, taskPoints: Number(e.target.value) })}
          />
        </div>
      </div>
    );
  };

  return (
    <div id='refer' className="w-full flex flex-col space-y-4 h-[100vh] scroller pt-4 overflow-y-auto pb-[150px]">

      <div className="w-full">
        <div className="mb-8 space-y-4">
          {/* Tabs */}
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => setActiveTab('top')}
              className={`flex w-[47%] text-[14px] justify-center items-center px-4 py-3 rounded-lg ${
                activeTab === 'top'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiUser className="w-5 h-5 mr-2" />
              Top Users
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex w-[47%] text-[14px] justify-center items-center px-4 py-3 rounded-lg ${
                activeTab === 'wallet'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TfiWallet className="w-5 h-5 mr-2" />
              Airdrop List
            </button>
          </div>

          {/* Search */}
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by username or Telegram ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#4b4b4b] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                />
              <button
                onClick={searchUsers}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white hover:text-yellow-500"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-cards rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'top' ? users : walletUsers).map(user => (
              <UserCard key={user.telegramId} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;