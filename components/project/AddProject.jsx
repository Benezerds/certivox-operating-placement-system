import React from 'react';
import AddProjectForm from './AddProjectForm';

const AddProject = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-lg">
        {/* X button to close the modal */}
        <button onClick={onClose} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4">Add Project</h2>

        {/* Import the form component */}
        <AddProjectForm onClose={onClose} />
      </div>
    </div>
  );
};

export default AddProject;