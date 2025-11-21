import React from 'react';
import TaskList from '../../Components/adminComponents/TaskList';


export const RegularTasks = () => <TaskList type="tasks" title="Regular Tasks" />;
export const ManualTasks = () => <TaskList type="manualTasks" title="Manual Tasks" />;
export const YoutubeTasks = () => <TaskList type="youtubeTasks" title="YouTube Tasks" />;
export const AdvertTasks = () => <TaskList type="advertTasks" title="Advert Tasks" />;