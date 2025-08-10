import React, { useState, useEffect } from "react";

function EmployeeForm({ onSubmit, editEmployee }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    if (editEmployee) {
      setName(editEmployee.name || "");
      setAge(editEmployee.age || "");
      setEmployeeId(editEmployee.employeeId || "");
      setDepartment(editEmployee.department || "");
    } else {
      setName("");
      setAge("");
      setEmployeeId("");
      setDepartment("");
    }
  }, [editEmployee]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !age || !employeeId || !department) {
      alert("Please fill all fields");
      return;
    }
    onSubmit({ name, age: Number(age), employeeId, department });
    // Clear form if adding new employee
    if (!editEmployee) {
      setName("");
      setAge("");
      setEmployeeId("");
      setDepartment("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">Select Department</option>
        <option value="Engineering">Engineering</option>
        <option value="HR">HR</option>
        <option value="Sales">Sales</option>
        <option value="Product">Product</option>
        <option value="Marketing">Marketing</option>
        <option value="Finance">Finance</option>
        <option value="Support">Support</option>
        <option value="Operations">Operations</option>
        <option value="Legal">Legal</option>
        <option value="Design">Design</option>
        <option value="Technology">Technology</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {editEmployee ? "Update" : "Add"} Employee
      </button>
    </form>
  );
}

export default EmployeeForm;









