"use client";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { Chart } from "chart.js/auto";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase";
import { getAuth, signOut } from "firebase/auth"; // Firebase imports
import PerformanceMetrics from './PerformanceMetrics';

function Dashboard() {
  //Test Data and Metrics
  const performanceData = [
    {
      label: 'Total Projects',
      data: [80, 85, 90, 95, 100],
      isPositive: true,
      percentage: '+10%',
      days: '7 days'
    },
    {
      label: 'Average Time on Page',
      data: [2, 2.5, 2.3, 2.8, 3],
      isPositive: true,
      percentage: '+15%',
      days: '7 days'
    }
  ];
  //End of Test Data
  const [years, setYears] = useState([]);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(`${currentYear}`);

  const [contentEnabled, setContentEnabled] = useState(false);
  const [data, setData] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [showModalForm, setShowModalForm] = useState(false);
  const [id] = useState(1);
  const [isSource, setSource] = useState("");
  const [division, setDivision] = useState("");
  const [brand, setBrand] = useState("");
  const [brandCategory, setBrandCategory] = useState("");
  const [quarter, setQuarter] = useState("");
  const [platform, setPlatform] = useState("");
  const [sow, setSow] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [link, setLink] = useState("");
  const [customSource, setCustomSource] = useState("");
  const [customBrandCategory, setCustomBrandCategory] = useState("");
  const [customPlatform, setCustomPlatform] = useState("");
  const [customSow, setCustomSow] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [bundling, setBundling] = useState([{ SOW: null, Content: null }]);

  const platformChartRef = useRef(null);
  const statusChartRef = useRef(null);
  const quarterChartRef = useRef(null);
  const platformCanvasRef = useRef(null);
  const statusCanvasRef = useRef(null);
  const quarterCanvasRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const auth = getAuth();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  //Checking Authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/");
      } else {
        setIsAuthenticated(true);
        const fetchData = async () => {
          const { db } = await import("@/app/firebase.jsx");

          setLoading(true);
          const unsubscribeData = onSnapshot(
            collection(db, `${process.env.NEXT_PUBLIC_COLLECTION}`),
            orderBy("Date", "desc"),
            (snapshot) => {
              const data = snapshot.docs
                .map((doc) => ({
                  id: doc.id,
                }))
                .filter((item) => {
                  const [day, month, year] = item.Date.split(" ")[0]
                    .split("/")
                    .map(Number);
                  const itemDate = new Date(year, month - 1, day);

                  const itemYear = itemDate.getFullYear();

                  return itemYear === parseInt(selectedYear);
                });

              const sortedData = data.sort((a, b) => {
                const dateA = new Date(
                  a.Date.split(" ")[1].split("/").reverse().join("-") +
                  " " +
                  a.Date.split(" ")[0]
                );
                const dateB = new Date(
                  b.Date.split(" ")[1].split("/").reverse().join("-") +
                  " " +
                  b.Date.split(" ")[0]
                );
                return dateB - dateA;
              });

              setData(sortedData);

              // Platform Chart
              if (platformChartRef.current) {
                platformChartRef.current.destroy();
              }
              if (platformCanvasRef.current) {
                const platforms = ["instagram", "TikTok", "Youtube", "website"];
                const dataPlatform = platforms.reduce((acc, platform) => {
                  acc[platform] = 0;
                  return acc;
                }, {});
                let otherCount = 0;

                data.forEach((item) => {
                  const individualPlatforms = item.Platform.split(", ").map(
                    (p) => p.trim()
                  );
                  individualPlatforms.forEach((platform) => {
                    if (platforms.includes(platform)) {
                      dataPlatform[platform] += 1;
                    } else {
                      otherCount += 1;
                    }
                  });
                });
                dataPlatform["cemacem"] = otherCount;

                const platformCtx = platformCanvasRef.current.getContext("2d");
                platformChartRef.current = new Chart(platformCtx, {
                  type: "doughnut",
                  data: {
                    labels: Object.keys(dataPlatform),
                    datasets: [
                      {
                        data: Object.values(dataPlatform),
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 206, 86, 0.2)",
                          "rgba(153, 102, 255, 0.2)",
                          "rgba(75, 192, 192, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgb(153, 102, 255)",
                          "rgba(75, 192, 192, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  },
                  options: {
                    responsive: true,
                    aspectRatio: 2,
                    plugins: {
                      legend: {
                        position: "right",
                      },
                    },
                    scales: {
                      y: {
                        display: false,
                      },
                    },
                  },
                });
              }

              // Status Chart
              if (statusChartRef.current) {
                statusChartRef.current.destroy();
              }
              if (statusCanvasRef.current) {
                const dataStatus = {
                  Development: data.filter(
                    (item) => item.Status === "Development"
                  ).length,
                  "Content Proposed": data.filter(
                    (item) => item.Status === "Content Proposed"
                  ).length,
                  "On Going": data.filter((item) => item.Status === "On Going")
                    .length,
                  Editing: data.filter((item) => item.Status === "Editing")
                    .length,
                  Delivered: data.filter((item) => item.Status === "Delivered")
                    .length,
                  Published: data.filter((item) => item.Status === "Published")
                    .length,
                };

                const statusCtx = statusCanvasRef.current.getContext("2d");
                statusChartRef.current = new Chart(statusCtx, {
                  type: "bar",
                  data: {
                    labels: Object.keys(dataStatus),
                    datasets: [
                      {
                        data: Object.values(dataStatus),
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 206, 86, 0.2)",
                          "rgba(75, 192, 192, 0.2)",
                          "rgba(153, 102, 255, 0.2)",
                          "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(153, 102, 255, 1)",
                          "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  },
                  options: {
                    responsive: true,
                    plugins: {
                      legend: false,
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  },
                });
              }

              // Quarter Chart
              if (quarterChartRef.current) {
                quarterChartRef.current.destroy();
              }
              if (quarterCanvasRef.current) {
                const dataQuarter = {
                  Q1: data.filter((item) => item.Quarter === "Q1").length,
                  Q2: data.filter((item) => item.Quarter === "Q2").length,
                  Q3: data.filter((item) => item.Quarter === "Q3").length,
                  Q4: data.filter((item) => item.Quarter === "Q4").length,
                };

                const quarterCtx = quarterCanvasRef.current.getContext("2d");
                quarterChartRef.current = new Chart(quarterCtx, {
                  type: "line",
                  data: {
                    labels: Object.keys(dataQuarter),
                    datasets: [
                      {
                        data: Object.values(dataQuarter),
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 206, 86, 0.2)",
                          "rgba(75, 192, 192, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  },
                  options: {
                    responsive: true,
                    plugins: {
                      legend: false,
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  },
                });
              }

              setLoading(false);
            }
          );
          return () => unsubscribeData();
        };
        fetchData();
      }
    });

    const yearOptions = [];
    for (let i = 1; i < 6; i++) {
      yearOptions.push(currentYear - i);
    }
    setYears(yearOptions);

    return () => unsubscribe();
  }, [router, currentYear, selectedYear]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setCurrentPage(1);
  };

  const addBundlingEntry = () => {
    if (bundling.length < 5) {
      setBundling([...bundling, { SOW: "", Content: "" }]);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Limit Reached",
        text: "You can only add up to 5 bundling entries.",
      });
    }
  };

  const removeBundlingEntry = (index) => {
    setBundling(bundling.filter((i) => i === index));
  };

  const handleBundlingChange = (index, field, value) => {
    const updatedEntries = bundling.map((entry, i) => i === index ? { ...entry, [field]: value } : entry
    );
    setBundling(updatedEntries);
  };

  const getStatusClasses = (Status) => {
    switch (Status) {
      case "Development":
        return "bg-[#FFD700]/10 text-[#FFD700]";
      case "Content Proposed":
        return "bg-[#FF8C00]/10 text-[#FF8C00]";
      case "On Going":
        return "bg-[#1E90FF]/10  text-[#1E90FF]";
      case "Editing":
        return "bg-[#FFA500]/10  text-[#FFA500]";
      case "Delivered":
        return "bg-[#cd326b]/10  text-[#cd326b]";
      default:
        return "bg-[#008000]/10  text-[#008000]";
    }
  };

  const deleteDataById = async (id) => {
    const { db } = await import("@/app/firebase.jsx");

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Yakin lo??",
      text: "Mau hapus nih data..?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Iyaaa hapus!",
      cancelButtonText: "Ga jadi deh",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        Swal.fire({
          title: "Processing...",
          text: "Sabar ye sabarrr!!",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });
        const res = doc(
          db,
          `${process.env.NEXT_PUBLIC_COLLECTION}`,
          String(id)
        );
        await deleteDoc(res);
        setData(data.filter((item) => item.id !== id));
      },
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Sip sudah ke hapus datanya ya.",
        imageUrl: "https://ik.imagekit.io/bg2tcoygm/okmas-bry.jpeg?updatedAt=1724386481864&tr=n-ik_ml_thumbnail&ik-t=1724386877&ik-s=03d45975f41bb74c6d4fbf6fc7e0f8eb584791ab&ik-auth-version=ml",
        imageWidth: 400,
        imageHeight: 400,
        imageAlt: "okmas-bry",
      });
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const fullDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    return {
      displayDate: `${day}/${month}/${year}`,
      fullDateTime: fullDateTime,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const finalPlatform = platform.includes("Apa kek yang lain")
      ? [...platform.map((p) => p !== "Apa kek yang lain"), customPlatform]
      : platform;

    const finalBundling = [...bundling];
    if (sow === "Other") {
      if (finalBundling.length > 0) {
        finalBundling[0] = {
          ...finalBundling[0],
          sow: customSow,
          content: content,
        };
      } else {
        finalBundling[0] = {
          sow: customSow,
          content: content,
        };
      }
    }

    const date = currentId
      ? data.find((item) => item.id === currentId)?.Date
      : formatDate(new Date()).fullDateTime;

    const form = {
      Source: isSource,
      Division: division,
      Brand: brand,
      "Brand Category": brandCategory,
      Quarter: quarter,
      Platform: finalPlatform.join(", "),
      Status: status,
      Date: date,
      Link: link,
      Bundling: finalBundling,
    };

    const { db } = await import("@/app/firebase");

    Swal.fire({
      title: "Processing...",
      text: "Sabar ye sabarrr!!",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    if (currentId) {
      const docRef = doc(
        db,
        `${process.env.NEXT_PUBLIC_COLLECTION}`,
        String(currentId)
      );
      await updateDoc(docRef, form);
      const updatedData = data.map((item) => item.id === currentId ? { id: currentId, ...form } : item
      );
      setData(updatedData);
      Swal.fire({
        title: "Updated!",
        text: "Sip sudah ke update ya.",
        imageUrl: "https://ik.imagekit.io/bg2tcoygm/okmas-bry.jpeg?updatedAt=1724386481864&tr=n-ik_ml_thumbnail&ik-t=1724386877&ik-s=03d45975f41bb74c6d4fbf6fc7e0f8eb584791ab&ik-auth-version=ml",
        imageWidth: 400,
        imageHeight: 400,
        imageAlt: "okmas-bry",
      });
    } else {
      const docRef = await addDoc(
        collection(db, `${process.env.NEXT_PUBLIC_COLLECTION}`),
        form
      );
      const newEntry = { id: docRef.id, ...from };
      setData([newEntry, ...data]);
      Swal.fire({
        title: "Added!",
        text: "Sip sudah ke tambah ya.",
        imageUrl: "https://ik.imagekit.io/bg2tcoygm/okmas-bry.jpeg?updatedAt=1724386481864&tr=n-ik_ml_thumbnail&ik-t=1724386877&ik-s=03d45975f41bb74c6d4fbf6fc7e0f8eb584791ab&ik-auth-version=ml",
        imageWidth: 400,
        imageHeight: 400,
        imageAlt: "okmas-bry",
      });
    }

    resetForm();
    setShowModalForm(false);
  };

  const handleEdit = (item) => {
    setCurrentId(item.id);
    setSource(item.Source || "");
    setDivision(item.Division || "");
    setBrand(item.Brand || "");

    /* Brand Category */
    setBrandCategory(item["Brand Category"] || "");

    /* Quarter */
    setQuarter(item.Quarter || "");

    /* Platform */
    const validPlatforms = [
      "Youtube",
      "TikTok",
      "Instagram",
      "Website",
      "Apa kek yang lain",
    ];
    const itemPlatforms = item.Platform.split(", ").filter(Boolean);

    const otherPlatform = itemPlatforms.find(
      (p) => !validPlatforms.includes(p)
    );

    setPlatform(itemPlatforms.filter((p) => p !== otherPlatform));

    if (otherPlatform) {
      setPlatform((prevPlatforms) => [...prevPlatforms, "Apa kek yang lain"]);
      setCustomPlatform(otherPlatform);
    } else {
      setCustomPlatform("");
    }

    /* Bundling */
    if (item.Bundling && item.Bundling.length > 1) {
      setBundling(item.Bundling);
      setSow("Bundling");
    } else if (item.Bundling && item.Bundling[0]) {
      setSow("Other");
      setCustomSow(item.Bundling[0].SOW);
      setContent(item.Bundling[0].Content);
      setContentEnabled(true);
    } else {
      setBundling([]);
    }

    setStatus(item.Status || "");
    setLink(item.Link || "");

    setShowModalForm(true);
  };

  const resetForm = () => {
    setCurrentId(null);
    setSource("");
    setCustomSource("");
    setDivision("");
    setBrand("");
    setBrandCategory("");
    setCustomBrandCategory("");
    setQuarter("");
    setPlatform("");
    setCustomPlatform("");
    setSow("");
    setCustomSow("");
    setContent("");
    setCustomContent("");
    setStatus("");
    setLink("");
    setBundling([{ SOW: "", Content: "" }]);
    setContentEnabled(false);
  };

  const convertToCSV = (data) => {
    const header = [
      "No",
      "Source",
      "Division",
      "Brand",
      "Brand Category",
      "Quarter",
      "Platform",
      "SOW",
      "Content",
      "Status",
      "Date",
      "Link",
    ];
    const sortedData = data.sort((a, b) => a.id - b.id);
    const rows = [
      header,
      ...sortedData.map((item, index) => [
        index + 1,
        item.Source || "-",
        item.Division || "-",
        item.Brand || "-",
        item["Brand Category"] || "-",
        item.Quarter || "-",
        `"${item.Platform}"` || "-",
        `"${item.Bundling?.map((x) => x.SOW).join(", ")}"` || "-",
        `"${item.Bundling?.map((y) => y.Content).join(", ")}"` || "-",
        item.Status || "-",
        item.Date.split(" ")[0] || "-",
        item.Link || "-",
      ]),
    ];

    return rows.map((row) => row.join(",")).join("\n");
  };

  const downloadCSV = () => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSearch = (term) => {
    setSearchQuery(term.toLowerCase());
  };

  const filteredData = data.filter((item) => item.Brand.toLowerCase().includes(searchQuery)
  );

  const totalPage = Math.ceil(data.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev * itemsPerPage < data.length ? prev + 1 : prev
    );
  };

  // Handlers for Platform
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setPlatform([...platform, value]);
    } else {
      if (value === "Apa kek yang lain") {
        setCustomPlatform("");
      }
      setPlatform(platform.filter((p) => p !== value));
    }
  };

  const handleCustomChangePlatform = (event) => {
    const value = event.target.value;
    setCustomPlatform(value);

    if (value.trim() === "" && platform.includes("Apa kek yang lain")) {
      return;
    }
  };

  // Handlers for SOW
  const handleSelectChangeSow = (e) => {
    const value = e.target.value;
    setSow(value);

    if (value === "Other") {
      setContentEnabled(true);
    } else {
      setContentEnabled(false);
      setContent("");
    }

    if (value !== "Other") {
      setCustomSow("");
    }
  };

  const handleCustomChangeSow = (e) => {
    const value = e.target.value;
    setCustomSow(value);
    if (value.trim() === "") {
      setSow("");
      setContentEnabled(false);
    } else {
      setSow("Other");
      setContentEnabled(true);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </header>

        {/* Replace this with your existing dashboard content */}
        {/* Performance Metrics Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Performance</h2>
          <div className="flex flex-wrap gap-4">
            {performanceData.map((metric, index) => (
              <PerformanceMetrics
                key={index}
                data={metric.data}
                label={metric.label}
                isPositive={metric.isPositive}
                percentage={metric.percentage}
                days={metric.days}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
      <section className="min-h-dvh bg-[#003285] flex flex-col  gap-3 p-10 ">
        {/* Card */}
        <div className="flex flex-col gap-3 bg-white p-8 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {/* Platform */}
            <div className="shadow-xl rounded-xl w-full min-h-2 flex flex-col gap-4 p-8">
              <h1 className="text-xl font-bold text-gray-400">Platform</h1>
              <canvas ref={platformCanvasRef}></canvas>
            </div>
            {/* Status */}
            <div className="shadow-xl rounded-xl w-full min-h-2 flex flex-col gap-4 p-8">
              <h1 className="text-xl font-bold text-gray-400">Status</h1>
              <canvas ref={statusCanvasRef}></canvas>
            </div>
            {/* Quarter */}
            <div className="shadow-xl rounded-xl w-full min-h-2 flex flex-col gap-4 p-8">
              <h1 className="text-xl font-bold text-gray-400">Quarter</h1>
              <canvas ref={quarterCanvasRef}></canvas>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-4 self-end px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
        {/* Card end */}

        <div className="bg-white min-h-2 p-8 rounded-xl flex flex-col ">
          {/*Card Table */}
          <div className="w-full flex gap-4 justify-between items-center">
            <div className="flex flex-col gap-2 ">
              <h1 className="text-2xl font-bold cursor-default">
                Project Summary
              </h1>
              <div className="flex gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-default ">
                <p className=" text-xl ">
                  Community:{" "}
                  {data.filter((item) => item.Division === "Community").length}{" "}
                  |
                </p>
                <p className=" text-xl ">
                  Marketing:{" "}
                  {data.filter((item) => item.Division === "Marketing").length}{" "}
                  |
                </p>
                <p className=" text-xl ">Total: {data.length}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 flex gap-3 bg-blue-500 rounded-md text-white transition-all duration-300 hover:bg-blue-700"
                  onClick={downloadCSV}
                >
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m2.665 9H6.647A1.647 1.647 0 0 1 5 15.353v-1.706A1.647 1.647 0 0 1 6.647 12h1.018M16 12l1.443 4.773L19 12m-6.057-.152-.943-.02a1.34 1.34 0 0 0-1.359 1.22 1.32 1.32 0 0 0 1.172 1.421l.536.059a1.273 1.273 0 0 1 1.226 1.718c-.2.571-.636.754-1.337.754h-1.13" />
                  </svg>
                  Export CSV
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 flex gap-3 rounded-md text-white transition-all duration-300 hover:bg-blue-700"
                  onClick={() => setShowModalForm(true)}
                >
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14m-7 7V5" />
                  </svg>
                  Add new project
                </button>
              </div>
              <div className="flex px-4 py-3 rounded-lg border-2 overflow-hidden ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 192.904 192.904"
                  width="16px"
                  className="fill-gray-600 mr-3 rotate-90"
                >
                  <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
                </svg>
                <input
                  type="search"
                  placeholder="Search Brand..."
                  className="w-full outline-none bg-transparent text-gray-600 text-sm"
                  onChange={(e) => handleSearch(e.target.value)} />
              </div>
            </div>
          </div>
          {/* Card table end */}

          {/* Table */}
          <div className="flex justify-between items-center bg-white/90 py-2 mt-[7px]">
            <h1 className="text-xl font-bold">Current Year: {currentYear}</h1>

            <div className="flex justify-center items-center text-gray-500 pl-2 rounded-lg border-2 gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
              </svg>

              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="border-none w-full h-full py-3 focus:outline-none min-w-10 flex justify-center items-center pr-2"
              >
                <option value="all">All</option>
                <option selected defaultValue={currentYear} value={currentYear}>
                  Current year
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-black/90 text-white">
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Source</th>
                  <th className="px-4 py-2">Division</th>
                  <th className="px-4 py-2">Brand</th>
                  <th className="px-4 py-2">Brand Category</th>
                  <th className="px-4 py-2">Quarter</th>
                  <th className="px-4 py-2">Platform</th>
                  <th className="px-4 py-2">SOW</th>
                  <th className="px-4 py-2">Content</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Link</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {loading ? (
                  <tr>
                    <td colSpan="13" className="px-4 py-2 text-gray-700">
                      Waiting...
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="13" className="px-4 py-2 text-gray-700">
                      No data
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        {(currentPage - 1) * itemsPerPage + index + 1}.
                      </td>
                      <td className="px-4 py-2">{item.Source || "-"}</td>
                      <td className="px-4 py-2">{item.Division || "-"}</td>
                      <td className="px-4 py-2">{item.Brand || "-"}</td>
                      <td className="px-4 py-2">
                        {item["Brand Category"] || "-"}
                      </td>
                      <td className="px-4 py-2">{item.Quarter || "-"}</td>
                      <td className="px-4 py-2">{item.Platform || "-"}</td>
                      <td className="px-4 py-2">
                        {item.SOW ||
                          item.Bundling?.map((x) => x.SOW).join(", ") ||
                          "-"}
                      </td>
                      <td className="px-4 py-2">
                        {item.Content ||
                          item.Bundling?.map((y) => y.Content).join(", ") ||
                          "-"}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-4 py-2 rounded-lg flex justify-center items-center ${getStatusClasses(
                            item.Status || "-"
                          )}`}
                        >
                          {item.Status || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-2">{item.Date.split(" ")[0]}</td>
                      <td className="px-4 py-2">
                        <a href={item.Link} target="_blank">
                          {item.Link}
                        </a>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex justify-center items-center">
                          <button
                            className="px-4 py-2 flex gap-2 bg-yellow-400 rounded-md text-white mr-3 transition-all duration-300 hover:bg-yellow-500"
                            onClick={() => handleEdit(item)}
                          >
                            <svg
                              className="w-6 h-6 text-gray-800 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            className="px-4 py-2 flex gap-2 bg-red-500 rounded-md text-white transition-all duration-300 hover:bg-red-700"
                            onClick={() => deleteDataById(item.id)}
                          >
                            <svg
                              className="w-6 h-6 text-gray-800 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Table end */}

          {/* Pagination */}
          <div className="flex items-center justify-center pb-4 lg:px-0 sm:px-6 px-4">
            <div className=" w-full  flex items-center justify-between border-t border-gray-200">
              <div
                className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer"
                onClick={handlePrevious}
              >
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 14 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.1665 4H12.8332"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeline="round" />
                  <path
                    d="M1.1665 4L4.49984 7.33333"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeline="round" />
                  <path
                    d="M1.1665 4.00002L4.49984 0.666687"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeline="round" />
                </svg>
                <p className="text-sm ml-3 font-medium leading-none ">
                  Previous
                </p>
              </div>
              <div className="sm:flex hidden">
                <p className="text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2">
                  Page {currentPage} of {totalPage}
                </p>
              </div>
              <div
                className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer"
                onClick={handleNext}
              >
                <p className="text-sm font-medium leading-none mr-3">Next</p>
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 14 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.1665 4H12.8332"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeline="round" />
                  <path
                    d="M9.5 7.33333L12.8333 4"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeline="round" />
                  <path
                    d="M9.5 0.666687L12.8333 4.00002"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeline="round" />
                </svg>
              </div>
            </div>
          </div>
          {/* Pagination end */}
        </div>

        {/* Form */}
        {showModalForm && (
          <div className="fixed  inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 ">
            <div className="absolute min-w-[70%] max-h-[90%] overflow-y-auto p-8  bg-white rounded-xl ">
              <div className="flex justify-between mb-4">
                <h1 className="text-2xl ">
                  Form {currentId ? "Update Data" : "Add Data"}
                </h1>
                <div
                  onClick={() => {
                    setShowModalForm(false);
                    resetForm();
                  } }
                  className="group flex items-center gap-2 cursor-pointer group justify-end duration-300 transition-all"
                >
                  <h1 className="text-md group-hover:text-gray-600 ">Close</h1>
                  <svg
                    className="w-6 h-6 group-hover:text-gray-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fillRule="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18 17.94 6M18 18 6.06 6" />
                  </svg>
                </div>
              </div>
              <form
                action=""
                onSubmit={handleSubmit}
                className="flex flex-col "
              >
                {/* Source */}
                <label htmlFor="Source">Source</label>
                <select
                  name="Source"
                  value={isSource || ""}
                  onChange={(e) => setSource(e.target.value)}
                  className="bg-gray-200 rounded-md mt-2 mb-4 py-[9px] px-2"
                  required
                >
                  <option value="" className="text-gray-500">
                    Choose one
                  </option>
                  <option value="Inbound">Inbound</option>
                  <option value="Outbound">Outbound</option>
                </select>

                {/* Division */}
                <label htmlFor="Division">Division</label>
                <select
                  name="Division"
                  value={division || ""}
                  onChange={(e) => setDivision(e.target.value)}
                  className="bg-gray-200 rounded-md mt-2 mb-4 py-[9px] px-2"
                  required
                >
                  <option value="" className="text-gray-500">
                    Choose one
                  </option>
                  <option value="Community">Community</option>
                  <option value="Marketing">Marketing</option>
                </select>

                {/* Brand */}
                <label htmlFor="Brand">Brand</label>
                <input
                  type="text"
                  value={brand || ""}
                  onChange={(e) => setBrand(e.target.value)}
                  name="Brand"
                  id="Brand"
                  className="bg-gray-200 rounded-md mt-2 mb-4 p-2"
                  required />

                {/* Brand Category */}
                <label htmlFor="BrandCategory">Brand Category</label>
                <input
                  type="text"
                  value={brandCategory || ""}
                  onChange={(e) => setBrandCategory(e.target.value)}
                  name="Brand Category"
                  id="Brand Category"
                  className="bg-gray-200 rounded-md mt-2 mb-4 p-2"
                  required />

                {/* Quarter */}
                <label htmlFor="Quarter">Quarter</label>
                <select
                  name="Quarter"
                  value={quarter || ""}
                  onChange={(e) => setQuarter(e.target.value)}
                  className="bg-gray-200 rounded-md mt-2 mb-4 py-[9px] px-2"
                  required
                >
                  <option value="" className="text-gray-500">
                    Choose one
                  </option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>

                {/* Platform */}
                <label htmlFor="Platform">Platform</label>
                <div className=" flex-col mt-2 mb-4">
                  {[
                    "Instagram",
                    "TikTok",
                    "Youtube",
                    "Website",
                    "Apa kek yang lain",
                  ].map((platformOption) => (
                    <label
                      key={platformOption}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        value={platformOption}
                        checked={platform.includes(platformOption)}
                        onChange={handleCheckboxChange}
                        className="form-checkbox"
                        required={platform.length === 0} />
                      <span>{platformOption}</span>
                    </label>
                  ))}

                  {platform.includes("Apa kek yang lain") && (
                    <input
                      type="text"
                      value={customPlatform}
                      onChange={handleCustomChangePlatform}
                      placeholder="Enter other platform"
                      className="bg-gray-200 rounded-md mt-2 py-[9px] px-2 w-full"
                      required
                      autoFocus />
                  )}
                </div>

                {/* SOW */}
                <label htmlFor="SOW">SOW</label>
                {sow === "Other" ? (
                  <input
                    type="text"
                    value={customSow}
                    onChange={handleCustomChangeSow}
                    onBlur={() => {
                      if (customSow.trim() === "") setSow("");
                    } }
                    placeholder="Enter other SOW"
                    className="bg-gray-200 rounded-md mt-2 mb-4 py-[9px] px-2"
                    required
                    autoFocus />
                ) : (
                  <select
                    name="SOW"
                    value={sow}
                    onChange={handleSelectChangeSow}
                    className="bg-gray-200 rounded-md mt-2 mb-4 py-[9px] px-2"
                    required
                  >
                    <option value="" className="text-gray-500">
                      Choose one
                    </option>
                    <option value="Bundling">Bundling</option>
                    <option value="Other">KETIK LAH, CULUN AMAT</option>
                  </select>
                )}

                {/* SOW Bundling  */}
                {sow === "Bundling" && (
                  <div className="flex flex-col gap-3 w-full min-h-2 rounded-lg shadow-lg p-6 mb-8">
                    {bundling.map((entry, index) => (
                      <div key={index} className="flex flex-col gap-4 mb-4">
                        <div className="flex items-center">
                          <label className="mr-2">
                            SOW {index + 1}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          {bundling.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBundlingEntry(index)}
                              className="text-red-500 ml-2"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Enter SOW"
                          value={entry.SOW || ""}
                          onChange={(e) => handleBundlingChange(index, "SOW", e.target.value)}
                          required
                          className="rounded-lg border-2 px-2 py-[9px]" />
                        <input
                          type="text"
                          placeholder="Enter Content"
                          value={entry.Content || ""}
                          onChange={(e) => handleBundlingChange(
                            index,
                            "Content",
                            e.target.value
                          )}
                          required
                          className="rounded-lg border-2 px-2 py-[9px]" />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="flex justify-center items-center ms-auto gap-4 rounded-lg px-4 py-2 min-w-2 mt-3 bg-blue-500 hover:bg-blue-700 transition-all duration-300"
                      onClick={addBundlingEntry}
                    >
                      <span>
                        <svg
                          className="w-5 h-5 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 12h14m-7 7V5" />
                        </svg>
                      </span>
                      <h1 className="text-white">Add Another SOW</h1>
                    </button>
                  </div>
                )}

                {/* Content */}
                <label htmlFor="Content">Content</label>
                <input
                  type="text"
                  value={content || ""}
                  onChange={(e) => setContent(e.target.value)}
                  name="Content"
                  id="Content"
                  className={`bg-gray-200 rounded-md mt-2 mb-4 py-[9px] px-2 ${!contentEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  required
                  disabled={!contentEnabled} />

                {/* Status */}
                <label htmlFor="">Status</label>
                <select
                  name="Status"
                  value={status || ""}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-gray-200 rounded-md mt-2 mb-4 py-[9px] px-2"
                  required
                >
                  <option value="" className="text-gray-500">
                    Choose one
                  </option>
                  <option value="Development">Development</option>
                  <option value="Content Proposed">Content Proposed</option>
                  <option value="On Going">On Going</option>
                  <option value="Editing">Editing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Published">Published</option>
                </select>

                {/* Link */}
                <label htmlFor="">Link</label>
                <input
                  type="text"
                  value={link || ""}
                  onChange={(e) => setLink(e.target.value)}
                  name="Link"
                  className="bg-gray-200 rounded-md mt-2 mb-4 p-2"
                  required />

                {/* Button Submit */}
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 transition-all duration-300 font-bold rounded-md text-white p-2 mt-4"
                >
                  {currentId ? "Update Data" : "Add Data"}
                </button>
              </form>
            </div>
          </div>
        )}
        {/* Form end*/}
      </section>
    </>
  );
}

export default Dashboard;
