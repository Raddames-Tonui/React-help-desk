import type { SingleSubjectData, SubjectData, SubjectPayload } from '@/context/types';
import Icon from '@/utils/Icon';
import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { Route } from '@/routes/_protected/admin/subjects.$subjectId';

interface SubjectActionsProps {
  subjects: SubjectData;
  updateSubject: (
    subjectId: number,
    payload: SubjectPayload
  ) => Promise<SingleSubjectData | null>;
  deleteSubject: (subjectId: number) => Promise<string>;
}

const SubjectActions: React.FC<SubjectActionsProps> = ({
  subjects,
  updateSubject,
  deleteSubject
}) => {
  const navigate = Route.useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState<React.ReactNode>(null);
  const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);

  const [form, setForm] = useState<SubjectPayload>({
    name: subjects.name,
    description: subjects.description
  });

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

  const handleEditSubject = () => {
    openModal(
      'Edit Subject',
      <EditForm
        form={form}
        setForm={setForm}
        onSave={async () => {
          await updateSubject(subjects.id, form);
          setIsModalOpen(false);
        }}
      />
    );
  };

  const EditForm: React.FC<{
    form: SubjectPayload;
    setForm: React.Dispatch<React.SetStateAction<SubjectPayload>>;
    onSave: () => void;
  }> = ({ form, setForm, onSave }) => {
    return (
      <div>
        <h3>Edit Subject</h3>
        <div>
          <label htmlFor="name">Subject Name</label>
          <input
            type="text"
            value={form.name}
            id="name"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
        <button onClick={onSave}>Save</button>
      </div>
    );
  };

  const handleDeleteSubject = () => {
    openModal(
      'Delete Subject',
      <div
        style={{
          color: '#f02929cc',
          fontWeight: 'bold',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <Icon
          iconName="dangerIcon"
          style={{ height: '70px', color: '#f02929cc' }}
        />
        <h3>Are you sure you want to delete this subject?</h3>
      </div>,
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button
          className="modal-close-btn"
          style={{ backgroundColor: '#f02929cc' }}
          onClick={() => {
            deleteSubject(subjects.id);
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

  const handleViewSubject = () => {
    navigate({
      to: `/admin/subjects/$subjectId`,
      params: { subjectId: subjects.id.toString() }
    });
  };

  return (
    <div className="actions-icons">
      <button onClick={handleEditSubject}>
        <Icon iconName="editIcon" style={{ width: '18px' }} />
        Edit
      </button>
      <button onClick={handleViewSubject}>
        <Icon iconName="eyeView" style={{ width: '18px' }} />
        View
      </button>
      <button onClick={handleDeleteSubject}>
        <Icon iconName="delete" style={{ width: '18px' }} />
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
