import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(""); // New state for status filter
    const toast = React.useRef(null); // Reference for PrimeReact toast

    useEffect(() => {
        const fetchReservations = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            try {
                const usersRef = collection(db, "users");
                const userQuery = query(usersRef, where("uid", "==", currentUser.uid));
                const userSnapshot = await getDocs(userQuery);

                if (userSnapshot.empty) return;

                const userData = userSnapshot.docs[0].data();
                if (userData.role !== "tour guide") return;

                const guideId = userSnapshot.docs[0].id;

                const reservationsRef = collection(db, "reservations");
                const reservationQuery = query(reservationsRef, where("guideId", "==", guideId));
                const reservationSnapshot = await getDocs(reservationQuery);

                const reservationData = await Promise.all(reservationSnapshot.docs.map(async (reservationDoc) => {
                    const reservation = reservationDoc.data();

                    const userRef = doc(db, "users", reservation.userId);
                    const userDoc = await getDoc(userRef);
                    const userInfo = userDoc.exists() ? userDoc.data() : { firstName: "Unknown", lastName: "", email: "N/A" };

                    const locationRef = doc(db, "locations", reservation.locationId);
                    const locationDoc = await getDoc(locationRef);
                    const locationName = locationDoc.exists() ? locationDoc.data().name : "Deleted Location";

                    let activityNames = [];
                    if (reservation.activityIds && Array.isArray(reservation.activityIds)) {
                        const activityPromises = reservation.activityIds.map(async (activityId) => {
                            const activityRef = doc(db, "activities", activityId);
                            const activityDoc = await getDoc(activityRef);
                            return activityDoc.exists() ? activityDoc.data().name : "Deleted Activity";
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
                }));

                setReservations(reservationData);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            }
        };

        fetchReservations();
    }, []);

    const toggleAccordion = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const reservationRef = doc(db, "reservations", id);
            await updateDoc(reservationRef, { status: newStatus });

            setReservations((prev) =>
                prev.map((reservation) =>
                    reservation.id === id ? { ...reservation, status: newStatus } : reservation
                )
            );
            toast.current.show({ severity: 'success', summary: 'Success', detail: `Reservation marked as ${newStatus}`, life: 3000 });
        } catch (error) {
            console.error("Error updating reservation status:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update status', life: 3000 });
        }
    };

    const confirmStatusUpdate = (id, newStatus) => {
        confirmDialog({
            message: `Are you sure you want to mark this reservation as ${newStatus}?`,
            header: 'Confirm Action',
            icon: 'pi pi-exclamation-triangle',
            accept: () => handleUpdateStatus(id, newStatus),
        });
    };

    // Filter reservations based on location, date, and status
    const filteredReservations = reservations.filter(reservation => {
        const matchesLocation = reservation.locationName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = selectedDate ? reservation.date === selectedDate : true;
        const matchesStatus = selectedStatus ? reservation.status === selectedStatus : true;
        return matchesLocation && matchesDate && matchesStatus;
    });

    const sortedReservations = filteredReservations.sort((a, b) => {
        const statusOrder = {
            pending: 1,
            Approved: 2,
            Completed: 3,
            Cancelled: 4, // Optional: you can place cancelled last, or remove it if not needed
        };

        return statusOrder[a.status] - statusOrder[b.status];
    });

    return (
        <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-xl">
            <Toast ref={toast} />
            <ConfirmDialog />
            <h1 className="text-3xl font-extrabold mb-6 text-center" style={{ color: "#0043A8" }}>Your Assigned Reservations</h1>
            <div className="w-full flex gap-4">
                <input
                    type="text"
                    placeholder="Search by location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2 py-1 px-4 border border-gray-300 rounded-lg w-5/6 text-lg"
                />
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mb-2 p-2 border border-gray-300 rounded-lg w-1/6 text-lg"
                    placeholder="Filter by date"
                />
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="mb-2 p-2 border border-gray-300 rounded-lg w-1/6 text-lg"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            {sortedReservations.length === 0 ? (
                <p className="text-center text-gray-600">No reservations found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedReservations.map((reservation) => (
                        <div key={reservation.id} className="border border-gray-300 rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition">
                            {/* Card Header */}
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-xl" style={{ color: "#0043A8" }}>{reservation.locationName}</span>
                                <span className="text-sm text-gray-500">{reservation.date}</span>
                            </div>
                            <div className="mt-4">
                                <img
                                    src={reservation.user.profile_link || 'https://avatar.iran.liara.run/public'}
                                    alt="Tourist"
                                    className="w-36 h-36 rounded-full border-4 mx-auto"
                                    style={{ borderColor: "#0043A8" }}
                                />
                            </div>
                            <div className="mt-4 text-center">
                                <span
                                    className={`px-4 py-2 rounded-full text-white`}
                                    style={{
                                        backgroundColor:
                                            reservation.status === "pending" ? "#FFD200" :
                                            reservation.status === "Approved" ? "#0043A8" :
                                            reservation.status === "Cancelled" ? "#ED1C24" :
                                            reservation.status === "Completed" ? "#009E49" : "#0043A8"
                                    }}
                                >
                                    {reservation.status}
                                </span>
                            </div>

                            {/* Card Content */}
                            <div className="mt-4">
                                <p className="text-gray-600"><strong>Reserved By:</strong> {reservation.user.firstName} {reservation.user.lastName}</p>
                                <p className="text-gray-600"><strong>Email:</strong> {reservation.user.email}</p>
                                <p className="text-gray-600"><strong>Contact Number:</strong> {reservation.user.contactNumber}</p>
                                <p className="text-gray-600"><strong>Activities:</strong> {reservation.activityNames.join(", ") || "None"}</p>
                                <p className="text-gray-600"><strong>Date:</strong> {reservation.date}</p>
                            </div>

                            <div className="mt-6 space-x-4 text-center">
                                {reservation.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => confirmStatusUpdate(reservation.id, "Approved")}
                                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => confirmStatusUpdate(reservation.id, "Cancelled")}
                                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {reservation.status === "Approved" && (
                                    <>
                                        <button
                                            onClick={() => confirmStatusUpdate(reservation.id, "Completed")}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Mark as Completed
                                        </button>
                                        <button
                                            onClick={() => confirmStatusUpdate(reservation.id, "Cancelled")}
                                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReservationList;
