"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase";

const SetupPage = () => {
    const [roles, setRoles] = useState([]);
    const [showAddRoleModal, setShowAddRoleModal] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [roleDescription, setRoleDescription] = useState("");
    const [editRoleId, setEditRoleId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [permissions, setPermissions] = useState({});
    const [selectAll, setSelectAll] = useState(false);

    const permissionsList = {
        "Project Management": [
            "View projects",
            "Create new projects",
            "Edit projects",
            "Delete projects",
            "Export projects as CSV",
        ],
        "Data Management": [
            "View data analytics",
            "Edit data analytics settings",
        ],
        "Budget Management": [
            "View budget details",
            "Edit budget allocations",
        ],
        "User Management": [
            "View all users",
            "Add users",
            "Edit user information",
            "Delete users",
        ],
        "Role Management": [
            "View role permissions",
            "Edit role permissions",
        ],
        "Authentication": [
            "Login",
            "Change personal password",
            "Reset password",
        ],
    };

    const rolesCollectionRef = collection(db, "Roles");

    const fetchRoles = async () => {
        try {
            const data = await getDocs(rolesCollectionRef);
            const rolesList = data.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRoles(rolesList);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleAddOrEditRole = async () => {
        if (!roleName.trim()) return;

        const selectedPermissions = Object.keys(permissions).filter(
            (permission) => permissions[permission]
        );

        try {
            if (editRoleId) {
                const roleDoc = doc(db, "Roles", editRoleId);
                await updateDoc(roleDoc, {
                    name: roleName,
                    description: roleDescription || "No description provided",
                    permissions: selectedPermissions,
                });
                fetchRoles();
            } else {
                await addDoc(rolesCollectionRef, {
                    name: roleName,
                    description: roleDescription || "No description provided",
                    permissions: selectedPermissions,
                });
                fetchRoles();
            }
        } catch (error) {
            console.error("Error saving role:", error);
        }

        setRoleName("");
        setRoleDescription("");
        setPermissions({});
        setEditRoleId(null);
        setSelectAll(false);
        setShowAddRoleModal(false);
    };

    const handleDeleteRole = async (roleId) => {
        try {
            const roleDoc = doc(db, "Roles", roleId);
            await deleteDoc(roleDoc);
            fetchRoles();
        } catch (error) {
            console.error("Error deleting role:", error);
        }
    };

    const handleEditRole = (roleId) => {
        const roleToEdit = roles.find((role) => role.id === roleId);
        if (roleToEdit) {
            setRoleName(roleToEdit.name);
            setRoleDescription(
                roleToEdit.description === "No description provided" ? "" : roleToEdit.description
            );
            const rolePermissions = roleToEdit.permissions || [];
            const updatedPermissions = {};
            Object.keys(permissionsList).flatMap((category) =>
                permissionsList[category].forEach((permission) => {
                    updatedPermissions[permission] = rolePermissions.includes(permission);
                })
            );
            setPermissions(updatedPermissions);
            setEditRoleId(roleId);
            setShowAddRoleModal(true);
        }
    };

    const handleSelectAll = () => {
        const updatedPermissions = {};
        Object.keys(permissionsList).flatMap((category) =>
            permissionsList[category].forEach((permission) => {
                updatedPermissions[permission] = !selectAll;
            })
        );
        setPermissions(updatedPermissions);
        setSelectAll(!selectAll);
    };

    const filteredRoles = roles.filter((role) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Role Management</h1>

            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search roles"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-1/2 px-4 py-2 border rounded-lg"
                />
                <button
                    onClick={() => {
                        setRoleName("");
                        setRoleDescription("");
                        setPermissions({});
                        setEditRoleId(null);
                        setSelectAll(false);
                        setShowAddRoleModal(true);
                    }}
                    className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                >
                    Add Role
                </button>
            </div>

            <div>
                {filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => (
                        <div
                            key={role.id}
                            className="flex flex-col p-4 border rounded-lg mb-2"
                        >
                            <h2 className="font-bold text-lg">{role.name}</h2>
                            <p className="text-sm text-gray-500">{role.description}</p>
                            <h3 className="mt-2 font-bold">Has Access to:</h3>
                            <ul className="list-disc ml-6 text-gray-700">
                                {role.permissions &&
                                    role.permissions.map((permission, index) => (
                                        <li key={index}>{permission}</li>
                                    ))}
                            </ul>
                            <div className="flex space-x-2 mt-4">
                                <button
                                    onClick={() => handleEditRole(role.id)}
                                    className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteRole(role.id)}
                                    className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No roles found.</p>
                )}
            </div>

            {showAddRoleModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">
                                {editRoleId ? "Edit Role" : "Add Role"}
                            </h2>
                            <button
                                onClick={() => {
                                    setRoleName("");
                                    setRoleDescription("");
                                    setPermissions({});
                                    setEditRoleId(null);
                                    setShowAddRoleModal(false);
                                }}
                                className="text-red-500 hover:text-red-700 font-bold"
                            >
                                &times;
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Role Name"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg mb-4"
                        />
                        <textarea
                            placeholder="Role Description (optional)"
                            value={roleDescription}
                            onChange={(e) => setRoleDescription(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg mb-4"
                        />
                        <h3 className="font-bold mb-2">Role Access</h3>
                        <div className="mb-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    className="form-checkbox"
                                />
                                <span>Select All</span>
                            </label>
                        </div>
                        <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                            {Object.entries(permissionsList).map(([category, actions]) => (
                                <div key={category} className="mb-2">
                                    <h4 className="font-semibold">{category}</h4>
                                    {actions.map((action) => (
                                        <label
                                            key={action}
                                            className="flex items-center space-x-2 ml-4"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={permissions[action] || false}
                                                onChange={(e) =>
                                                    setPermissions({
                                                        ...permissions,
                                                        [action]: e.target.checked,
                                                    })
                                                }
                                                className="form-checkbox"
                                            />
                                            <span>{action}</span>
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleAddOrEditRole}
                            className="w-full px-4 py-2 mt-4 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                        >
                            {editRoleId ? "Save Role" : "Add Role"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SetupPage;
