import { useContext, useEffect, useState } from "react";
import NoChatSelected from "../components/noChatSelected";
import { axiosInstance } from "../lib/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React from "react";
import toast from "react-hot-toast";

export default function Session() {
  const redirect = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [ready, setReady] = useState(false);
  const { user } = useContext(AuthContext);
  const [choices, setChoices] = useState({
    role: "student",
    userId: user._id,
    status: "scheduled",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("sessions", {
          params: choices,
        });
        console.log(res.data);
        setSessions(res.data);
        // Clear selected session if it's no longer in the list
        if (
          selectedSession &&
          !res.data.find((s) => s._id === selectedSession._id)
        ) {
          setSelectedSession(null);
        }
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Failed to load sessions. Please try again later.");
        toast.error("Failed to load sessions");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, [choices, selectedSession]);

  const handleStatusChange = (status) => {
    setChoices({ ...choices, status });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const setSession = async (session) => {
    if (!session) {
      setSelectedSession(null);
      setReady(false);
      return;
    }

    console.log(session, "this is session selected");
    setSelectedSession(session);

    if (session.chat_active === true) {
      redirect(
        `/room/${session._id}/${
          choices.role === "student"
            ? session.tutor_id?._id
            : session.student_id?._id
        }`
      );
    }

    if (choices.role === "student") {
      setReady(session.student_ready || false);
    } else {
      setReady(session.tutor_ready || false);
    }
  };

  const beReady = async () => {
    if (!selectedSession || !selectedSession._id) {
      toast.error("No session selected");
      return;
    }

    try {
      const data = await axiosInstance.post(
        `/sessions/${selectedSession._id}/room/ready`,
        {
          userId: user._id,
          role: choices.role,
        }
      );

      toast.success(data.data.message);
      setReady(true);

      if (data.data.ready) {
        redirect(
          `/room/${selectedSession._id}/${
            choices.role === "student"
              ? selectedSession.tutor_id?._id
              : selectedSession.student_id?._id
          }`
        );
      }
    } catch (err) {
      console.error("Error marking ready:", err);
      toast.error("Failed to mark as ready");
    }
  };

  const renderSessionItem = (session) => {
    // Safety check for required properties
    const subjectName = session.offer_id?.subject || "No Subject";
    const studentName = session.student_id?.fullName || "Unknown Student";
    const tutorName = session.tutor_id?.fullName || "Unknown Tutor";
    const sessionDate = session.offer_id?.date;
    const duration = session.offer_id?.dure;

    return (
      <div
        key={session._id}
        onClick={() => {
          if (selectedSession && selectedSession._id === session._id) {
            setSession(null);
          } else {
            setSession(session);
          }
        }}
        className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition duration-150 cursor-pointer ${
          selectedSession?._id === session._id
            ? "border-indigo-500 ring-2 ring-indigo-200"
            : "border-gray-200"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-medium text-gray-800">{subjectName}</h2>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                session.status === "scheduled"
                  ? "bg-blue-100 text-blue-800"
                  : session.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {session.status || "Unknown"}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Student</p>
              <p className="font-medium text-gray-900">{studentName}</p>
            </div>
            <div>
              <p className="text-gray-500">Tutor</p>
              <p className="font-medium text-gray-900">{tutorName}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-sm text-gray-500">
            <div>
              <span>Date: </span>
              <span className="font-medium text-gray-700">
                {formatDate(sessionDate)}
              </span>
            </div>
            <div>
              <span>Duration: </span>
              <span className="font-medium text-gray-700">
                {duration || "N/A"} {duration === 1 ? "hour" : "hours"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSessionDetails = () => {
    if (!selectedSession) return <NoChatSelected />;

    // Safety checks for required properties
    const subject = selectedSession.offer_id?.subject || "No Subject";
    const description =
      selectedSession.offer_id?.description || "No description provided";
    const studentName =
      selectedSession.student_id?.fullName || "Unknown Student";
    const studentEmail = selectedSession.student_id?.email || "No email";
    const tutorName = selectedSession.tutor_id?.fullName || "Unknown Tutor";
    const tutorEmail = selectedSession.tutor_id?.email || "No email";
    const sessionDate = selectedSession.offer_id?.date;
    const duration = selectedSession.offer_id?.dure;
    const tags = selectedSession.offer_id?.tags || [];

    const showReadyButton =
      selectedSession.scheduled_start &&
      new Date(selectedSession.scheduled_start).getTime() >= Date.now();

    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{subject}</h2>
          <div className="mt-2 text-gray-600">{description}</div>
        </div>
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Student
              </h3>
              <p className="text-gray-800">{studentName}</p>
              <p className="text-gray-500 text-sm mt-1">{studentEmail}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Tutor
              </h3>
              <p className="text-gray-800">{tutorName}</p>
              <p className="text-gray-500 text-sm mt-1">{tutorEmail}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg col-span-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Session Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(sessionDate)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium">
                    {duration || "N/A"} {duration === 1 ? "hour" : "hours"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedSession.status === "scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : selectedSession.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedSession.status || "Unknown"}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">
                    {tags.length > 0 ? tags.join(", ") : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {showReadyButton && (
            <div className="flex justify-center mt-2">
              <button
                className="bg-[#A7E629] text-white w-30 rounded-xl h-10 disabled:bg-opacity-50 disabled:cursor-not-allowed"
                onClick={beReady}
                type="button"
                disabled={ready}
              >
                {!ready ? "Ready" : "Waiting..."}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid session grid-cols-1 md:grid-cols-2 h-screen bg-[#ebebeb]">
      {/* Left Panel - Sessions List */}
      <div className="border-r border-gray-200 overflow-hidden flex flex-col">
        {/* Header with Filters */}
        <div className="bg-gray-300- p-4 border-b border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-xl font-semibold text-gray-800">My Sessions</h1>

            <div className="relative">
              <select
                value={choices.role}
                onChange={(e) =>
                  setChoices({ ...choices, role: e.target.value })
                }
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
              >
                <option value="student">I'm a Student</option>
                <option value="tutor">I'm a Tutor</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex space-x-2 border-b border-gray-200">
            <button
              onClick={() => handleStatusChange("scheduled")}
              className={`px-4 py-2 font-medium text-sm ${
                choices.status === "scheduled"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => handleStatusChange("completed")}
              className={`px-4 py-2 font-medium text-sm ${
                choices.status === "completed"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => handleStatusChange("closed")}
              className={`px-4 py-2 font-medium text-sm ${
                choices.status === "closed"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Closed
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="mt-2 text-gray-500 text-lg">{error}</p>
              <button
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  // Trigger re-fetch by forcing a state change
                  setChoices({ ...choices });
                }}
              >
                Try Again
              </button>
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => renderSessionItem(session))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-gray-500 text-lg">No sessions found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try changing your filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Session Details */}
      <div className="bg-white overflow-hidden">{renderSessionDetails()}</div>
    </div>
  );
}
