import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { TOKEN } from "@/utils/Constants";
import toast from "react-hot-toast";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  requirements: z.string().optional(),
  due_date: z
    .string()
    .refine((val) => {
      const selectedDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      return !isNaN(selectedDate.getTime()) && selectedDate >= today;
    }, {
      message: "Due date must be today or a future date",
    }),
  max_score: z
    .number({ invalid_type_error: "Max score must be a number" })
    .int()
    .min(0, "Max score must be at least 0"),
});


type TaskFormValues = z.infer<typeof taskSchema>;
interface TaskFormProps {
  subjectId: number;
  onClose: () => void;
  initialData?: TaskFormValues;
}


export default function TaskForm({ subjectId, onClose, initialData }: TaskFormProps) {
  const queryClient = useQueryClient();



  const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData || { max_score: 0 },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: TaskFormValues) => {
      const payload = {
        ...data,
        subject_id: subjectId,
        due_date: new Date(data.due_date).toISOString(),
      };
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", subjectId] });
      toast.success("Task created successfully!");
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create task");
    },
  });


  const onSubmit = (data: TaskFormValues) => createTaskMutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Title</label>
        <input {...register("title")} />
        {errors.title && <p style={{ color: "red" }}>{errors.title.message}</p>}
      </div>

      <div>
        <label>Description</label>
        <textarea {...register("description")} />
        {errors.description && <p style={{ color: "red" }}>{errors.description.message}</p>}
      </div>

      <div>
        <label>Requirements</label>
        <textarea {...register("requirements")} />
        {errors.requirements && <p style={{ color: "red" }}>{errors.requirements.message}</p>}
      </div>

      <div>
        <label>Due Date</label>
        <input type="date" {...register("due_date")} />
        {errors.due_date && <p style={{ color: "red" }}>{errors.due_date.message}</p>}
      </div>

      <div>
        <label>Max Score</label>
        <input type="number"
          {...register("max_score",
            { valueAsNumber: true })}

        />
        {errors.max_score && <p style={{ color: "red" }}>{errors.max_score.message}</p>}
      </div>

      <button type="submit" disabled={createTaskMutation.isLoading}>
        {createTaskMutation.isLoading ? "Saving..." : "Create Task"}
      </button>
    </form>
  );
}
