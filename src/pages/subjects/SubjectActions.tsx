import React, { useState } from "react";
import Modal from "@/components/Modal";
import Icon from "@/utils/Icon";
import type { SubjectData } from "@/context/types";
import SubjectForm from "./SubjectForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TOKEN } from "@/utils/Constants";
import { Route } from "@/routes/_protected/admin/subjects";

interface SubjectActionsProps {
    subject: SubjectData;
}

const SubjectActions: React.FC<SubjectActionsProps> = ({ subject }) => {
    const navigate = Route.useNavigate();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState<React.ReactNode>(null);
    const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);

    const openModal = (title: string, body: React.ReactNode, footer?: React.ReactNode) => {
        setModalTitle(title);
        setModalBody(body);
        setModalFooter(footer || null);
        setIsModalOpen(true);
    };

    const deleteMutation = useMutation({
        mutationFn: async (subjectId: number) => {
            const res = await fetch(`/api/admin/subjects/${subjectId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${TOKEN}`,
                },
            });
            if (!res.ok) throw new Error("Failed to delete subject");
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subjects"] }),
    });

    const handleEdit = () => {
        openModal(
            "Edit Subject",
            <SubjectForm subject={subject} onClose={() => setIsModalOpen(false)} />
        );
    };

    const handleDelete = () => {
        openModal(
            "Delete Subject",
            <div
                style={{
                    color: "#f02929cc",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                }}
            >
                <Icon iconName="dangerIcon" style={{ height: "70px", color: "#f02929cc" }} />
                <h3>Are you sure you want to delete this subject?</h3>
            </div>,
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                <button
                    className="modal-close-btn"
                    style={{ backgroundColor: "#f02929cc" }}
                    onClick={() => {
                        deleteMutation.mutate(subject.id);
                        setIsModalOpen(false);
                    }}
                >
                    Yes, Delete
                </button>
                <button className="cancel" onClick={() => setIsModalOpen(false)}>
                    Cancel
                </button>
            </div>
        );
    };

    const handleView = () => {
        navigate({
            to: `/admin/subjects/$subjectId`,
            params: { subjectId: subject.id.toString() },
        });
    };

    return (
        <div className="action-icons">
            <button onClick={handleEdit}>
                <Icon iconName="editIcon" style={{ width: "18px" }} /> Edit
            </button>
            <button onClick={handleView}>
                <Icon iconName="eyeView" style={{ width: "18px" }} /> View
            </button>
            <button onClick={handleView}>
                <Icon iconName="eyeView" style={{ width: "18px" }} /> Tasks
            </button>
            <button onClick={handleDelete} disabled={deleteMutation.isPending}>
                <Icon iconName="delete" style={{ width: "18px" }} /> Delete
            </button>

            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    title={modalTitle}
                    body={modalBody}
                    footer={modalFooter}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default SubjectActions;
