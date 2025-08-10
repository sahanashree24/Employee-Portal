import React, { useState, useEffect, useRef, useCallback } from "react";

const generateDummyEmployees = () => {
  const departments = [
    "Engineering", "HR", "Sales", "Product", "Marketing",
    "Finance", "Support", "Operations", "Legal", "Design"
  ];
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    age: 20 + (i % 30),
    employeeId: `E${(i + 1).toString().padStart(3, "0")}`,
    department: departments[i % departments.length]
  }));
};

const DUMMY_EMPLOYEES = generateDummyEmployees();

const Modal = ({ children, onClose }) => {
  const modalRef = useRef();
  const handleOutsideClick = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOutsideClick]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const Dashboard = ({ userRole }) => {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : DUMMY_EMPLOYEES;
  });

  const [detailsId, setDetailsId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", age: "", employeeId: "" });
  const [editError, setEditError] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", age: "", employeeId: "" });
  const [addError, setAddError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;
  const [notification, setNotification] = useState("");

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Load the form when opening details
  useEffect(() => {
    if (detailsId !== null) {
      const emp = employees.find((e) => e.id === detailsId);
      if (emp) {
        setEditForm({
          name: emp.name || "",
          age: emp.age ?? "",
          employeeId: emp.employeeId || ""
        });
        setIsEditing(false);
        setEditError("");
      }
    } else {
      setIsEditing(false);
      setEditError("");
    }
  }, [detailsId, employees]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const updatedEmployees = employees.filter((emp) => emp.id !== id);
      setEmployees(updatedEmployees);
      setDetailsId(null);
      showNotification("Employee deleted successfully!");
      if ((currentPage - 1) * employeesPerPage >= updatedEmployees.length) {
        setCurrentPage((p) => Math.max(p - 1, 1));
      }
    }
  };

  const validateCommon = (form, excludeId = null) => {
    const name = form.name.trim();
    const employeeId = form.employeeId.trim();
    const ageNum = Number(form.age);

    if (!name) return "Name is required.";
    if (!employeeId) return "Employee ID is required.";
    if (!Number.isFinite(ageNum) || ageNum <= 0) return "Age must be a positive number.";
    const duplicate = employees.some(
      (e) => e.employeeId.toLowerCase() === employeeId.toLowerCase() && e.id !== excludeId
    );
    if (duplicate) return "Employee ID must be unique.";

    return "";
  };

  const handleSaveEdit = () => {
    const err = validateCommon(editForm, detailsId);
    if (err) {
      setEditError(err);
      return;
    }
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === detailsId
          ? {
              ...e,
              name: editForm.name.trim(),
              age: Number(editForm.age),
              employeeId: editForm.employeeId.trim()
            }
          : e
      )
    );
    setIsEditing(false);
    setEditError("");
    showNotification("Employee updated successfully!");
  };

  const handleOpenAdd = () => {
    setAddForm({ name: "", age: "", employeeId: "" });
    setAddError("");
    setIsAddOpen(true);
  };

  const handleAdd = () => {
    const err = validateCommon(addForm, null);
    if (err) {
      setAddError(err);
      return;
    }
    const newId = employees.length
      ? Math.max(...employees.map((e) => e.id)) + 1
      : 1;
    const newEmployee = {
      id: newId,
      name: addForm.name.trim(),
      age: Number(addForm.age),
      employeeId: addForm.employeeId.trim(),
      department: "General" // default to keep UI consistent without extra fields
    };
    setEmployees((prev) => [newEmployee, ...prev]);
    setIsAddOpen(false);
    setAddError("");
    setSearchTerm(""); // optional: clear search to reveal new employee in list
    setDepartmentFilter(""); // optional
    setCurrentPage(1);
    showNotification("Employee added successfully!");
  };

  const handleCloseDetails = () => {
    if (isEditing) {
      const emp = employees.find((e) => e.id === detailsId);
      const changed =
        emp &&
        (emp.name !== editForm.name ||
          String(emp.age) !== String(editForm.age) ||
          emp.employeeId !== editForm.employeeId);
      if (changed && !window.confirm("Discard unsaved changes?")) return;
    }
    setDetailsId(null);
  };

  const handleCloseAdd = () => {
    if (
      addForm.name.trim() ||
      String(addForm.age).trim() ||
      addForm.employeeId.trim()
    ) {
      if (!window.confirm("Discard new employee details?")) return;
    }
    setIsAddOpen(false);
  };

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      emp.name.toLowerCase().includes(term) ||
      emp.employeeId.toLowerCase().includes(term) ||
      (emp.department || "").toLowerCase().includes(term);

    const matchesDepartment = departmentFilter
      ? (emp.department || "General") === departmentFilter
      : true;

    return matchesSearch && matchesDepartment;
  });

  const currentEmployees = filteredEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const uniqueDepartments = [
    ...new Set(employees.map((emp) => emp.department || "General"))
  ];

  return (
    <div className="p-4 sm:p-6 relative">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-md z-50">
          {notification}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4 text-center sm:text-left">
        Employee Dashboard
      </h1>

      {userRole === "admin" && (
        <div className="mb-4">
          <button
            onClick={handleOpenAdd}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Add Employee
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded mb-4 sm:mb-0 w-full sm:w-1/2"
        />
        <select
          value={departmentFilter}
          onChange={(e) => {
            setDepartmentFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full sm:w-1/4"
        >
          <option value="">All Departments</option>
          {uniqueDepartments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {currentEmployees.length === 0 ? (
        <p className="mt-4 text-gray-600">No employees found.</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse border border-gray-300 min-w-[500px]">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100 text-left">Name</th>
                <th className="border p-2 bg-gray-100">Details</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-100">
                  <td className="border p-2">{emp.name}</td>
                  <td className="border p-2 text-center">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setDetailsId(emp.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded mb-2 ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Details Modal */}
      {detailsId !== null && (
        <Modal onClose={handleCloseDetails}>
          {(() => {
            const emp = employees.find((e) => e.id === detailsId);
            if (!emp) return null;

            return (
              <div>
                <h2 className="text-xl font-bold mb-4">
                  {isEditing ? "Edit Employee" : emp.name}
                </h2>

                {isEditing ? (
                  <div className="space-y-3">
                    {editError && (
                      <div className="text-red-600 text-sm">{editError}</div>
                    )}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, name: e.target.value }))
                        }
                        className="border rounded w-full p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editForm.age}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, age: e.target.value }))
                        }
                        className="border rounded w-full p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        value={editForm.employeeId}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            employeeId: e.target.value
                          }))
                        }
                        className="border rounded w-full p-2"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          const empCurrent = employees.find(
                            (e) => e.id === detailsId
                          );
                          if (empCurrent) {
                            setEditForm({
                              name: empCurrent.name,
                              age: empCurrent.age,
                              employeeId: empCurrent.employeeId
                            });
                          }
                          setEditError("");
                          setIsEditing(false);
                        }}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>
                      <strong>Employee ID:</strong> {emp.employeeId}
                    </p>
                    <p>
                      <strong>Department:</strong> {emp.department || "General"}
                    </p>
                    <p>
                      <strong>Age:</strong> {emp.age}
                    </p>

                    {userRole === "admin" && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Add Modal */}
      {isAddOpen && userRole === "admin" && (
        <Modal onClose={handleCloseAdd}>
          <div>
            <h2 className="text-xl font-bold mb-4">Add Employee</h2>
            {addError && <div className="text-red-600 text-sm mb-2">{addError}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="border rounded w-full p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  min="1"
                  value={addForm.age}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, age: e.target.value }))
                  }
                  className="border rounded w-full p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={addForm.employeeId}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, employeeId: e.target.value }))
                  }
                  className="border rounded w-full p-2"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleAdd}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Add
              </button>
              <button
                onClick={handleCloseAdd}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Department defaults to "General" to keep the form minimal.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;











































