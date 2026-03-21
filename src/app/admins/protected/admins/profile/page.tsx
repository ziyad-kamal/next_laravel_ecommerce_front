"use client";

import { useState } from "react";
import {
    Camera,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Edit2,
    Save,
    X,
} from "lucide-react";

export default function AdminProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "John Anderson",
        role: "System Administrator",
        email: "john.anderson@company.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        joinDate: "January 2022",
        bio: "Experienced system administrator with over 8 years in IT infrastructure management and cloud solutions.",
        department: "IT Operations",
        permissions: "Full Access",
    });

    const [tempData, setTempData] = useState(profileData);

    const handleEdit = () => {
        setIsEditing(true);
        setTempData(profileData);
    };

    const handleSave = () => {
        setProfileData(tempData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempData(profileData);
        setIsEditing(false);
    };

    const handleChange = (field: string, value: string) => {
        setTempData({ ...tempData, [field]: value });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ">
            <div className="max-w-12-l mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-slate-800">
                            Admin Profile
                        </h1>
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <Edit2 size={18} />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    <Save size={18} />
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Cover Image */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                    {/* Profile Info */}
                    <div className="px-6 pb-6">
                        {/* Avatar */}
                        <div className="flex items-end -mt-16 mb-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                                    {profileData.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </div>
                                {isEditing && (
                                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-lg">
                                        <Camera size={18} />
                                    </button>
                                )}
                            </div>
                            <div className="ml-6 mb-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield
                                        className="text-blue-600"
                                        size={20}
                                    />
                                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                        Administrator
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Name and Role */}
                        <div className="mb-6">
                            {isEditing ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={tempData.name}
                                        onChange={(e) =>
                                            handleChange("name", e.target.value)
                                        }
                                        className="text-3xl font-bold text-slate-800 border-b-2 border-blue-500 focus:outline-none w-full"
                                    />
                                    <input
                                        type="text"
                                        value={tempData.role}
                                        onChange={(e) =>
                                            handleChange("role", e.target.value)
                                        }
                                        className="text-xl text-slate-600 border-b-2 border-blue-500 focus:outline-none w-full"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-bold text-slate-800">
                                        {profileData.name}
                                    </h2>
                                    <p className="text-xl text-slate-600">
                                        {profileData.role}
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="mb-6 pb-6 border-b border-slate-200">
                            {isEditing ? (
                                <textarea
                                    value={tempData.bio}
                                    onChange={(e) =>
                                        handleChange("bio", e.target.value)
                                    }
                                    rows={3}
                                    className="w-full text-slate-700 border-2 border-blue-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <p className="text-slate-700">
                                    {profileData.bio}
                                </p>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                                    Contact Information
                                </h3>

                                <div className="flex items-center gap-3">
                                    <Mail
                                        className="text-slate-400"
                                        size={20}
                                    />
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={tempData.email}
                                            onChange={(e) =>
                                                handleChange(
                                                    "email",
                                                    e.target.value,
                                                )
                                            }
                                            className="text-slate-700 border-b border-blue-500 focus:outline-none flex-1"
                                        />
                                    ) : (
                                        <span className="text-slate-700">
                                            {profileData.email}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone
                                        className="text-slate-400"
                                        size={20}
                                    />
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={tempData.phone}
                                            onChange={(e) =>
                                                handleChange(
                                                    "phone",
                                                    e.target.value,
                                                )
                                            }
                                            className="text-slate-700 border-b border-blue-500 focus:outline-none flex-1"
                                        />
                                    ) : (
                                        <span className="text-slate-700">
                                            {profileData.phone}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin
                                        className="text-slate-400"
                                        size={20}
                                    />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={tempData.location}
                                            onChange={(e) =>
                                                handleChange(
                                                    "location",
                                                    e.target.value,
                                                )
                                            }
                                            className="text-slate-700 border-b border-blue-500 focus:outline-none flex-1"
                                        />
                                    ) : (
                                        <span className="text-slate-700">
                                            {profileData.location}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                                    Additional Details
                                </h3>

                                <div className="flex items-center gap-3">
                                    <Calendar
                                        className="text-slate-400"
                                        size={20}
                                    />
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Member Since
                                        </p>
                                        <p className="text-slate-700 font-medium">
                                            {profileData.joinDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Shield
                                        className="text-slate-400"
                                        size={20}
                                    />
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Access Level
                                        </p>
                                        <p className="text-slate-700 font-medium">
                                            {profileData.permissions}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-slate-400 rounded flex items-center justify-center">
                                        <span className="text-white text-xs">
                                            D
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Department
                                        </p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={tempData.department}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "department",
                                                        e.target.value,
                                                    )
                                                }
                                                className="text-slate-700 font-medium border-b border-blue-500 focus:outline-none"
                                            />
                                        ) : (
                                            <p className="text-slate-700 font-medium">
                                                {profileData.department}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-slate-800">
                                    247
                                </p>
                                <p className="text-sm text-slate-500">
                                    Tasks Completed
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-slate-800">
                                    18
                                </p>
                                <p className="text-sm text-slate-500">
                                    Active Projects
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-slate-800">
                                    99.8%
                                </p>
                                <p className="text-sm text-slate-500">Uptime</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
