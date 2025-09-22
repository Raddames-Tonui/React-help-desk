import React, { useState } from "react";
import type { SubjectData, SubjectPayload } from "@/context/types";

interface SubjectFormProps {
    initialData?: SubjectData;
    onChange: (payload: SubjectPayload) => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ initialData, onChange }) => {
    const [name, setName] = useState(initialData ? initialData.name : "");
    const [description, setDescription] = useState(initialData ? initialData.description : "");

    const updatePayload = (newName: string, newDesc: string) => {
        onChange({ name: newName, description: newDesc });
    };

    return (
        <div className="modal-form-group">
            <label htmlFor="name">   Name: </label>
            <input
                id="name"
                type="text"
                value={name}
                required
                onChange={(e) => {
                    setName(e.target.value);
                    updatePayload(e.target.value, description);
                }}
            />


            <label htmlFor="description"> Description: </label>
            <textarea
                id="description"
                value={description}
                required
                onChange={(e) => {
                    setDescription(e.target.value);
                    updatePayload(name, e.target.value);
                }}
                rows={7}
            />
        </div>
    );
};

export default SubjectForm;
