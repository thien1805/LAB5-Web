/**
 * EXERCISE 4.1: Integration Testing a Form
 * 
 * Understanding: Learn how to write integration tests for React components
 * using React Testing Library. Tests user behavior, not implementation details.
 * 
 * Requirements:
 * - Test form input and submission
 * - Test form validation
 * - Test error handling
 * - Test success states
 */

import React, { useState } from 'react';

/**
 * Form Component to Test
 */
export function RegistrationForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Call parent callback
      onSubmit?.(formData);
      
      setSubmitSuccess(true);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="registration-form">
      {submitSuccess && (
        <div style={{
          padding: '12px',
          marginBottom: '15px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px'
        }} data-testid="success-message">
          ✅ Registration successful!
        </div>
      )}

      {errors.submit && (
        <div style={{
          padding: '12px',
          marginBottom: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px'
        }} data-testid="error-message">
          ❌ {errors.submit}
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: `1px solid ${errors.email ? '#dc3545' : '#ddd'}`
          }}
          data-testid="email-input"
        />
        {errors.email && (
          <span style={{ color: '#dc3545', fontSize: '12px' }} data-testid="email-error">
            {errors.email}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Password *
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: `1px solid ${errors.password ? '#dc3545' : '#ddd'}`
          }}
          data-testid="password-input"
        />
        {errors.password && (
          <span style={{ color: '#dc3545', fontSize: '12px' }} data-testid="password-error">
            {errors.password}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Confirm Password *
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat password"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: `1px solid ${errors.confirmPassword ? '#dc3545' : '#ddd'}`
          }}
          data-testid="confirm-password-input"
        />
        {errors.confirmPassword && (
          <span style={{ color: '#dc3545', fontSize: '12px' }} data-testid="confirm-password-error">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="agreeToTerms" style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            data-testid="terms-checkbox"
          />
          <span style={{ marginLeft: '8px' }}>I agree to the terms and conditions *</span>
        </label>
        {errors.agreeToTerms && (
          <span style={{ color: '#dc3545', fontSize: '12px', display: 'block', marginTop: '5px' }} data-testid="terms-error">
            {errors.agreeToTerms}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: isSubmitting ? '#ccc' : '#51cf66',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }}
        data-testid="submit-button"
      >
        {isSubmitting ? '⏳ Registering...' : 'Register'}
      </button>
    </form>
  );
}

// Export for Exercise display
export function Exercise41Complete() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Exercise 4.1: Integration Testing a Form</h2>
      <RegistrationForm onSubmit={(data) => console.log('Form submitted:', data)} />
    </div>
  );
}
