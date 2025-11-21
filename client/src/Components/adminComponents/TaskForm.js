import React from 'react';

// Task Form Component (reusable for add/edit)
const TaskForm = ({ task, type, onSubmit, onCancel }) => {
    const [formData, setFormData] = React.useState(task || {
      id: Date.now(),
      title: '',
      bonusAmount: 0,
      icon: '',
      link: '',
      ...(type === 'tasks' ? { chatId: '' } : {}),
      ...(type === 'youtubeTasks' ? { description: '', thumbnail: '' } : {})
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4 bg-cards p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium pl-1 pb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-[#4b4b4b] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                        required
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium pl-1 pb-1">Bonus Amount</label>
          <input
            type="number"
            value={formData.bonusAmount}
            onChange={(e) => setFormData({ ...formData, bonusAmount: Number(e.target.value) })}
            className="bg-[#4b4b4b] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                        required
          />
        </div>
  
        {type === 'tasks' && (
          <div>
            <label className="block text-sm font-medium pl-1 pb-1">Chat ID</label>
            <input
              type="text"
              value={formData.chatId}
              onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
              className="bg-[#4b4b4b] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                            required
            />
          </div>
        )}
  
        {type === 'youtubeTasks' && (
          <>
            <div>
              <label className="block text-sm font-medium pl-1 pb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-[#4b4b4b] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium pl-1 pb-1">Thumbnail URL</label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="bg-[#4b4b4b] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                                required
              />
            </div>
          </>
        )}
  
        <div>
          <label className="block text-sm font-medium pl-1 pb-1">Icon URL</label>
          <input
            type="url"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="bg-[#4b4b4b] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                      />
        </div>
  
        <div>
          <label className="block text-sm font-medium pl-1 pb-1">Link</label>
          <input
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="bg-[#4b4b4b] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                      />
        </div>
  
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-3 text-sm font-medium text-white bg-btn rounded-md hover:bg-yellow-600"
          >
            Save
          </button>
        </div>
      </form>
    );
  };

export default TaskForm;