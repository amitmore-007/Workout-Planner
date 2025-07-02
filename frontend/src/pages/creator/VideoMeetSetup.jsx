import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Clock, 
  DollarSign, 
  Plus, 
  Trash2, 
  Save,
  Calendar,
  Users,
  Star,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoMeetSetup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState({
    isActive: false,
    sessionTypes: [
      {
        name: 'Personal Training Session',
        duration: 60,
        price: 50,
        description: 'One-on-one fitness coaching session'
      }
    ],
    availableSlots: [],
    timezone: 'UTC',
    experience: '',
    specializations: [''],
    languages: ['English']
  });

  const [pendingRequests, setPendingRequests] = useState([]);
  const [allSessions, setAllSessions] = useState([]);

  useEffect(() => {
    fetchAvailability();
    fetchPendingRequests();
    fetchAllSessions();
  }, []);

  const fetchAvailability = async () => {
    try {
      const token = localStorage.getItem('creatorToken');
      const response = await fetch('http://localhost:5000/api/video-sessions/creator/availability', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setAvailability(data);
        }
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('creatorToken');
      const response = await fetch('http://localhost:5000/api/video-sessions/creator/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const fetchAllSessions = async () => {
    try {
      const token = localStorage.getItem('creatorToken');
      const response = await fetch('http://localhost:5000/api/video-sessions/creator/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAllSessions(data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleSaveAvailability = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('creatorToken');
      const response = await fetch('http://localhost:5000/api/video-sessions/creator/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(availability)
      });

      if (response.ok) {
        alert('Availability settings saved successfully!');
      } else {
        throw new Error('Failed to save availability');
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      alert('Failed to save availability settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionResponse = async (sessionId, status, notes = '') => {
    try {
      const token = localStorage.getItem('creatorToken');
      const response = await fetch(`http://localhost:5000/api/video-sessions/creator/session/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          creatorNotes: notes
        })
      });

      if (response.ok) {
        alert(status === 'accepted' ? 'Session accepted!' : 'Session rejected!');
        fetchPendingRequests();
        fetchAllSessions();
      } else {
        throw new Error('Failed to update session');
      }
    } catch (error) {
      console.error('Error updating session:', error);
      alert('Failed to update session status');
    }
  };

  const addSessionType = () => {
    setAvailability(prev => ({
      ...prev,
      sessionTypes: [
        ...prev.sessionTypes,
        {
          name: '',
          duration: 60,
          price: 0,
          description: ''
        }
      ]
    }));
  };

  const removeSessionType = (index) => {
    setAvailability(prev => ({
      ...prev,
      sessionTypes: prev.sessionTypes.filter((_, i) => i !== index)
    }));
  };

  const updateSessionType = (index, field, value) => {
    setAvailability(prev => ({
      ...prev,
      sessionTypes: prev.sessionTypes.map((type, i) =>
        i === index ? { ...type, [field]: value } : type
      )
    }));
  };

  const addSpecialization = () => {
    setAvailability(prev => ({
      ...prev,
      specializations: [...prev.specializations, '']
    }));
  };

  const removeSpecialization = (index) => {
    setAvailability(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }));
  };

  const updateSpecialization = (index, value) => {
    setAvailability(prev => ({
      ...prev,
      specializations: prev.specializations.map((spec, i) =>
        i === index ? value : spec
      )
    }));
  };

  const joinMeeting = (meetingLink) => {
    window.open(meetingLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Video Training Sessions</h1>
                <p className="text-gray-600">Manage your 1-on-1 training availability and sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                availability.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {availability.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Availability Toggle */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Availability Status</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAvailability(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    availability.isActive ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      availability.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-gray-700">
                  {availability.isActive ? 'Available for sessions' : 'Not accepting new sessions'}
                </span>
              </div>
            </div>

            {/* Session Types */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Session Types</h2>
                <button
                  onClick={addSessionType}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus size={16} />
                  Add Type
                </button>
              </div>

              <div className="space-y-4">
                {availability.sessionTypes.map((type, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Name</label>
                        <input
                          type="text"
                          value={type.name}
                          onChange={(e) => updateSessionType(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g., Personal Training"
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
                          <input
                            type="number"
                            value={type.duration}
                            onChange={(e) => updateSessionType(index, 'duration', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                          <input
                            type="number"
                            value={type.price}
                            onChange={(e) => updateSessionType(index, 'price', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={type.description}
                        onChange={(e) => updateSessionType(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        rows="2"
                        placeholder="Describe what this session includes..."
                      />
                    </div>
                    {availability.sessionTypes.length > 1 && (
                      <button
                        onClick={() => removeSessionType(index)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience & Specializations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <textarea
                    value={availability.experience}
                    onChange={(e) => setAvailability(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows="3"
                    placeholder="Describe your fitness experience and qualifications..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                  {availability.specializations.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={spec}
                        onChange={(e) => updateSpecialization(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Weight Loss, Strength Training"
                      />
                      {availability.specializations.length > 1 && (
                        <button
                          onClick={() => removeSpecialization(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addSpecialization}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <Plus size={16} />
                    Add Specialization
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <button
                onClick={handleSaveAvailability}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                <Save size={16} />
                {isLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>

          {/* Requests & Sessions Sidebar */}
          <div className="space-y-6">
            {/* Pending Requests */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Pending Requests ({pendingRequests.length})
              </h3>
              
              {pendingRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No pending requests</p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-900">{request.sessionTitle}</h4>
                        <p className="text-sm text-gray-600">by {request.userName}</p>
                        <p className="text-sm text-purple-600">${request.price} • {request.duration} min</p>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-700">{request.description}</p>
                        {request.userGoals && (
                          <p className="text-xs text-gray-500 mt-1">Goals: {request.userGoals}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSessionResponse(request._id, 'accepted')}
                          className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleSessionResponse(request._id, 'rejected')}
                          className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Sessions</h3>
              
              {allSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No sessions yet</p>
              ) : (
                <div className="space-y-3">
                  {allSessions.slice(0, 5).map((session) => (
                    <div key={session._id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{session.sessionTitle}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          session.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          session.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          session.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{session.userName}</p>
                      
                      {session.status === 'accepted' && session.meetingLink && (
                        <button
                          onClick={() => joinMeeting(session.meetingLink)}
                          className="mt-2 w-full px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                        >
                          Join Meeting
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoMeetSetup;
