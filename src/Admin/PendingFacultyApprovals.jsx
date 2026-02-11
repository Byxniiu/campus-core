import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../api/admin';

const PendingFacultyApprovals = () => {
  const [pendingFaculty, setPendingFaculty] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingFaculty();
  }, []);

  const fetchPendingFaculty = async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getPendingFaculty();
      if (response.success) {
        setPendingFaculty(response.data);
      }
    } catch (error) {
      console.error('Error fetching pending faculty:', error);
      toast.error('Failed to load pending faculty');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (facultyId, facultyName) => {
    if (!window.confirm(`Approve ${facultyName}?`)) return;

    setProcessingId(facultyId);
    try {
      const response = await adminAPI.approveFaculty(facultyId);
      if (response.success) {
        toast.success(response.message || 'Faculty approved successfully!');
        // Remove from pending list
        setPendingFaculty((prev) => prev.filter((f) => f._id !== facultyId));
      }
    } catch (error) {
      console.error('Error approving faculty:', error);
      toast.error(error.message || 'Failed to approve faculty');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (facultyId, facultyName) => {
    if (!window.confirm(`Reject ${facultyName}'s application? This action cannot be undone.`))
      return;

    setProcessingId(facultyId);
    try {
      const response = await adminAPI.rejectFaculty(facultyId);
      if (response.success) {
        toast.success(response.message || 'Faculty application rejected');
        // Remove from pending list
        setPendingFaculty((prev) => prev.filter((f) => f._id !== facultyId));
      }
    } catch (error) {
      console.error('Error rejecting faculty:', error);
      toast.error(error.message || 'Failed to reject faculty');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading pending faculty...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pending Faculty Approvals</h1>
          <p className="text-gray-400">Review and approve faculty registration applications</p>
        </div>
        <div className="bg-teal-500/20 text-teal-400 px-4 py-2 rounded-lg font-semibold">
          {pendingFaculty.length} Pending
        </div>
      </div>

      {/* No Pending Faculty */}
      {pendingFaculty.length === 0 ? (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
          <p className="text-gray-400">No pending faculty applications at the moment.</p>
        </div>
      ) : (
        /* Faculty List */
        <div className="space-y-4">
          {pendingFaculty.map((faculty) => (
            <div
              key={faculty._id}
              className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 hover:border-teal-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                {/* Faculty Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {faculty.firstName[0]}
                      {faculty.lastName[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {faculty.firstName} {faculty.lastName}
                      </h3>
                      <p className="text-sm text-gray-400">{faculty.email}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                        Department
                      </p>
                      <p className="text-sm text-white">{faculty.department || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Section</p>
                      <p className="text-sm text-white">{faculty.section || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                        Designation
                      </p>
                      <p className="text-sm text-white">{faculty.designation || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                        Registered
                      </p>
                      <p className="text-sm text-white">{formatDate(faculty.createdAt)}</p>
                    </div>
                  </div>

                  {faculty.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>{faculty.phone}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() =>
                      handleApprove(faculty._id, `${faculty.firstName} ${faculty.lastName}`)
                    }
                    disabled={processingId === faculty._id}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {processingId === faculty._id ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Approve</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleReject(faculty._id, `${faculty.firstName} ${faculty.lastName}`)
                    }
                    disabled={processingId === faculty._id}
                    className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/50 font-semibold rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingFacultyApprovals;
