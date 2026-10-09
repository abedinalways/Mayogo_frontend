"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, Upload, X, Loader2 } from "lucide-react";
import { useGetRolesQuery } from "@/lib/redux/api/adminApi";

export interface UserFormData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  roleName?: string;
  password?: string;
  status: boolean;
  avatar?: string;
  avatarFile?: File | null;
}

export interface UserFormProps {
  initialData?: UserFormData | null;
  onCancel: () => void;
  onSubmit: (data: UserFormData) => void;
  isSubmitting?: boolean;
}

export function UserForm({
  initialData,
  onCancel,
  onSubmit,
  isSubmitting = false,
}: UserFormProps) {
  const isEdit = Boolean(initialData?.id);
  const { data: roles = [], isLoading: isLoadingRoles } = useGetRolesQuery();

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    roleId: "",
    roleName: "Admin",
    password: "",
    status: true,
    avatar: "",
    avatarFile: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        avatarFile: null,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        roleId: roles[0]?.id || "",
        roleName: roles[0]?.name || "Admin",
        password: "",
        status: true,
        avatar: "",
        avatarFile: null,
      });
    }
  }, [initialData, roles]);

  const handleChange = <K extends keyof UserFormData>(
    field: K,
    value: UserFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (roleId: string) => {
    const selectedRole = roles.find((r) => r.id === roleId);
    setFormData((prev) => ({
      ...prev,
      roleId,
      roleName: selectedRole?.name || prev.roleName,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(file),
        avatarFile: file,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <div className="self-stretch pb-4 border-b border-[#e4ebf1] flex justify-between items-start">
        <div className="flex flex-col justify-center items-start gap-1">
          <div className="text-[#103D5C] text-lg font-semibold leading-5">
            {isEdit ? "Edit Admin User" : "Add New Admin User"}
          </div>
          <div className="text-[#64748b] text-sm font-normal leading-4">
            {isEdit
              ? "Update existing admin user details"
              : "Add a new admin user to the platform"}
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="self-stretch flex flex-col justify-start items-end gap-6"
      >
        <div className="self-stretch flex flex-col justify-start items-start gap-4 mt-4">
          {/* Profile Picture */}
          <div className="self-stretch inline-flex justify-center items-center gap-3">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#e4ebf1] bg-slate-50 overflow-hidden">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-slate-400" />
              )}
            </div>
            <div className="flex-1 flex flex-col justify-start items-start gap-2">
              <div className="text-base font-normal text-[#103D5C] leading-5">
                Profile Picture
              </div>
              <div className="flex items-center gap-2">
                <label className="flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#103D5C] px-3 text-xs font-medium text-white transition-colors hover:bg-[#0b2841]">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {formData.avatar && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        avatar: "",
                        avatarFile: null,
                      }))
                    }
                    className="h-8 rounded-lg border border-red-200 px-3 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="text-[11px] text-slate-500 leading-4">
                *.png, *.jpeg files up to 10MB
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <div className="inline-flex justify-start items-start gap-1">
              <span className="text-[#103D5C] text-base font-medium leading-6">
                Full Name
              </span>
              <span className="text-red-500 text-base font-medium leading-6">
                *
              </span>
            </div>
            <div className="self-stretch h-11 px-3 bg-white rounded-lg border border-[#e4ebf1] inline-flex justify-start items-center gap-2 focus-within:border-[#103D5C]">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                required
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full text-sm font-normal text-[#103D5C] placeholder:text-slate-400 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <div className="inline-flex justify-start items-start gap-1">
              <span className="text-[#103D5C] text-base font-medium leading-6">
                Email
              </span>
              <span className="text-red-500 text-base font-medium leading-6">
                *
              </span>
            </div>
            <div className="self-stretch h-11 px-3 bg-white rounded-lg border border-[#e4ebf1] inline-flex justify-start items-center gap-2 focus-within:border-[#103D5C]">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full text-sm font-normal text-[#103D5C] placeholder:text-slate-400 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <span className="text-[#103D5C] text-base font-medium leading-6">
              Phone
            </span>
            <div className="self-stretch h-11 px-3 bg-white rounded-lg border border-[#e4ebf1] inline-flex justify-start items-center gap-2 focus-within:border-[#103D5C]">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full text-sm font-normal text-[#103D5C] placeholder:text-slate-400 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Role */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <div className="inline-flex justify-start items-start gap-1">
              <span className="text-[#103D5C] text-base font-medium leading-6">
                Role
              </span>
              <span className="text-red-500 text-base font-medium leading-6">
                *
              </span>
            </div>
            <select
              value={formData.roleId}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="self-stretch h-11 px-3 bg-white rounded-lg border border-[#e4ebf1] text-sm text-[#103D5C] outline-none focus:border-[#103D5C]"
              disabled={isLoadingRoles}
            >
              {roles.length > 0 ? (
                roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="super-admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </>
              )}
            </select>
          </div>

          {/* Password */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <div className="inline-flex justify-start items-start gap-1">
              <span className="text-[#103D5C] text-base font-medium leading-6">
                {isEdit ? "New Password (optional)" : "Password"}
              </span>
              {!isEdit && (
                <span className="text-red-500 text-base font-medium leading-6">
                  *
                </span>
              )}
            </div>
            <div className="self-stretch h-11 px-3 bg-white rounded-lg border border-[#e4ebf1] inline-flex justify-start items-center gap-2 focus-within:border-[#103D5C]">
              <Lock className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required={!isEdit}
                minLength={8}
                placeholder={isEdit ? "Leave blank to keep current" : "Min 8 characters"}
                value={formData.password ?? ""}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full text-sm font-normal text-[#103D5C] placeholder:text-slate-400 bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="self-stretch inline-flex justify-between items-center py-1">
            <span className="text-[#103D5C] text-base font-medium leading-6">
              Account Active
            </span>
            <button
              type="button"
              onClick={() => handleChange("status", !formData.status)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.status ? "bg-[#103D5C]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.status ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="self-stretch inline-flex justify-start items-start gap-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 rounded-lg border border-[#103D5C] flex justify-center items-center gap-2 text-[#103D5C] text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-[#103D5C] rounded-lg flex justify-center items-center gap-2 text-white text-sm font-medium hover:bg-[#0b2841] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEdit ? (
              "Update User"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}