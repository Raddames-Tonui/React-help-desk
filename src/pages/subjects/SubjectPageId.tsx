import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Route as SubjectRoute } from "@/routes/_protected/admin/subjects/$subjectId";
import type { SingleSubjectData } from "@/context/types.ts";

import Loader from "@/components/Loader.tsx";
import Modal from "@/components/Modal";
import TaskForm from "@/pages/Tasks/TaskForm";

import { useQuery } from "@tanstack/react-query";
import { TOKEN } from "@/utils/Constants";

import "@/css/userspage.css";
import "@/css/index.css";

async function fetchSubjectById(subjectId: number): Promise<SingleSubjectData> {
    const res = await fetch(`/api/admin/subjects/${subjectId}`, {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        },
    });
    if (!res.ok) throw new Error("Failed to fetch subject");
    return res.json();
}


function SubjectPageId() {
    const { subjectId } = useParams({ from: SubjectRoute.id });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: subjectData, isLoading, isError, error } = useQuery({
        queryKey: ["subject", subjectId],
        queryFn: () => fetchSubjectById(Number(subjectId)),
        enabled: !!subjectId,
    });

    const subject = subjectData?.subject;

    if (isLoading) return <Loader />;
    if (isError) return <div className="subject-error">{(error as Error)?.message}</div>;
    if (!subject) return <div className="subject-empty">No subject data available</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="task-title">Subject Page</h1>
                <button className="button-sec" onClick={() => setIsModalOpen(true)}>
                    Create Task
                </button>
            </div>

            <div className="s-page-container">
                <div className="s-page-details">
                    <h2 className="s-page-title">{subject.name}</h2>
                    <dl>
                        <dt>Description:</dt>
                        <dd>{subject.description}</dd>

                        <dt>Created By:</dt>
                        <dd>{subject.created_by_name}</dd>

                        <dt>Status:</dt>
                        <dd>{subject.is_active ? "Active" : "Inactive"}</dd>

                        <dt>Created At:</dt>
                        <dd>{new Date(subject.created_at).toLocaleString()}</dd>

                        <dt>Updated At:</dt>
                        <dd>{new Date(subject.updated_at).toLocaleString()}</dd>
                    </dl>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                title="Create Task"
                body={<TaskForm
                    subjectId={Number(subjectId)}
                    onClose={() => setIsModalOpen(false)}
                />}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}


export default SubjectPageId;
