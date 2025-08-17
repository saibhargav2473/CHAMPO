import React, { useState } from 'react';
import { X, Save, Upload, Calendar, MapPin, Trophy, FileText } from 'lucide-react';

export default function EditModal({ tournament, onClose, onSave }) {
  const [form, setForm] = useState({
    title: tournament.title,
    sport: tournament.sport,
    location: tournament.location,
    date: new Date(tournament.date).toISOString().slice(0,16),
    description: tournament.description || ''
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSave = async () => {
    // Basic validation
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.sport.trim()) newErrors.sport = 'Sport is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(form, file);
      onClose();
    } catch (error) {
      setErrors({ general: 'Failed to save tournament. Please try again.' +error});
    } finally {
      setIsLoading(false);
    }
  };

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900">Edit Tournament</h3>
              <p className="text-sm text-neutral-600">Update tournament details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {errors.general && (
            <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
              <p className="text-danger-700 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="form-group md:col-span-2">
              <label className="form-label">Tournament Title</label>
              <input 
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Enter tournament title"
                value={form.title} 
                onChange={e => {
                  setForm({...form, title: e.target.value});
                  if (errors.title) setErrors({...errors, title: null});
                }} 
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            {/* Sport */}
            <div className="form-group">
              <label className="form-label">Sport</label>
              <input 
                className={`form-input ${errors.sport ? 'error' : ''}`}
                placeholder="e.g., Cricket, Football, Basketball"
                value={form.sport} 
                onChange={e => {
                  setForm({...form, sport: e.target.value});
                  if (errors.sport) setErrors({...errors, sport: null});
                }}
              />
              {errors.sport && <div className="form-error">{errors.sport}</div>}
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Location</label>
              <select 
                className={`form-input ${errors.location ? 'error' : ''}`}
                value={form.location} 
                onChange={e => {
                  setForm({...form, location: e.target.value});
                  if (errors.location) setErrors({...errors, location: null});
                }}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.location && <div className="form-error">{errors.location}</div>}
            </div>

            {/* Date */}
            <div className="form-group md:col-span-2">
              <label className="form-label">Date & Time</label>
              <input 
                type="datetime-local" 
                className={`form-input ${errors.date ? 'error' : ''}`}
                value={form.date} 
                onChange={e => {
                  setForm({...form, date: e.target.value});
                  if (errors.date) setErrors({...errors, date: null});
                }} 
              />
              {errors.date && <div className="form-error">{errors.date}</div>}
            </div>

            {/* Description */}
            <div className="form-group md:col-span-2">
              <label className="form-label">Description</label>
              <textarea 
                className={`form-input min-h-[120px] resize-none ${errors.description ? 'error' : ''}`}
                placeholder="Describe the tournament, rules, prizes, etc."
                value={form.description} 
                onChange={e => {
                  setForm({...form, description: e.target.value});
                  if (errors.description) setErrors({...errors, description: null});
                }} 
              />
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>

            {/* Image Upload */}
            <div className="form-group md:col-span-2">
              <label className="form-label">Tournament Image</label>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setFile(e.target.files[0])} 
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 bg-neutral-50">
          <button 
            className="btn btn-ghost" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary flex items-center gap-2" 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
