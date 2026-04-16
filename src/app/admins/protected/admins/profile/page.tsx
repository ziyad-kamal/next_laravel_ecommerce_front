"use client";

import { Button, Input, Textarea } from "@/components";
import sendRequest from "@/functions/sendRequest";
import AdminState from "@/interfaces/states/AdminState";
import InitialErrors from "@/interfaces/states/InitialErrors";
import LocaleState from "@/interfaces/states/LocaleState";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { display } from "@/redux/DisplayToast";
import { Calendar, Camera, Edit2, Mail, MapPin, Phone, Save, Shield, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";

const initialErrors: InitialErrors = {};

export default function AdminProfile() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<AdminState>({
        id: 0,
        name: "",
        role: "",
        email: "",
        phone: "",
        address: "",
        bio: "",
        permissions: "",
        created_at: "",
    });
    const localeState = useAppSelector((state: { setLocale: LocaleState }) => state.setLocale);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<InitialErrors>(initialErrors); // Changed to any to handle dynamic error keys
    const t = useTranslations("adminProfile");

    //MARK:get profile
    useEffect(() => {
        const url = `/admin-panel/profile`;
        const abortController = new AbortController();
        const token = localStorage.getItem("adminToken");

        const fetchData = async () => {
            const response = await sendRequest("get", url, null, abortController, token, router);

            if (response && response.success) {
                setProfileData(response.data.admin);
            } else if (response) {
                dispatch(display({ type: "error", message: response.msg.text }));
            }
        };

        fetchData();

        return () => abortController.abort();
    }, [dispatch, router, localeState.locale]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    let abortControllerForSubmit: AbortController | null = null;

    const handleSave = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setIsLoading(true);

        const token = localStorage.getItem("adminToken");
        const url = `/admin-panel/profile?_method=put`;
        if (abortControllerForSubmit) {
            abortControllerForSubmit.abort();
        }
        abortControllerForSubmit = new AbortController();

        const submitData = async () => {
            const response = await sendRequest("post", url, profileData, abortControllerForSubmit, token, router);
            setErrors(initialErrors);

            if (response && response.success) {
                dispatch(display({ type: "success", message: response.msg.text }));
                setIsLoading(false);
                setProfileData({ ...profileData, ...response.data.admin });
                setIsEditing(false);
            } else if (response) {
                dispatch(display({ type: "error", message: response.msg.text }));
                setIsLoading(false);

                if (response.errors) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        ...response.errors,
                    }));
                }
            }
        };

        submitData();
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (field: string, value: string) => {
        setProfileData({ ...profileData, [field]: value });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ">
            <div className="max-w-12-l mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-slate-800">{t("title")}</h1>
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <Edit2 size={18} />
                                {t("editProfile")}
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    handleClick={handleSave}
                                    classes="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                    isLoading={isLoading}
                                    text={t("save")}
                                >
                                    <Save size={18} />
                                    {t("save")}
                                </Button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    <X size={18} />
                                    {t("cancel")}
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
                                    <Shield className="text-blue-600" size={20} />
                                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                        {t("administrator")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Name and Role */}
                        <div className="mb-6">
                            {isEditing ? (
                                <div className="space-y-3">
                                    <Input
                                        name="name"
                                        type="text"
                                        value={profileData.name}
                                        handleChange={(e) => handleChange("name", e.target.value)}
                                        classes="text-3xl font-bold text-slate-800 border-b-2 border-blue-500 focus:outline-none w-full"
                                        error={errors.name ? errors.name[0] : ""}
                                    />
                                    <p className="text-xl text-slate-600">{profileData.role}</p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-bold text-slate-800">{profileData.name}</h2>
                                    <p className="text-xl text-slate-600">{profileData.role}</p>
                                </>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="mb-6 pb-6 border-b border-slate-200">
                            {isEditing ? (
                                <Textarea
                                    name="bio"
                                    value={profileData.bio}
                                    handleChange={(e) => handleChange("bio", e.target.value)}
                                    rows={3}
                                    classes="w-full text-slate-700 border-2 border-blue-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    error={errors.bio ? errors.bio[0] : ""}
                                    dir={localeState.locale === "ar" ? "rtl" : "ltr"}
                                />
                            ) : (
                                <p className="text-slate-700">{profileData.bio}</p>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-800 mb-3">{t("contactInformation")}</h3>

                                <div className="flex items-center gap-3">
                                    <Mail className="text-slate-400" size={20} />
                                    {isEditing ? (
                                        <Input
                                            name="email"
                                            type="email"
                                            value={profileData.email}
                                            handleChange={(e) => handleChange("email", e.target.value)}
                                            classes="text-slate-700 border-b border-blue-500 focus:outline-none flex-1"
                                            error={errors.email ? errors.email[0] : ""}
                                        />
                                    ) : (
                                        <span className="text-slate-700">{profileData.email}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone className="text-slate-400" size={20} />
                                    {isEditing ? (
                                        <Input
                                            name="phone"
                                            type="tel"
                                            value={profileData.phone}
                                            handleChange={(e) => handleChange("phone", e.target.value)}
                                            classes="text-slate-700 border-b border-blue-500 focus:outline-none flex-1"
                                            error={errors.phone ? errors.phone[0] : ""}
                                        />
                                    ) : (
                                        <span className="text-slate-700">{profileData.phone}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin className="text-slate-400" size={20} />
                                    {isEditing ? (
                                        <Input
                                            name="address"
                                            type="text"
                                            value={profileData.address}
                                            handleChange={(e) => handleChange("location", e.target.value)}
                                            classes="text-slate-700 border-b border-blue-500 focus:outline-none flex-1"
                                            error={errors.address ? errors.address[0] : ""}
                                        />
                                    ) : (
                                        <span className="text-slate-700">{profileData.address}</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-800 mb-3">{t("additionalDetails")}</h3>

                                <div className="flex items-center gap-3">
                                    <Calendar className="text-slate-400" size={20} />
                                    <div>
                                        <p className="text-sm text-slate-500">{t("memberSince")}</p>
                                        <p className="text-slate-700 font-medium">{profileData.created_at}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Shield className="text-slate-400" size={20} />
                                    <div>
                                        <p className="text-sm text-slate-500">{t("accessLevel")}</p>
                                        <p className="text-slate-700 font-medium">{profileData.permissions}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-slate-800">247</p>
                                <p className="text-sm text-slate-500">{t("tasksCompleted")}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-slate-800">18</p>
                                <p className="text-sm text-slate-500">{t("activeProjects")}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-slate-800">99.8%</p>
                                <p className="text-sm text-slate-500">{t("uptime")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
