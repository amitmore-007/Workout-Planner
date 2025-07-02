import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Clock, 
  DollarSign, 
  Star, 
  Calendar,
  MessageSquare,
  User,
  CheckCircle,
  XCircle
} from 'lucide-react';

const VideoTraining = () => {
  const [availableCreators, setAvailableCreators] = useState([]);
  const [userSessions, setUserSessions] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [requestForm, setRequestForm] = useState({
    sessionType: '',
    sessionTitle: '',
    description: '',
    requestedTime: '',
    userGoals: '',
    fitnessLevel: 'beginner'
  });

  useEffect(() => {
    fetchAvailableCreators();
    fetchUserSessions();
  }, []);

  const fetchAvailableCreators = async () => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/video-sessions/available-creators', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableCreators(data);
      }
    } catch (error) {
      console.error('Error fetching creators:', error);
    }
  };

  const fetchUserSessions = async () => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/video-sessions/user/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserSessions(data);
      }
    } catch (error) {
      console.error('Error fetching user sessions:', error);
    }
  };

  const handleRequestSession = (creator) => {
    setSelectedCreator(creator);
    setRequestForm({
      sessionType: creator.sessionTypes[0]?.name || '',
      sessionTitle: '',
      description: '',
      requestedTime: '',
      userGoals: '',
      fitnessLevel: 'beginner'
    });
    setShowRequestModal(true);
  };

  const submitRequest = async () => {
    if (!requestForm.sessionTitle || !requestForm.description || !requestForm.requestedTime) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/video-sessions/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          creatorId: selectedCreator.creatorId._id,
          ...requestForm
        })
      });

      if (response.ok) {
        alert('Session request sent successfully!');
        setShowRequestModal(false);
        fetchUserSessions();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Failed to send request');
    } finally {
      setIsLoading(false);
    }
  };

  const joinMeeting = async (sessionId) => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/video-sessions/join/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        window.open(data.meetingLink, '_blank');
      } else {
        alert('Failed to join meeting');
      }
    } catch (error) {
      console.error('Error joining meeting:', error);
      alert('Failed to join meeting');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Video Training</h1>
            <p className="text-gray-600">Connect with expert trainers for personalized 1-on-1 sessions</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Available Trainers */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Available Trainers</h2>
              
              {availableCreators.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No trainers available at the moment</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {availableCreators.map((creator) => (
                    <div key={creator._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{creator.creatorId.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span>4.8 rating</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {creator.experience && (
                        <p className="text-gray-700 mb-4">{creator.experience}</p>
                      )}

                      {creator.specializations.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Specializations</h4>
                          <div className="flex flex-wrap gap-2">
                            {creator.specializations.map((spec, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Session Types</h4>
                        <div className="space-y-2">
                          {creator.sessionTypes.map((type, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                              <div>
                                <p className="font-medium text-gray-900">{type.name}</p>
                                <p className="text-sm text-gray-600">{type.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-purple-600">${type.price}</p>
                                <p className="text-sm text-gray-500">{type.duration} min</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRequestSession(creator)}
                        className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                      >
                        Request Session
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* User Sessions Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Sessions</h3>
              
              {userSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No sessions yet</p>
              ) : (
                <div className="space-y-4">
                  {userSessions.map((session) => (
                    <div key={session._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{session.sessionTitle}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          session.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          session.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          session.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">with {session.creatorName}</p>
                      <p className="text-sm text-purple-600">${session.price} • {session.duration} min</p>
                      
                      {session.status === 'accepted' && session.meetingLink && (
                        <button
                          onClick={() => joinMeeting(session._id)}
                          className="mt-3 w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Join Meeting
                        </button>
                      )}
                      
                      {session.status === 'rejected' && session.creatorNotes && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                          <p className="font-medium">Rejection reason:</p>
                          <p>{session.creatorNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Request Session with {selectedCreator?.creatorId.name}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                  <select
                    value={requestForm.sessionType}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, sessionType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {selectedCreator?.sessionTypes.map((type, index) => (
                      <option key={index} value={type.name}>
                        {type.name} - ${type.price} ({type.duration} min)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Title *</label>
                  <input
                    type="text"
                    value={requestForm.sessionTitle}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, sessionTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Help with weight loss plan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={requestForm.description}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows="3"
                    placeholder="Describe what you'd like to work on..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={requestForm.requestedTime}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, requestedTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Goals</label>
                  <input
                    type="text"
                    value={requestForm.userGoals}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, userGoals: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Lose 20 pounds, build muscle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Level</label>
                  <select
                    value={requestForm.fitnessLevel}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, fitnessLevel: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRequest}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoTraining;
