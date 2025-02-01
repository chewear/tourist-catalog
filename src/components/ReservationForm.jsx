import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const ReservationForm = () => {
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [contactNumber, setContactNumber] = useState('')
    const [numberOfPersons, setNumberOfPersons] = useState(1)
    const [error, setError] = useState('')

    const handleEndDateChange = (date) => {
        if (date < startDate) {
            setError('End date cannot be before start date')
        } else {
            setError('')
            setEndDate(date)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (endDate < startDate) {
            setError('End date cannot be before start date')
        } else {
            setError('')
            // Handle form submission
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Reservation Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-between gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                            Start Date and Time
                        </label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            showTimeSelect
                            dateFormat="Pp"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                            End Date and Time
                        </label>
                        <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            showTimeSelect
                            dateFormat="Pp"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactNumber">
                        Contact Number
                    </label>
                    <input
                        type="tel"
                        id="contactNumber"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numberOfPersons">
                        Number of Persons
                    </label>
                    <input
                        type="number"
                        id="numberOfPersons"
                        value={numberOfPersons}
                        onChange={(e) => setNumberOfPersons(e.target.value)}
                        min="1"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Captcha
                    </label>
                    <div className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {/* Add your captcha component here */}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Confirm Reservation
                </button>
            </form>
        </div>
    )
}

export default ReservationForm