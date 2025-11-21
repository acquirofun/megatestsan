import React from 'react';
import { Link } from 'react-router-dom';
import { FiGrid, FiEdit3, FiYoutube, FiRadio } from 'react-icons/fi';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex space-x-8">
              <Link to="/tasks" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                <FiGrid className="mr-2" /> Regular Tasks
              </Link>
              <Link to="/manual-tasks" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                <FiEdit3 className="mr-2" /> Manual Tasks
              </Link>
              <Link to="/youtube-tasks" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                <FiYoutube className="mr-2" /> YouTube Tasks
              </Link>
              <Link to="/advert-tasks" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                <FiRadio className="mr-2" /> Advert Tasks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <main className="max-w-7xl mx-auto py-6 px-4">
      {children}
    </main>
  </div>
);

export default Layout;