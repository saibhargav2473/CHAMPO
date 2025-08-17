import React, { useContext, useEffect, useState } from 'react';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';
import TournamentCard from '../components/TournamentCard';
import EditModal from '../components/EditModal';
import { ModalPopup } from '../components/Popup';
import { Calendar, MapPin, Users, Trophy, Award, Clock, User } from 'lucide-react';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'
];

export default function OrganizerDashboard() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ title:'', sport:'Cricket', location:'', date:'', description:'' });
  const [file, setFile] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const fetchTournaments = async () => {
    try {
      const res = await API.get('/tournaments', { params: { organizerId: user.id, organizerOnly: true }});
      // filter locally since API expects organizerId query
      const my = res.data.filter(t => t.organizer && t.organizer._id === user.id);
      setTournaments(my);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTournaments(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('sport', form.sport);
      fd.append('location', form.location);
      fd.append('date', form.date);
      fd.append('description', form.description);
      if (file) fd.append('image', file);

      const res = await API.post('/tournaments', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      setTournaments(prev => [res.data, ...prev]);
      setForm({ title:'', sport:'Cricket', location:'', date:'', description:'' });
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating tournament');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete tournament?')) return;
    try {
      await API.delete(`/tournaments/${id}`);
      setTournaments(prev => prev.filter(t => t._id !== id));
    } catch (err) { alert('Error deleting',err); }
  };

  const openEdit = (t) => setEditing(t);

  const saveEdit = async (updatedFields, imgFile) => {
    try {
      const fd = new FormData();
      if (updatedFields.title) fd.append('title', updatedFields.title);
      if (updatedFields.sport) fd.append('sport', updatedFields.sport);
      if (updatedFields.location) fd.append('location', updatedFields.location);
      if (updatedFields.date) fd.append('date', updatedFields.date);
      if (updatedFields.description) fd.append('description', updatedFields.description);
      if (imgFile) fd.append('image', imgFile);

      const res = await API.put(`/tournaments/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      setTournaments(prev => prev.map(p => p._id === res.data._id ? res.data : p));
      setEditing(null);
    } catch (err) { alert('Error updating',err); }
  };

  const viewParticipants = async (id) => {
    try {
      const res = await API.get(`/tournaments/${id}/participants`);
      setParticipants(res.data);
      alert(`Participants: \n${res.data.map(p => `${p.name} (${p.email})`).join('\n')}`);
    } catch (err) {
      alert('Error fetching participants (ensure you are the organizer).',err);
    }
  };

  const handleTournamentClick = async (tournament) => {
    try {
      // Fetch participants for this tournament
      const res = await API.get(`/tournaments/${tournament._id}/participants`);
      setParticipants(res.data);
      setSelectedTournament({ ...tournament, participants: res.data });
      setShowPopup(true);
    } catch (err) {
      console.error('Error fetching participants:', err);
      // Still show popup with basic tournament info
      setSelectedTournament(tournament);
      setShowPopup(true);
    }
  };

  const getSportIcon = (sport) => {
    const sportIcons = {
      'basketball': '🏀',
      'football': '⚽',
      'tennis': '🎾',
      'cricket': '🏏',
      'badminton': '🏸',
      'volleyball': '🏐',
      'table tennis': '🏓',
      'swimming': '🏊',
      'athletics': '🏃',
      'cycling': '🚴'
    };
    return sportIcons[sport.toLowerCase()] || '🏆';
  };

  const getStatusBadge = (date) => {
    const tournamentDate = new Date(date);
    const now = new Date();
    const diffTime = tournamentDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Completed', color: 'bg-success-100 text-success-800' };
    } else if (diffDays === 0) {
      return { text: 'Today', color: 'bg-danger-100 text-danger-800' };
    } else if (diffDays <= 7) {
      return { text: 'This Week', color: 'bg-secondary-100 text-secondary-800' };
    } else {
      return { text: 'Upcoming', color: 'bg-primary-100 text-primary-800' };
    }
  };

  return (
    <div className="container mx-auto px-6 py-16 min-h-screen">
      {/* Header with top spacing */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">Organizer Dashboard</h1>
        <p className="text-neutral-600 text-lg">Create and manage your tournaments</p>
      </div>

      {/* Centered Form Section */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Create New Tournament</h2>
            <p className="text-neutral-600">Fill in the details below to create your tournament</p>
          </div>
          
          <form onSubmit={submit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Tournament Title</label>
                <input 
                  required 
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-300" 
                  placeholder="Enter tournament title" 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Sport</label>
                <input 
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-300" 
                  placeholder="e.g., Cricket, Football, Basketball" 
                  value={form.sport} 
                  onChange={e => setForm({...form, sport: e.target.value})} 
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
                <select 
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-300" 
                  value={form.location} 
                  onChange={e => setForm({...form, location: e.target.value})}
                >
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Date & Time</label>
                <input 
                  type="datetime-local" 
                  required 
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-300" 
                  value={form.date} 
                  onChange={e => setForm({...form, date: e.target.value})} 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
              <textarea 
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-300 resize-none" 
                rows="4"
                placeholder="Describe your tournament..." 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Tournament Image</label>
              <input 
                type="file" 
                accept="image/*"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200" 
                onChange={e => setFile(e.target.files[0])} 
              />
            </div>
            
            <div className="text-center pt-4">
              <button 
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white font-medium rounded-xl hover:from-neutral-800 hover:to-neutral-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Create Tournament
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tournaments List Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Your Tournaments</h2>
          <p className="text-neutral-600">Manage and view all your created tournaments</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.length === 0 && (
            <div className="col-span-full text-center py-16 text-neutral-600 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-300">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
              <h3 className="text-xl font-semibold mb-2">No tournaments yet</h3>
              <p className="text-neutral-500">Create your first tournament to get started!</p>
            </div>
          )}
          {tournaments.map(t => (
            <div 
              key={t._id} 
              className="cursor-pointer"
              onClick={() => handleTournamentClick(t)}
            >
              <TournamentCard 
                t={t} 
                onDelete={handleDelete}
                onEdit={openEdit}
                showRegister={null}
              />
            </div>
          ))}
        </div>
      </div>

      {editing && <EditModal tournament={editing} onClose={() => setEditing(null)} onSave={saveEdit} />}

      {/* Tournament Details Popup */}
      <ModalPopup 
        isOpen={showPopup} 
        onClose={() => setShowPopup(false)} 
        title="Tournament Details" 
        size="lg"
      >
        {selectedTournament && (
          <div className="space-y-6">
            {/* Header with Image */}
            <div className="relative overflow-hidden rounded-lg">
              {selectedTournament.imageUrl ? (
                <img 
                  src={selectedTournament.imageUrl.startsWith('/uploads') ? `${'http://localhost:5000'}${selectedTournament.imageUrl}` : selectedTournament.imageUrl} 
                  alt={selectedTournament.title} 
                  className="h-48 w-full object-cover" 
                />
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                  <div className="text-6xl">{getSportIcon(selectedTournament.sport)}</div>
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedTournament.date).color}`}>
                  {getStatusBadge(selectedTournament.date).text}
                </span>
              </div>

              {/* Sport Badge */}
              <div className="absolute top-4 left-4">
                <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-neutral-900 flex items-center gap-2 shadow-sm">
                  <span className="text-lg">{getSportIcon(selectedTournament.sport)}</span>
                  {selectedTournament.sport}
                </div>
              </div>
            </div>

            {/* Tournament Info */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-neutral-900">{selectedTournament.title}</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-neutral-700">
                    <Calendar className="w-5 h-5 text-neutral-500" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-sm">{new Date(selectedTournament.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-neutral-700">
                    <MapPin className="w-5 h-5 text-neutral-500" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm">{selectedTournament.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-neutral-700">
                    <Users className="w-5 h-5 text-neutral-500" />
                    <div>
                      <p className="font-medium">Participants</p>
                      <p className="text-sm">{selectedTournament.participants?.length || 0} registered</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-neutral-700">
                    <Award className="w-5 h-5 text-neutral-500" />
                    <div>
                      <p className="font-medium">Sport</p>
                      <p className="text-sm">{selectedTournament.sport}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Description</h3>
                <p className="text-neutral-700 leading-relaxed">{selectedTournament.description}</p>
              </div>

              {/* Participants List */}
              {selectedTournament.participants && selectedTournament.participants.length > 0 && (
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Registered Participants</h3>
                  <div className="bg-neutral-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <div className="grid gap-2">
                      {selectedTournament.participants.map((participant, index) => (
                        <div key={participant._id || index} className="flex items-center gap-3 p-2 bg-white rounded border">
                          <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{participant.name}</p>
                            <p className="text-xs text-neutral-600">{participant.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <button 
                  className="btn btn-outline flex-1"
                  onClick={() => {
                    setShowPopup(false);
                    openEdit(selectedTournament);
                  }}
                >
                  Edit Tournament
                </button>
                <button 
                  className="btn btn-danger flex-1"
                  onClick={() => {
                    setShowPopup(false);
                    handleDelete(selectedTournament._id);
                  }}
                >
                  Delete Tournament
                </button>
              </div>
            </div>
          </div>
        )}
      </ModalPopup>
    </div>
  );
}
