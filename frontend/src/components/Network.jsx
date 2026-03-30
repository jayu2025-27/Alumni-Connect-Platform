import React, { useState } from 'react';
import { networkData } from '../utils/networkData';
import { User } from 'lucide-react'; // Icon for user profiles

const Network = ({ onMessageClick }) => {
  const [filter, setFilter] = useState("");
  const [students, setStudents] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/user/network', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStudents(data.students || []);
          setAlumni(data.alumni || []);
        }
      } catch (error) {
        console.error("Failed to fetch network users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNetwork();
  }, []);

  const getFilteredData = () => {
    if (filter === 'alumni') return alumni;
    if (filter === 'students') return students;
    return [...alumni, ...students];
  };

  const filteredData = getFilteredData();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold text-primary">Network</h1>
        <div className="space-x-4">
          <button
            className={`py-2 px-4 rounded-lg ${!filter ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => setFilter("")}
          >
            All
          </button>
          <button
            className={`py-2 px-4 rounded-lg ${filter === "alumni" ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => setFilter("alumni")}
          >
            Alumni
          </button>
          <button
            className={`py-2 px-4 rounded-lg ${filter === "students" ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => setFilter("students")}
          >
            Students
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((person, index) => (
          <div key={person.id || index} className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 border border-gray-200 hover:shadow-lg relative">
            <div className="flex-shrink-0">
              {person.profilePhoto ? (
                <img src={person.profilePhoto} alt={person.fullName} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">{person.fullName}</h2>
              <p className="text-gray-600">{person.fieldOfStudy || person.jobTitle}</p>
              <p className="text-sm text-gray-500">{person.graduationYear}</p>
              {person.company && (
                <p className="text-sm text-gray-500 font-medium">{person.company}</p>
              )}
              <div className="flex gap-2 mt-2">
                {person.linkedin && (
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm"
                  >
                    LinkedIn
                  </a>
                )}
                <button
                  onClick={() => onMessageClick(person)}
                  className="text-white bg-blue-500 hover:bg-blue-600 text-sm px-3 py-1 rounded"
                >
                  Message
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Network;
