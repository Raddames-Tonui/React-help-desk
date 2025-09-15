import { z } from "zod"

const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

export const ticketSchema = z.object({
    mainCategory: z
        .string()
        .min(4, "Main Category is required"),
    subCategory: z
        .string()
        .min(4, "Sub Category is required"),
    problem: z
        .string()
        .min(4, "Problem/Issue is required"),
    description: z
        .string()
        .min(10, "Description must be at least 10 character long"),
    files: z
        .array(
            z.custom<File>((file) => {
                if (!(file instanceof File)) return false;
                if (!allowedFileTypes.includes(file.type)) return false;
                if (file.size > 2 * 1024 * 1024) return false;
            }, {
                message: "Invalid file. Allowed: .jpg, .jpeg, .png, .pdf (max 2MB)"
            })
        ).max(5, "You can upload at most 5 files"),
});

export type ticketSchemaType = z.infer<typeof ticketSchema>