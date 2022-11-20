import React from "react";

const ConfirmationModal = ({
  closeModal,
  title,
  message,
  deleteAction,
  modalData,
}) => {
  return (
    <div>
      {/* The button to open modal */}

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="confirmation-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{message}</p>
          <div className="modal-action flex justify-between">
            <label
              onClick={closeModal}
              htmlFor="confirmation-modal"
              className="btn btn-sm bg-orange-400 border-0"
            >
              Cancel
            </label>
            <label
              onClick={() => deleteAction(modalData)}
              htmlFor="confirmation-modal"
              className="btn btn-sm btn-secondary"
            >
              Delete
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
