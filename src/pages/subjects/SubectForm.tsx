import { TOKEN } from "@/utils/Constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

const subjectSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;

export default function SubjectForm({ onClose }: { onClose: () => void }) {
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors }, reset } =
        useForm<SubjectFormValues>({
            resolver: zodResolver(subjectSchema),
        });

    const mutation = useMutation({
        mutationFn: async (newSubject: SubjectFormValues) => {
            const res = await fetch("/api/admin/subjects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${TOKEN}`,
                },
                body: JSON.stringify(newSubject),
            });
            if (!res.ok) throw new Error("Failed to create subject");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
            reset();
            onClose();
        },
    });

    const onSubmit = (data: SubjectFormValues) => {
        mutation.mutate(data);
    };

    return (
        <div className="">

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
                    {errors.description && (
                        <p style={{ color: "red" }}>{errors.description.message}</p>
                    )}
                </div>

                <button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Save"}
                </button>

                {mutation.isError && (
                    <p style={{ color: "red" }}>
                        {(mutation.error as Error).message}
                    </p>
                )}
            </form>
        </div>
    );
}
