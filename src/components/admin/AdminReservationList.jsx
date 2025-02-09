import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const formatDate = (date) => {
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

const AdminReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationsRef = collection(db, "reservations");
        const reservationSnapshot = await getDocs(reservationsRef);

        const reservationData = await Promise.all(
          reservationSnapshot.docs.map(async (reservationDoc) => {
            const reservation = reservationDoc.data();

            const userRef = doc(db, "users", reservation.userId);
            const userDoc = await getDoc(userRef);
            const userInfo = userDoc.exists() ? userDoc.data() : { firstName: "Unknown", lastName: "", email: "N/A" };

            const locationRef = doc(db, "locations", reservation.locationId);
            const locationDoc = await getDoc(locationRef);
            const locationName = locationDoc.exists() ? locationDoc.data().name : "Unknown Location";

            let activityNames = [];
            if (reservation.activityIds && Array.isArray(reservation.activityIds)) {
              const activityPromises = reservation.activityIds.map(async (activityId) => {
                const activityRef = doc(db, "activities", activityId);
                const activityDoc = await getDoc(activityRef);
                return activityDoc.exists() ? activityDoc.data().name : "Unknown Activity";
              });
              activityNames = await Promise.all(activityPromises);
            }

            return {
              id: reservationDoc.id,
              locationName,
              date: reservation.date || "No Date",
              status: reservation.status || "Pending",
              user: userInfo,
              activityNames,
            };
          })
        );

        setReservations(reservationData);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "Approved":
        return "bg-blue-600";
      case "Cancelled":
        return "bg-red-500";
      case "Completed":
        return "bg-green-600";
      default:
        return "bg-gray-300";
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.user.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    const formattedSelectedDate = selectedDate ? formatDate(selectedDate) : "";
    const matchesDate = formattedSelectedDate ? formatDate(reservation.date) === formattedSelectedDate : true;
    const matchesStatus = statusFilter ? reservation.status === statusFilter : true;

    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <div className="max-w-[1300px] p-8 bg-gray-50 rounded-lg shadow-xl">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Reservation Management</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row justify-evenly items-center gap-4">
        <input
          type="text"
          placeholder="Search by Location, Name or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 w-full md:w-3/6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-3 w-full md:w-1/6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 w-full md:w-1/6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedDate('');
            setStatusFilter('');
          }}
          className="w-full md:w-1/6 p-3 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition duration-200"
        >
          Clear Filters
        </button>
      </div>

      {reservations.length === 0 ? (
        <p className="text-center text-gray-600">No reservations found.</p>
      ) : (
        <div className="space-y-6">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className={`p-6 text-white ${getStatusColor(reservation.status)} grid grid-cols-3 gap-4`}>
                <span className="font-semibold text-lg truncate">{reservation.locationName}</span>
                <span className="text-sm text-center">{formatDate(reservation.date)}</span>
                <span className="text-sm font-semibold text-center capitalize">{reservation.status}</span>
              </div>

              <button
                onClick={() => toggleDetails(reservation.id)}
                className="w-full p-4 text-gray-800 bg-gray-100 hover:bg-gray-200 transition duration-200"
              >
                {expandedId === reservation.id ? "Hide Details" : "Show Details"}
              </button>

              {expandedId === reservation.id && (
                <div className="p-6 bg-gray-50">
                  <p><strong className="text-gray-800">Location:</strong> {reservation.locationName}</p>
                  <p><strong className="text-gray-800">Activities:</strong> {reservation.activityNames.join(", ") || "None"}</p>
                  <p><strong className="text-gray-800">Date:</strong> {formatDate(reservation.date)}</p>
                  <p><strong className="text-gray-800">Reserved By:</strong> {reservation.user.firstName} {reservation.user.lastName}</p>
                  <p><strong className="text-gray-800">Email:</strong> {reservation.user.email}</p>
                  <p><strong className="text-gray-800">Contact Number:</strong> {reservation.user.contactNumber || "N/A"}</p>
                  <p><strong className="text-gray-800">Status:</strong> {reservation.status}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReservationList;