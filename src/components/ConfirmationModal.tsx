import { Modal, Button, Group } from '@mantine/core';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Confirm Delete"
      centered
      overlayProps={{
        opacity: 0.55,
        blur: 3,
      }}
    >
      <p>Are you sure you want to delete this data?</p>
      <Group justify="right">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="filled" color="red" onClick={onDelete}>
          Delete
        </Button>
      </Group>
    </Modal>
  );
};

export default ConfirmDeleteModal;
