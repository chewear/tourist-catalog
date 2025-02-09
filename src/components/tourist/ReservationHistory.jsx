import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("uid", "==", currentUser.uid));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userId = userDoc.id;

          const reservationsRef = collection(db, "reservations");
          const reservationQuery = query(
            reservationsRef,
            where("userId", "==", userId)
          );
          const reservationSnapshot = await getDocs(reservationQuery);

          const reservationData = await Promise.all(
            reservationSnapshot.docs.map(async (reservationDoc) => {
              const reservation = reservationDoc.data();

              const locationRef = doc(db, "locations", reservation.locationId);
              const locationDoc = await getDoc(locationRef);
              const locationName = locationDoc.exists()
                ? locationDoc.data().name
                : "Location not found";

              const guideRef = doc(db, "users", reservation.guideId);
              const guideDoc = await getDoc(guideRef);
              const guideData = guideDoc.exists() ? guideDoc.data() : {};

              const activityData = await Promise.all(
                (reservation.activityIds || []).map(async (activityId) => {
                  const activityRef = doc(db, "activities", activityId);
                  const activityDoc = await getDoc(activityRef);
                  return activityDoc.exists() ? activityDoc.data().name : "Activity not found";
                })
              );

              return {
                id: reservationDoc.id,
                locationName,
                guideName: guideData.firstName
                  ? `${guideData.firstName} ${guideData.lastName}`
                  : "No guide selected",
                guideContact: guideData.contactNumber || "N/A",
                guideEmail: guideData.email || "N/A",
                guideRate: guideData.rate || "N/A",
                activityNames: activityData,
                date: reservation.date || "N/A",
                status: reservation.status || "Unknown",
                timestamp: reservation.timestamp?.seconds
                  ? reservation.timestamp.seconds * 1000
                  : null,
              };
            })
          );

          setReservations(reservationData);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

    try {
      const reservationRef = doc(db, "reservations", id);
      await updateDoc(reservationRef, { status: "Cancelled" });

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id ? { ...reservation, status: "Cancelled" } : reservation
        )
      );
      alert("Reservation cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  const handlePrint = (reservation) => {
    const receiptWindow = window.open("", "_blank");
    receiptWindow.document.write(`
      <html>
      <head>
          <title>Reservation Receipt</title>
          <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .receipt { border: 1px solid #000; padding: 20px; max-width: 600px; margin: auto; }
              h2 { text-align: center; }
              .info { margin-bottom: 10px; }
          </style>
      </head>
      <body>
          <div class="receipt">
              <h2>Reservation Receipt</h2>
              <p class="info"><strong>Reservation ID:</strong> ${reservation.id}</p>
              <p class="info"><strong>Location:</strong> ${reservation.locationName}</p>
              <p class="info"><strong>Activities:</strong> ${reservation.activityNames.join(", ")}</p>
              <p class="info"><strong>Date:</strong> ${reservation.date}</p>
              <p class="info"><strong>Guide:</strong> ${reservation.guideName}</p>
              <p class="info"><strong>Contact:</strong> ${reservation.guideContact}</p>
              <p class="info"><strong>Email:</strong> ${reservation.guideEmail}</p>
              <p class="info"><strong>Rate:</strong> ${reservation.guideRate}</p>
              <p class="info"><strong>Status:</strong> ${reservation.status}</p>
              <p class="info"><strong>Timestamp:</strong> ${reservation.timestamp ? new Date(reservation.timestamp).toLocaleString() : "N/A"}</p>
              <p style="text-align: center;">Thank you for your reservation!</p>
          </div>
          <script>
              window.print();
          </script>
      </body>
      </html>
    `);
    receiptWindow.document.close();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-semibold text-blue-800 mb-8">Reservation History</h1>
      {reservations.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600 text-center">No reservations found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(reservation.id)}
                className="w-full p-6 flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{reservation.locationName}</h2>
                  <p className="text-sm text-start text-gray-600">{reservation.date}</p>
                </div>
                <span
                  className={`px-4 py-1 rounded text-white 
                    ${reservation.status === "pending" || "Pending" ? "bg-gray-500" : ""}
                    ${reservation.status === "Approved" ? "bg-blue-600" : ""}
                    ${reservation.status === "Cancelled" ? "bg-gray-500" : ""}
                    ${reservation.status === "Completed" ? "bg-green-600" : ""}`}
                >
                  {reservation.status}
                </span>
              </button>

              {expandedId === reservation.id && (
                <div className="p-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p><strong>Reservation ID:</strong> {reservation.id}</p>
                    <p><strong>Location:</strong> {reservation.locationName}</p>
                    <p><strong>Activities:</strong> {reservation.activityNames.join(", ")}</p>
                    <p><strong>Date:</strong> {reservation.date}</p>
                    <p><strong>Guide:</strong> {reservation.guideName}</p>
                    <p><strong>Contact:</strong> {reservation.guideContact}</p>
                    <p><strong>Email:</strong> {reservation.guideEmail}</p>
                    <p><strong>Rate:</strong> {reservation.guideRate}</p>
                    <p><strong>Status:</strong> {reservation.status}</p>
                  </div>

                  <div className="mt-6 flex gap-4">
                    {reservation.status === "Pending" && (
                      <button
                        onClick={() => handleCancel(reservation.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Cancel Reservation
                      </button>
                    )}

                    <button
                      onClick={() => handlePrint(reservation)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Print Receipt
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationHistory;
