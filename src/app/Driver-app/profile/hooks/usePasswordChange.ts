import { useCallback, useState } from "react";
import { Alert } from "react-native";
import driverApi from "../../../../../services/driverApi";
import { PasswordErrors, PasswordForm } from "../types";

interface UsePasswordChangeReturn {
  passwordForm: PasswordForm;
  passwordErrors: PasswordErrors;
  loading: boolean;
  updatePasswordField: (field: keyof PasswordForm, value: string) => void;
  handleChangePassword: () => Promise<void>;
  resetPasswordForm: () => void;
}

export function usePasswordChange(): UsePasswordChangeReturn {
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [loading, setLoading] = useState(false);

  const updatePasswordField = useCallback(
    (field: keyof PasswordForm, value: string) => {
      setPasswordForm((prev) => ({ ...prev, [field]: value }));
      if (passwordErrors[field]) {
        setPasswordErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [passwordErrors],
  );

  const validatePassword = useCallback((): boolean => {
    const errors: PasswordErrors = {};
    if (!passwordForm.old_password) {
      errors.old_password = "كلمة المرور الحالية مطلوبة";
    }
    if (!passwordForm.new_password) {
      errors.new_password = "كلمة المرور الجديدة مطلوبة";
    } else if (passwordForm.new_password.length < 8) {
      errors.new_password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }
    if (!passwordForm.confirm_new_password) {
      errors.confirm_new_password = "تأكيد كلمة المرور مطلوب";
    } else if (
      passwordForm.new_password !== passwordForm.confirm_new_password
    ) {
      errors.confirm_new_password = "كلمات المرور غير متطابقة";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  }, [passwordForm]);

  // Define resetPasswordForm BEFORE handleChangePassword to avoid temporal dead zone
  const resetPasswordForm = useCallback(() => {
    setPasswordForm({
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    });
    setPasswordErrors({});
  }, []);

  const handleChangePassword = useCallback(async () => {
    if (!validatePassword()) return;

    setLoading(true);
    try {
      await driverApi.post("/profile/password/", {
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
        confirm_new_password: passwordForm.confirm_new_password,
      });
      Alert.alert("نجاح", "تم تغيير كلمة المرور بنجاح");
      resetPasswordForm();
    } catch (error: any) {
      const data = error?.response?.data;
      if (data && typeof data === "object") {
        setPasswordErrors({
          old_password: data.old_password?.[0] || data.old_password,
          new_password: data.new_password?.[0] || data.new_password,
          confirm_new_password:
            data.confirm_new_password?.[0] || data.confirm_new_password,
        });
      }
      Alert.alert("خطأ", "فشل تغيير كلمة المرور");
    } finally {
      setLoading(false);
    }
  }, [passwordForm, validatePassword, resetPasswordForm]);

  return {
    passwordForm,
    passwordErrors,
    loading,
    updatePasswordField,
    handleChangePassword,
    resetPasswordForm,
  };
}
