import { useCallback, useState } from "react";
import { Alert } from "react-native";
import driverApi from "../../../../../services/driverApi";
import { User } from "../types";

interface UseProfileUpdateReturn {
  username: string;
  phone: string;
  loading: boolean;
  setUsername: (value: string) => void;
  setPhone: (value: string) => void;
  handleSaveProfile: () => Promise<void>;
  resetProfile: (user: User) => void;
}

export function useProfileUpdate(
  user: User | null,
  updateUser: (data: Partial<User>) => void,
  setIsEditing: (value: boolean) => void,
): UseProfileUpdateReturn {
  const [username, setUsername] = useState(user?.username || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = useCallback(async () => {
    if (!username.trim()) {
      Alert.alert("خطأ", "اسم المستخدم مطلوب");
      return;
    }

    setLoading(true);
    try {
      const response = await driverApi.put("/profile/", {
        username: username.trim(),
        phone: phone.trim(),
      });
      updateUser({
        username: response.data.username,
        phone: response.data.phone,
      });
      setIsEditing(false);
      Alert.alert("نجاح", "تم تحديث الملف الشخصي بنجاح");
    } catch (error: any) {
      console.warn(
        "Update profile error:",
        error?.response?.data || error.message,
      );
      Alert.alert("خطأ", "حدث خطأ أثناء تحديث الملف الشخصي");
    } finally {
      setLoading(false);
    }
  }, [username, phone, updateUser, setIsEditing]);

  const resetProfile = useCallback((user: User) => {
    setUsername(user.username || "");
    setPhone(user.phone || "");
  }, []);

  return {
    username,
    phone,
    loading,
    setUsername,
    setPhone,
    handleSaveProfile,
    resetProfile,
  };
}
