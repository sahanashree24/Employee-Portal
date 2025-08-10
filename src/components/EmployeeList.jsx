import React from "react";

const EmployeeList = ({ employees, onEdit, onDelete }) => {
  if (!employees || employees.length === 0) {
    return <p className="text-gray-600">No employees found.</p>;
  }

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Age</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Employee ID</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Department</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp, index) => (
          <tr key={emp.id}>
            <td className="border border-gray-300 px-4 py-2">{emp.name}</td>
            <td className="border border-gray-300 px-4 py-2">{emp.age}</td>
            <td className="border border-gray-300 px-4 py-2">{emp.employeeId}</td>
            <td className="border border-gray-300 px-4 py-2">{emp.department}</td>
            <td className="border border-gray-300 px-4 py-2 space-x-2">
              <button
                onClick={() => onEdit(emp.id)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(emp.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeeList;











