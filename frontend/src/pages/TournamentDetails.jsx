import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';

export default function TournamentDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [t, setT] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/tournaments/${id}`);
        setT(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  if (!t) return <div className="container mx-auto p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold">{t.title}</h2>
        {t.imageUrl && <img src={t.imageUrl.startsWith('/uploads') ? `${ 'http://localhost:5000'}${t.imageUrl}` : t.imageUrl} alt={t.title} className="w-full mt-4 max-h-96 object-cover" />}
        <div className="mt-4">
          <div className="text-sm text-gray-600">{t.sport} • {new Date(t.date).toLocaleString()}</div>
          <div className="text-sm text-gray-600">Location: {t.location}</div>
          <p className="mt-2">{t.description}</p>
          <div className="mt-4">
            <div className="font-semibold">Organizer</div>
            <div>{t.organizer?.name} • {t.organizer?.email}</div>
          </div>

          {user?.role === 'organizer' && user?.id === t.organizer?._id && (
            <div className="mt-4">
              <h4 className="font-semibold">Participants ({t.participants?.length || 0})</h4>
              <ul className="mt-2">
                {t.participants?.map(p => (
                  <li key={p._id} className="text-sm">{p.name} — {p.email}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
