import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, clearError } from '../authSlice';

export const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, successMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [formErrors, setFormErrors] = useState({});

  // Password strength meter calculation: 0 = None, 1 = Weak, 2 = Fair, 3 = Good, 4 = Strong
  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  }, [formData.password]);

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập địa chỉ email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.phone.trim().replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không đúng định dạng Việt Nam';
    }

    if (!formData.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = 'Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    try {
      const resultAction = await dispatch(
        registerUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
        })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        // Redirect to Home or Login
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1200);
      }
    } catch (err) {
      console.error('Register submit error:', err);
    }
  };

  return {
    formData,
    formErrors,
    passwordStrength,
    isLoading,
    error,
    successMessage,
    handleChange,
    handleSubmit,
  };
};

export default useRegister;
