import React, { useState } from "react";
import { validateRegisterForm } from "../../../utils/validators";
import Button from "../../common/Button";
import Alert from "../../common/Alert";

const RegisterForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({
        confirmPassword: "Password tidak cocok",
      });
      return;
    }

    const validation = validateRegisterForm(
      formData.name,
      formData.username,
      formData.password
    );
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit?.(formData, setServerError);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && (
        <Alert
          type="error"
          title="Registrasi Gagal"
          message={serverError}
          onClose={() => setServerError(null)}
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Lengkap
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Masukkan nama lengkap"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          disabled={loading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Masukkan username"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.username ? "border-red-500" : "border-gray-300"
          }`}
          disabled={loading}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Masukkan password"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          disabled={loading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Konfirmasi Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Konfirmasi password"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
          disabled={loading}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={loading}
        className="mt-6"
      >
        {loading ? "Sedang mendaftar..." : "Daftar"}
      </Button>
    </form>
  );
};

export default RegisterForm;
