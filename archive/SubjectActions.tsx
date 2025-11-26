import React, { useState } from "react";
import Modal from "@/components/Modal";
import Icon from "@/utils/Icon";
import type { SubjectData, SubjectPayload } from "@/context/types";
import "@/css/index.css";
import { Route } from "@/routes/_protected/admin/subjects";


interface SubjectActionsProps {
    subject: SubjectData;
    updateSubject: (subjectId: number, payload: SubjectPayload) => void;
    deleteSubject: (subjectId: number) => void;
}

const SubjectActions: React.FC<SubjectActionsProps> = ({
    subject,
    updateSubject,
    deleteSubject,
}) => {
    const navigate = Route.useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState<React.ReactNode>(null);
    const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);

    const openModal = (
        title: string,
        body: React.ReactNode,
        footer?: React.ReactNode
    ) => {
        setModalTitle(title);
        setModalBody(body);
        setModalFooter(footer || null);
        setIsModalOpen(true);
    };

    const handleEdit = () => {
        let updatedName = subject.name;
        let updatedDescription = subject.description;

        openModal(
            "Edit Subject",
            <div className="modal-form-group">
                <label>
                    Name:
                    <input
                        type="text"
                        defaultValue={subject.name}
                        onChange={(e) => (updatedName = e.target.value)}
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        defaultValue={subject.description}
                        onChange={(e) => (updatedDescription = e.target.value)}
                        rows={7}
                    />
                </label>
            </div>,
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                <button
                    className="modal-close-btn"
                    onClick={() => {
                        updateSubject(subject.id, {
                            name: updatedName,
                            description: updatedDescription,
                        });
                        setIsModalOpen(false);
                    }}
                >
                    Save
                </button>
                <button className="cancel" onClick={() => setIsModalOpen(false)}>
                    Cancel
                </button>
            </div>
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
                        deleteSubject(subject.id);
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
                <Icon iconName="editIcon" style={{ width: "18px" }} />
                Edit
            </button>
            <button onClick={handleView}>
                <Icon iconName="eyeView" style={{ width: "18px" }} />
                View
            </button>
            <button onClick={handleDelete}>
                <Icon iconName="delete" style={{ width: "18px" }} />
                Delete
            </button>

            <Modal
                isOpen={isModalOpen}
                title={modalTitle}
                body={modalBody}
                footer={modalFooter}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default SubjectActions;
