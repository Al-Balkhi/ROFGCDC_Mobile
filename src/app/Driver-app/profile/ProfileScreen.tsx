import React, { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useDriverAuth } from "../../../../hooks/useDriverAuth";
import {
  AvatarCard,
  PasswordTab,
  ProfileTab,
  ScheduleTab,
  TabBar,
} from "./components";
import { usePasswordChange, useProfileUpdate } from "./hooks";
import { Tab, User } from "./types";

export default function ProfileScreen(): JSX.Element {
  const { user, updateUser } = useDriverAuth();

  // ─── Tab state ────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isEditing, setIsEditing] = useState(false);

  // ─── Profile update hook ──────────────────────────────────────────────────
  const {
    username,
    phone,
    loading: profileLoading,
    setUsername,
    setPhone,
    handleSaveProfile,
    resetProfile,
  } = useProfileUpdate(user as User | null, updateUser, setIsEditing);

  // ─── Password change hook ─────────────────────────────────────────────────
  const {
    passwordForm,
    passwordErrors,
    loading: passwordLoading,
    updatePasswordField,
    handleChangePassword,
  } = usePasswordChange();

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleCancelEdit = useCallback(() => {
    resetProfile(user as User);
    setIsEditing(false);
  }, [resetProfile, user]);

  const handleTabChange = useCallback(() => {
    // Reset editing state when switching tabs
    setIsEditing(false);
  }, []);

  // ─── Render tab content ────────────────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileTab
            user={user as User | null}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            username={username}
            phone={phone}
            loading={profileLoading}
            setUsername={setUsername}
            setPhone={setPhone}
            handleSaveProfile={handleSaveProfile}
            handleCancelEdit={handleCancelEdit}
          />
        );

      case "password":
        return (
          <PasswordTab
            passwordForm={passwordForm}
            passwordErrors={passwordErrors}
            loading={passwordLoading}
            onChangePassword={handleChangePassword}
            updatePasswordField={updatePasswordField}
          />
        );

      case "schedule":
        return <ScheduleTab workSchedule={(user as User)?.work_schedule} />;

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar card */}
        <AvatarCard user={user as User | null} />

        {/* Tabs container */}
        <View className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tab bar */}
          <TabBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onTabChange={handleTabChange}
          />

          {/* Tab content */}
          <View className="p-6">{renderTabContent()}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
