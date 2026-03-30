import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/students');
            const studentData = response.data && Array.isArray(response.data.students) ? response.data.students : [];
            setStudents(studentData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    if (loading) {
        return <p>Loading students...</p>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-secondary mb-4">Students</h2>
            {students.length === 0 ? (
                <p>No registered students found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-primary text-white">
                                <th className="border border-gray-300 py-2 px-4">ID</th>
                                <th className="border border-gray-300 py-2 px-4">Name</th>
                                <th className="border border-gray-300 py-2 px-4">Email</th>
                                <th className="border border-gray-300 py-2 px-4">Graduation Year</th>
                                <th className="border border-gray-300 py-2 px-4">Course</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} className="text-center">
                                    <td className="border border-gray-300 py-2 px-4">{student.id}</td>
                                    <td className="border border-gray-300 py-2 px-4">{student.fullName}</td>
                                    <td className="border border-gray-300 py-2 px-4">{student.collegeEmail}</td>
                                    <td className="border border-gray-300 py-2 px-4">{student.graduationYear}</td>
                                    <td className="border border-gray-300 py-2 px-4">{student.course}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Students;
