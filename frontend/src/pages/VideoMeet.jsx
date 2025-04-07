// pages/VideoMeet.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Change to your backend URL

const VideoMeet = () => {
  const { roomId: urlRoomId } = useParams();
  const [roomId, setRoomId] = useState(urlRoomId || "");
  const [joined, setJoined] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef(null);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    if (urlRoomId) joinRoom(urlRoomId);
  }, [urlRoomId]);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = stream;
    return stream;
  };

  const joinRoom = async (id) => {
    setJoined(true);
    const stream = await startCamera();

    socket.emit("join", id);
    peerConnectionRef.current = new RTCPeerConnection(servers);

    stream.getTracks().forEach((track) =>
      peerConnectionRef.current.addTrack(track, stream)
    );

    peerConnectionRef.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    socket.on("offer", async (offer) => {
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit("answer", answer, id);
    });

    socket.on("answer", async (answer) => {
      await peerConnectionRef.current.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        await peerConnectionRef.current.addIceCandidate(candidate);
      } catch (err) {
        console.error("Error adding ice candidate", err);
      }
    });

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate, id);
      }
    };

    // Initiator creates offer
    socket.on("ready", async () => {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit("offer", offer, id);
    });
  };

  const handleJoin = () => {
    if (roomId.trim() !== "") {
      joinRoom(roomId);
    }
  };

  return (
    <div className="p-4">
      {!joined ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Join a Workout Meet</h2>
          <input
            className="border p-2 rounded w-full"
            placeholder="Enter Room Code"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            onClick={handleJoin}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Room: {roomId}</h3>
          <div className="flex gap-4">
            <div>
              <h4 className="font-semibold">You</h4>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-64 h-48 bg-black rounded"
              />
            </div>
            <div>
              <h4 className="font-semibold">Partner</h4>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-64 h-48 bg-black rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoMeet;
