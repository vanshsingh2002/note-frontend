import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus } from "react-icons/fi";
import NoteCard from "../components/NoteCard";
import { getNotes, createNote, updateNote, deleteNote } from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteData, setNoteData] = useState({ title: "", content: "" });
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  // ✅ Fetch Notes on Component Mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await getNotes();
      setNotes(res.data);
    } catch (error) {
      alert("Failed to fetch notes.");
    }
  };

  const openAddNoteModal = () => {
    setEditingNote(null);
    setNoteData({ title: "", content: "" });
    setShowModal(true);
  };

  const openEditNoteModal = (note) => {
    setEditingNote(note._id);
    setNoteData({ title: note.title, content: note.content });
    setShowModal(true);
  };

  const saveNote = async () => {
    if (noteData.title.trim() === "" || noteData.content.trim() === "") return;

    try {
      if (editingNote) {
        // ✅ Update Note in Backend
        const res = await updateNote(editingNote, noteData);
        setNotes(notes.map((note) => (note._id === editingNote ? res.data : note)));
      } else {
        // ✅ Create New Note in Backend
        const res = await createNote(noteData);
        setNotes([...notes, res.data]);
      }
      setShowModal(false);
    } catch (error) {
      alert("Failed to save note.");
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      alert("Failed to delete note.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  function getInitials(name) {
    if (!name) return "MD";
    const words = name.trim().split(" ");
    return words.length > 1
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0][0].toUpperCase();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-gray-950 bg-opacity-80 p-4 shadow-lg rounded-lg mb-6 backdrop-blur-lg">
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-blue-400">Smart</span> Notes
        </h1>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-700 px-4 py-2 rounded-lg w-1/3">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search Notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
          />
        </div>

        {/* Profile & Logout */}
        <div className="flex items-center gap-4">
          <div className="bg-gray-600 w-10 h-10 flex items-center justify-center rounded-full font-semibold text-white">
            {getInitials(user?.name)}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {notes
          .filter((note) => note.title.toLowerCase().includes(search.toLowerCase()))
          .map((note) => (
            <NoteCard key={note._id} note={note} onEdit={openEditNoteModal} onDelete={handleDeleteNote} />
          ))}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={openAddNoteModal}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        <FiPlus size={24} />
      </button>

      {/* Add/Edit Note Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[600px] max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">
              {editingNote ? "Edit Note" : "Add Note"}
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={noteData.title}
              onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg mb-3 outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
            />

            <textarea
              placeholder="Content"
              value={noteData.content}
              onChange={(e) => setNoteData({ ...noteData, content: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white min-h-[200px] resize-none"
            />

            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={saveNote}
              >
                {editingNote ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
