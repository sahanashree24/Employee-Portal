import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = ({ userRole }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", age: "", employeeId: "" });
  const [touched, setTouched] = useState({});
  const [idTaken, setIdTaken] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  // Always invoke hooks before any returns
  useEffect(() => {
    if (userRole !== "admin") {
      navigate("/dashboard", { replace: true });
    }
  }, [userRole, navigate]);

  const employees = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("employees")) || [];
    } catch {
      return [];
    }
  }, []);

  const normalizeId = (v) => v.trim();

  useEffect(() => {
    const id = normalizeId(form.employeeId).toLowerCase();
    if (!id) {
      setIdTaken(false);
      return;
    }
    const dup = employees.some(
      (e) => (e.employeeId || "").toLowerCase() === id
    );
    setIdTaken(dup);
  }, [form.employeeId, employees]);

  const validate = (f) => {
    const errors = {};
    const name = f.name.trim();
    const id = normalizeId(f.employeeId);
    const ageNum = Number(f.age);

    if (!name) errors.name = "Name is required.";
    if (!id) errors.employeeId = "Employee ID is required.";
    if (!f.age) {
      errors.age = "Age is required.";
    } else if (!Number.isInteger(ageNum) || ageNum <= 0) {
      errors.age = "Age must be a positive integer.";
    } else if (ageNum > 120) {
      errors.age = "Please enter a realistic age.";
    }

    if (!errors.employeeId && idTaken) {
      errors.employeeId = "This Employee ID already exists.";
    }

    return errors;
  };

  const errors = useMemo(() => validate(form), [form, idTaken]);
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "age") {
      const next = value === "" ? "" : value.replace(/[^\d]/g, "");
      setForm((f) => ({ ...f, age: next }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));

    if (name === "name" || name === "employeeId") {
      const trimmed = value.trimStart();
      if (trimmed !== value) {
        setForm((f) => ({ ...f, [name]: trimmed }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({ name: true, age: true, employeeId: true });

    const trimmedName = form.name.trim();
    const trimmedId = normalizeId(form.employeeId);
    const ageNumber = Number(form.age);

    const current = JSON.parse(localStorage.getItem("employees")) || [];
    const duplicate = current.find(
      (emp) => (emp.employeeId || "").toLowerCase() === trimmedId.toLowerCase()
    );

    const finalErrors = {
      ...validate({ ...form, name: trimmedName, employeeId: trimmedId }),
      ...(duplicate ? { employeeId: "This Employee ID already exists." } : {}),
    };

    if (Object.keys(finalErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    const newEmployee = {
      id: Date.now(),
      name: trimmedName,
      age: ageNumber,
      employeeId: trimmedId,
      department: "General",
      createdAt: new Date().toISOString(),
    };

    const updated = [...current, newEmployee];
    localStorage.setItem("employees", JSON.stringify(updated));

    setSuccess("Employee added successfully.");
    setTimeout(() => navigate("/dashboard"), 700);
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">Add Employee</h2>

      {success && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 text-green-800 px-3 py-2 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            aria-invalid={touched.name && !!errors.name}
            aria-describedby={touched.name && errors.name ? "name-error" : undefined}
            className={`w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-green-200 ${
              touched.name && errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {touched.name && errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            onBlur={handleBlur}
            min={1}
            max={120}
            aria-invalid={touched.age && !!errors.age}
            aria-describedby={touched.age && errors.age ? "age-error" : undefined}
            className={`w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-green-200 ${
              touched.age && errors.age ? "border-red-500" : "border-gray-300"
            }`}
          />
          {touched.age && errors.age && (
            <p id="age-error" className="mt-1 text-sm text-red-600">
              {errors.age}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="employeeId"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.employeeId && !!errors.employeeId}
            aria-describedby={
              touched.employeeId && errors.employeeId ? "employeeId-error" : undefined
            }
            className={`w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-green-200 ${
              touched.employeeId && errors.employeeId ? "border-red-500" : "border-gray-300"
            }`}
          />
          {touched.employeeId && errors.employeeId && (
            <p id="employeeId-error" className="mt-1 text-sm text-red-600">
              {errors.employeeId}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || submitting}
            className={`px-4 py-2 rounded text-white ${
              !isValid || submitting
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {submitting ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;