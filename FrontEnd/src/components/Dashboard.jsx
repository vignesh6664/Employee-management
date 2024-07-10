import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [position, setPosition] = useState("");
  const [gender, setGender] = useState("");
  const [course, setCourse] = useState("");
  const [editing, setEditing] = useState(null);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/employees", {
      headers: { Authorization: token },
    });
    const result = response.data;
    setEmployees(result);
    setFiltered(result.sort((a, b) => a.name.localeCompare(b.name)));
  };

  //   const fetchAdmin = async () => {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get("http://localhost:5000/login/", {
  //       headers: { Authorization: token },
  //     });
  //     setAdmin(response.data);
  //   };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (editing) {
      await axios.put(
        `http://localhost:5000/employees/${editing}`,
        { name, email, mobile, position, gender, course },
        {
          headers: { Authorization: token },
        }
      );
    } else {
      await axios.post(
        "http://localhost:5000/employees",
        { name, email, mobile, position, gender, course },
        {
          headers: { Authorization: token },
        }
      );
    }
    setName("");
    setEmail("");
    setMobile("");
    setPosition("");
    setCourse("");
    setGender("");
    // setImage("");
    setEditing(null);
    fetchEmployees();
  };

  const handleEdit = (employee) => {
    setName(employee.name);
    setEmail(employee.email);
    setMobile(employee.mobile);
    setPosition(employee.position);
    setGender(employee.gender);
    setCourse(employee.course);
    // setImage(employee.image);
    setEditing(employee.id);
  };

  const handleSearch = (e) => {
    setFiltered(
      employees.filter((employe) =>
        employe.name.toLowerCase().includes(e.target.value)
      )
    );
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/employees/${id}`, {
      headers: { Authorization: token },
    });
    setName("");
    setEmail("");
    setMobile("");
    setPosition("");
    setCourse("");
    setGender("");
    fetchEmployees();
  };

  return (
    <div>
      <h1 className="text-xl mb-4 text-center font-semibold mt-3 ">
        Welcome To Admin Dashboard
        <hr className="border-4 border-green-500 w-[150px] mt-1 rounded-lg mx-auto" />
      </h1>{" "}
      <div className="-mt-12 mb-3 ml-4">
        <input
          type="text"
          placeholder="Search"
          onChange={handleSearch}
          className="p-1 border border-gray-300 font-normal w-[220px]   rounded-md"
        />
      </div>
      <div className="flex justify-end mr-[120px] -mt-8">
        <p>Total : {employees.length} Employees</p>
      </div>
      <div className="flex justify-end items-center mr-4 -mt-8 mb-2">
        <Link
          to="/login"
          className=" bg-red-500 p-1 rounded-md text-white font-semibold"
        >
          Logout
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="mb-4 bg-yellow-300">
        <div className="grid grid-cols-2 gap-4 ml-2 mr-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            className="p-2 border border-gray-300 mt-2 rounded-md"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="p-2 border border-gray-300 mt-2 rounded-md"
          />
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile No"
            required
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Designation"
            required
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            placeholder="Gender"
            required
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Course"
            required
            className="p-2 border border-gray-300 rounded-md"
          />
          {/* <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image"
            required
            className="p-2 border border-gray-300"
          /> */}
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 mt-4"
        >
          {editing ? "Update Employee" : "Add Employee"}
        </button>
      </form>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Mobile No</th>
            <th className="border p-2">Position</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Course</th>
            {/* <th className="border p-2">Profile</th> */}
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filtered.map((employee) => (
            <tr key={employee.id}>
              <td className="border p-2">{employee.name}</td>
              <td className="border p-2">{employee.email}</td>
              <td className="border p-2">+91 {employee.mobile}</td>
              <td className="border p-2">{employee.position}</td>
              <td className="border p-2">{employee.gender}</td>
              <td className="border p-2">{employee.course}</td>
              {/* <td className="border p-2">{employee.image}</td> */}
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(employee)}
                  className="bg-yellow-500 text-white p-1 mr-2 rounded-md font-bold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="bg-red-500 text-white p-1 rounded-md font-bold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
