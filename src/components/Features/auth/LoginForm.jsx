
import React, { useState } from 'react';
import { validateLoginForm } from '../../../utils/validators';
import Button from '../../common/Button';
import Alert from '../../common/Alert';

const LoginForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
    e. preventDefault();
    setServerError(null);
    setErrors({});

    const validation = validateLoginForm(formData. username, formData.password);
    if (! validation.isValid) {
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
          title="Login Gagal"
          message={serverError}
          onClose={() => setServerError(null)}
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData. username}
          onChange={handleInputChange}
          placeholder="Masukkan username"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.username ?  'border-red-500' : 'border-gray-300'
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
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        />
        {errors. password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={loading}
        className="mt-6"
      >
        {loading ? 'Sedang masuk...' : 'Masuk'}
      </Button>
    </form>
  );
};

export default LoginForm;