import React from "react";

const CsvExport = ({ users }) => {
    const handleExport = () => {
        const headers = ["Name", "Email", "Role"];
        const rows = users.map(({ name, email, role }) => [name, email, role]);
        const csvContent = [headers, ...rows]
            .map((row) => row.join(","))
            .join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "users.csv";
        link.click();
    };

    return (
        <button
            onClick={handleExport}
            className="bg-gray-800 text-white px-4 py-2 rounded-md"
        >
            Export to CSV
        </button>
    );
};

export default CsvExport;
