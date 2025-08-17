import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, Edit, Trash2, Eye, ArrowRight, ExternalLink } from 'lucide-react';

export default function TournamentCard({ t, onDelete, onEdit, showRegister }) {
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
      return { text: 'Completed', color: 'badge-success' };
    } else if (diffDays === 0) {
      return { text: 'Today', color: 'badge-danger' };
    } else if (diffDays <= 7) {
      return { text: 'This Week', color: 'badge-secondary' };
    } else {
      return { text: 'Upcoming', color: 'badge-primary' };
    }
  };

  const status = getStatusBadge(t.date);

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:border-neutral-300 animate-fade-in">
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
      
      {/* Image Section */}
      <div className="relative overflow-hidden">
        {t.imageUrl ? (
          <img 
            src={t.imageUrl.startsWith('/uploads') ? `${'http://localhost:5000'}${t.imageUrl}` : t.imageUrl} 
            alt={t.title} 
            className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
          />
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-neutral-200 group-hover:via-neutral-300 group-hover:to-neutral-400 transition-all duration-500">
            <div className="text-6xl group-hover:scale-110 transition-transform duration-500">{getSportIcon(t.sport)}</div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className={`badge ${status.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
            {status.text}
          </span>
        </div>

        {/* Sport Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-neutral-900 flex items-center gap-2 shadow-sm group-hover:bg-white group-hover:shadow-md transition-all duration-300">
            <span className="text-lg group-hover:scale-110 transition-transform duration-300">{getSportIcon(t.sport)}</span>
            {t.sport}
          </div>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
          <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
              <ExternalLink className="w-5 h-5 text-neutral-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="card-body p-6">
        <div className="space-y-4">
          {/* Title */}
          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors duration-300 line-clamp-2 group-hover:line-clamp-none">
            {t.title}
          </h3>

          {/* Meta Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-neutral-700 group-hover:text-neutral-600 transition-colors duration-300">
              <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm">{new Date(t.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            
            <div className="flex items-center gap-2 text-neutral-700 group-hover:text-neutral-600 transition-colors duration-300">
              <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm">{t.location}</span>
            </div>

            {t.participants && (
              <div className="flex items-center gap-2 text-neutral-700 group-hover:text-neutral-600 transition-colors duration-300">
                <Users className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">{t.participants.length} participants</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-neutral-700 text-sm line-clamp-3 leading-relaxed group-hover:text-neutral-600 transition-colors duration-300">
            {t.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Link 
              to={`/tournaments/${t._id}`} 
              className="btn btn-outline btn-sm flex items-center gap-2 hover-scale bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <Eye className="w-4 h-4" />
              Details
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            {showRegister && (
              <button 
                className="btn btn-primary btn-sm flex items-center gap-2 hover-scale" 
                onClick={(e) => {
                  e.stopPropagation();
                  showRegister(t);
                }}
              >
                <Trophy className="w-4 h-4" />
                Register
              </button>
            )}
            
            {onEdit && (
              <button 
                className="btn btn-ghost btn-sm flex items-center gap-2 hover-scale" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(t);
                }}
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
            
            {onDelete && (
              <button 
                className="btn btn-ghost btn-sm flex items-center gap-2 text-danger-600 hover:text-danger-700 hover:bg-danger-50 hover-scale" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(t._id);
                }}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Border Animation */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-success-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
    </div>
  );
}
