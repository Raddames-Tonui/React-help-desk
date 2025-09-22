import type { TaskData, TaskPayload } from '@/context/types';
import React, { useState } from 'react';
import { useTasks } from '@/context/hooks';
import toast from 'react-hot-toast';

interface TaskFormProps {
  initialData?: TaskData;
  subjectId?: number;
  onSuccess?: (task: TaskData) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, subjectId, onSuccess }) => {
  const { createTask } = useTasks();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [requirements, setRequirements] = useState(initialData?.requirements || "");
  const [dueDate, setDueDate] = useState(initialData?.due_date || "");
  const [maxScore, setMaxScore] = useState(initialData?.max_score || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subjectId && !initialData?.subject_id) {
      toast.error("Subject ID is required");
      return;
    }

    const payload: TaskPayload = {
      title,
      description,
      requirements,
      due_date: dueDate,
      max_score: maxScore,
      subject_id: initialData?.subject_id || subjectId!,
    };

    setIsSubmitting(true);
    const newTask = await createTask(payload);
    setIsSubmitting(false);

    if (newTask) {
      onSuccess?.(newTask);
      setTitle("");
      setDescription("");
      setRequirements("");
      setDueDate("");
      setMaxScore(0);
    }
  };

  return (
    <form className="modal-form-group" onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="description">Description</label>
      <textarea
        rows={4}
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="requirements">Requirements</label>
      <textarea
        rows={7}
        required
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
      />

      <label htmlFor="due_date">Due Date</label>
      <input
        type="date"
        required
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <label htmlFor="max_score">Max Score</label>
      <input
        type="number"
        required
        value={maxScore}
        onChange={(e) => setMaxScore(Number(e.target.value))}
      />

      <div  style={{ display: "flex", justifyContent: "end", gap: "1rem" }}>
        <button type="submit" disabled={isSubmitting} className="modal-close-btn">
          {isSubmitting ? "Submitting..." : initialData ? "Update Task" : "Create"}
        </button>
      </div>

    </form>
  );
};

export default TaskForm;
