import { useState } from "react";
import { FiEdit2, FiTrash, FiX } from "react-icons/fi";

export default function NoteCard({ note, onEdit, onDelete }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      {/* Note Card (Click to Open Popup) */}
      <div
        className="bg-gray-950 bg-opacity-90 p-6 rounded-xl shadow-xl backdrop-blur-md transition transform hover:scale-105 h-70 cursor-pointer"
        onClick={() => setShowFullContent(true)}
      >
        <h2 className="text-lg font-semibold">{note.title}</h2>
        <p className="text-blue-300 text-sm">{new Date(note.createdAt).toLocaleDateString("en-GB")}</p>

        {/* Short Content Preview */}
        <p className="text-gray-300 text-sm mt-2 break-words line-clamp-1 overflow-hidden whitespace-pre-wrap">
          {note.content}
        </p>

        {/* Edit & Delete Buttons */}
        <div className="flex justify-end gap-4 items-end mt-2">
          <button
            className="text-gray-400 hover:text-blue-400 transition"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
          >
            <FiEdit2 size={18} />
          </button>
          <button
            className="text-gray-400 hover:text-red-400 transition"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
          >
            <FiTrash size={18} />
          </button>
        </div>
      </div>

      {/* Full Content Popup */}
      {showFullContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-10">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[600px] max-w-2xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{note.title}</h2>
              <button onClick={() => setShowFullContent(false)} className="text-gray-400 hover:text-red-400">
                <FiX size={24} />
              </button>
            </div>

            <p className="text-blue-300 text-sm">{new Date(note.createdAt).toLocaleDateString("en-GB")}</p>

            {/* Scrollable Content - Preserve Line Breaks */}
            <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
              <p className="text-gray-300 text-sm break-words whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-20">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[400px] text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-300 text-sm mb-4">Are you sure you want to delete this note?</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(note._id); // ✅ Now uses the actual backend `_id`
                  setShowDeleteConfirm(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
