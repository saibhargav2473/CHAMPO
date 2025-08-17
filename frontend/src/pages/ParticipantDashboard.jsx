import React, { useEffect, useState } from 'react';
import API from '../api';
import TournamentCard from '../components/TournamentCard';
import { ModalPopup } from '../components/Popup';
import { Calendar, MapPin, Users, Trophy, Award, User, Search, Filter, Grid, List } from 'lucide-react';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
];

export default function ParticipantDashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [filters, setFilters] = useState({ sport:'', location:'', search:'' });
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/tournaments');
      setTournaments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = tournaments.filter(t => {
    if (filters.sport && !t.sport.toLowerCase().includes(filters.sport.toLowerCase())) return false;
    if (filters.location && t.location !== filters.location) return false;
    if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const registerFor = async (t) => {
    try {
      await API.post(`/tournaments/${t._id}/register`);
      alert('Registered!');
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering');
    }
  };

  const handleTournamentClick = async (tournament) => {
    try {
      // Fetch participants for this tournament
      const res = await API.get(`/tournaments/${tournament._id}/participants`);
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

  const clearFilters = () => {
    setFilters({ sport: '', location: '', search: '' });
  };

  return (
    <div className="container mx-auto px-6 py-16 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">Discover Tournaments</h1>
        <p className="text-neutral-600 text-lg">Find and join exciting tournaments near you</p>
      </div>

      {/* Enhanced Filters Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-neutral-600" />
          <h2 className="text-lg font-semibold text-neutral-900">Search & Filter</h2>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-300" 
              placeholder="Search tournaments..." 
              value={filters.search} 
              onChange={e => setFilters({...filters, search: e.target.value})} 
            />
          </div>
          
          {/* Sport Filter */}
          <input 
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-300" 
            placeholder="Filter by sport..." 
            value={filters.sport} 
            onChange={e => setFilters({...filters, sport: e.target.value})} 
          />
          
          {/* Location Filter */}
          <select 
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-300" 
            value={filters.location} 
            onChange={e => setFilters({...filters, location: e.target.value})}
          >
            <option value="">All States</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          
          {/* Clear Filters Button */}
          <button 
            onClick={clearFilters}
            className="px-6 py-3 bg-neutral-100 text-neutral-700 font-medium rounded-xl hover:bg-neutral-200 transition-all duration-300 hover:scale-105"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* View Mode Toggle and Results Count */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-neutral-600">
            {filtered.length} tournament{filtered.length !== 1 ? 's' : ''} found
          </span>
          {(filters.search || filters.sport || filters.location) && (
            <span className="text-sm text-neutral-500">
              (filtered from {tournaments.length} total)
            </span>
          )}
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-neutral-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === 'grid' 
                ? 'bg-white text-neutral-900 shadow-sm' 
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === 'list' 
                ? 'bg-white text-neutral-900 shadow-sm' 
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
          <p className="mt-4 text-neutral-600">Loading tournaments...</p>
        </div>
      )}

      {/* Tournaments Grid/List */}
      {!isLoading && (
        <div className={viewMode === 'grid' 
          ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-neutral-600 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-300">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
              <h3 className="text-xl font-semibold mb-2">No tournaments found</h3>
              <p className="text-neutral-500">
                {filters.search || filters.sport || filters.location 
                  ? "Try adjusting your filters to see more tournaments."
                  : "Check back later for new tournaments!"
                }
              </p>
            </div>
          ) : (
            filtered.map(t => (
              <div 
                key={t._id} 
                className="cursor-pointer"
                onClick={() => handleTournamentClick(t)}
              >
                <TournamentCard 
                  t={t} 
                  showRegister={() => registerFor(t)} 
                />
              </div>
            ))
          )}
        </div>
      )}

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
                  className="btn btn-primary flex-1"
                  onClick={() => {
                    setShowPopup(false);
                    registerFor(selectedTournament);
                  }}
                >
                  <Trophy className="w-4 h-4" />
                  Register for Tournament
                </button>
              </div>
            </div>
          </div>
        )}
      </ModalPopup>
    </div>
  );
}
