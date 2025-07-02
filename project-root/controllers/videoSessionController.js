const VideoSession = require('../models/VideoSession');
const CreatorAvailability = require('../models/CreatorAvailability');
const User = require('../models/userModel');
const Creator = require('../models/creatorModel');
const { google } = require('googleapis');
const asyncHandler = require('express-async-handler');

// Configure Google Calendar API
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set up creator availability
const setupCreatorAvailability = asyncHandler(async (req, res) => {
  const {
    isActive,
    sessionTypes,
    availableSlots,
    timezone,
    experience,
    specializations,
    languages
  } = req.body;

  let availability = await CreatorAvailability.findOne({ creatorId: req.user.id });

  if (availability) {
    availability = await CreatorAvailability.findByIdAndUpdate(
      availability._id,
      {
        isActive,
        sessionTypes,
        availableSlots,
        timezone,
        experience,
        specializations,
        languages
      },
      { new: true }
    );
  } else {
    availability = await CreatorAvailability.create({
      creatorId: req.user.id,
      isActive,
      sessionTypes,
      availableSlots,
      timezone,
      experience,
      specializations,
      languages
    });
  }

  res.json(availability);
});

// Get creator availability
const getCreatorAvailability = asyncHandler(async (req, res) => {
  const availability = await CreatorAvailability.findOne({ creatorId: req.user.id });
  res.json(availability || {});
});

// Get all available creators for users
const getAvailableCreators = asyncHandler(async (req, res) => {
  const availabilities = await CreatorAvailability.find({ isActive: true })
    .populate('creatorId', 'name email')
    .sort({ createdAt: -1 });

  res.json(availabilities);
});

// Request video session (User)
const requestVideoSession = asyncHandler(async (req, res) => {
  const {
    creatorId,
    sessionTitle,
    description,
    duration,
    requestedTime,
    userGoals,
    fitnessLevel,
    sessionType
  } = req.body;

  const creator = await Creator.findById(creatorId);
  if (!creator) {
    res.status(404);
    throw new Error('Creator not found');
  }

  const availability = await CreatorAvailability.findOne({ creatorId });
  if (!availability || !availability.isActive) {
    res.status(400);
    throw new Error('Creator is not available for sessions');
  }

  // Find the session type to get the price
  const selectedSessionType = availability.sessionTypes.find(
    type => type.name === sessionType
  );

  if (!selectedSessionType) {
    res.status(400);
    throw new Error('Invalid session type');
  }

  const session = await VideoSession.create({
    creatorId,
    creatorName: creator.name,
    userId: req.user.id,
    userName: req.user.name,
    userEmail: req.user.email,
    sessionTitle,
    description,
    duration: selectedSessionType.duration,
    price: selectedSessionType.price,
    requestedTime,
    userGoals,
    fitnessLevel
  });

  res.status(201).json(session);
});

// Get creator's pending requests
const getCreatorRequests = asyncHandler(async (req, res) => {
  const requests = await VideoSession.find({ 
    creatorId: req.user.id,
    status: 'pending'
  }).sort({ createdAt: -1 });

  res.json(requests);
});

// Get creator's all sessions
const getCreatorSessions = asyncHandler(async (req, res) => {
  const sessions = await VideoSession.find({ 
    creatorId: req.user.id
  }).sort({ createdAt: -1 });

  res.json(sessions);
});

// Get user's sessions
const getUserSessions = asyncHandler(async (req, res) => {
  const sessions = await VideoSession.find({ 
    userId: req.user.id
  }).sort({ createdAt: -1 });

  res.json(sessions);
});

// Accept/Reject session request (Creator)
const updateSessionStatus = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { status, creatorNotes } = req.body;

  const session = await VideoSession.findOne({
    _id: sessionId,
    creatorId: req.user.id
  });

  if (!session) {
    res.status(404);
    throw new Error('Session not found');
  }

  if (session.status !== 'pending') {
    res.status(400);
    throw new Error('Session has already been processed');
  }

  session.status = status;
  session.creatorNotes = creatorNotes;

  if (status === 'accepted') {
    // Generate Google Meet link
    try {
      const meetLink = await createGoogleMeetLink(session);
      session.meetingLink = meetLink;
    } catch (error) {
      console.error('Error creating Google Meet link:', error);
      session.meetingLink = `https://meet.google.com/new`; // Fallback
    }
  }

  await session.save();

  res.json(session);
});

// Create Google Meet link
const createGoogleMeetLink = async (session) => {
  try {
    // For now, we'll use Google Meet's instant meeting feature
    // In production, you'd want to create scheduled meetings via Google Calendar API
    
    const meetingId = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
    
    return `https://meet.google.com/${meetingId}`;
  } catch (error) {
    console.error('Error creating Google Meet link:', error);
    throw error;
  }
};

// Join session (both creator and user)
const joinSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await VideoSession.findById(sessionId);

  if (!session) {
    res.status(404);
    throw new Error('Session not found');
  }

  // Check if user is authorized to join
  const isCreator = session.creatorId.toString() === req.user.id;
  const isUser = session.userId.toString() === req.user.id;

  if (!isCreator && !isUser) {
    res.status(403);
    throw new Error('Not authorized to join this session');
  }

  if (session.status !== 'accepted') {
    res.status(400);
    throw new Error('Session is not accepted yet');
  }

  if (!session.meetingLink) {
    res.status(400);
    throw new Error('Meeting link not available');
  }

  res.json({
    meetingLink: session.meetingLink,
    session
  });
});

module.exports = {
  setupCreatorAvailability,
  getCreatorAvailability,
  getAvailableCreators,
  requestVideoSession,
  getCreatorRequests,
  getCreatorSessions,
  getUserSessions,
  updateSessionStatus,
  joinSession
};
