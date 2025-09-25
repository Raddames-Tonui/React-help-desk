import { TOKEN } from "@/utils/Constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";


// Schema validation with zod
const subjectSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
    onClose: () => void;
    subject?: SubjectFormValues & { id: number };
}

export default function SubjectForm({ onClose, subject }: SubjectFormProps) {
    const queryClient = useQueryClient();

    // Useform manages state(values, errors, reset )
    const { register, handleSubmit, formState: { errors }, reset } = useForm<SubjectFormValues>({
        resolver: zodResolver(subjectSchema), // integrate Zod validation with react hook form
        defaultValues: subject
            ? { name: subject.name, description: subject.description }
            : undefined,
    });

    const mutation = useMutation({
        mutationFn: async (data: SubjectFormValues) => {
            const method = subject ? "PUT" : "POST";
            const url = subject ? `/api/admin/subjects/${subject.id}` : "/api/admin/subjects";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${TOKEN}`,
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error(`Failed to ${subject ? "update" : "create"} subject`);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] }); // Invalidates the subjects query so table/list updates automatically.
            reset();
            onClose();
            toast.success(`Subject ${subject ? "updated" : "created"} successfully!`);
        },
        onError: (error: any) => {
            toast.error(error.message || "Something went wrong");
        },
    });

    const onSubmit = (data: SubjectFormValues) => mutation.mutate(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    {...register("name")}
                    placeholder="Enter subject name"
                />
                {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
            </div>

            <div>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    {...register("description")}
                    placeholder="Enter description"
                />
                {errors.description && <p style={{ color: "red" }}>{errors.description.message}</p>}
            </div>

            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : subject ? "Update" : "Create"}
            </button>

            {mutation.isError && (
                <p style={{ color: "red" }}>{(mutation.error as Error).message}</p>
            )}
        </form>
    );
}
