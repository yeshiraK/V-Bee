import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { THEME } from '../../theme/colors';
import { Card } from '../../components/common/Card';
import { initiateLogin } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [loginSessionId, setLoginSessionId] = useState<string | null>(null);
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);

  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleFetchCaptcha = async () => {
    const trimmedUser = username.trim();
    if (!trimmedUser) {
      setErrorMessage('Please enter your Registration Number.');
      return;
    }

    setIsLoadingCaptcha(true);
    setErrorMessage(null);
    setCaptcha('');

    try {
      const data = await initiateLogin(trimmedUser);
      setLoginSessionId(data.login_session_id);
      setCaptchaImage(data.captcha_image);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect to VTOP. Please try again.');
    } finally {
      setIsLoadingCaptcha(false);
    }
  };

  const handleLogin = async () => {
    const trimmedUser = username.trim();
    const trimmedCaptcha = captcha.trim();

    if (!trimmedUser) {
      setErrorMessage('Please enter your Registration Number.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your VTOP Password.');
      return;
    }
    if (!trimmedCaptcha) {
      setErrorMessage('Please solve and enter the Captcha code.');
      return;
    }
    if (!loginSessionId) {
      setErrorMessage('Session expired. Please refresh the captcha.');
      return;
    }

    setIsLoggingIn(true);
    setErrorMessage(null);

    try {
      await login({
        login_session_id: loginSessionId,
        username: trimmedUser,
        password,
        captcha: trimmedCaptcha,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials or captcha. Please retry.');
      // Refresh captcha on failed attempt
      handleFetchCaptcha();
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Branding */}
          <View style={styles.brandHeader}>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>VIT CHENNAI</Text>
            </View>
            <Text style={styles.appTitle}>VTOP Portal</Text>
            <Text style={styles.appSubtitle}>
              Academic command center for students
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage && (
            <Card variant="peach" style={styles.errorCard}>
              <Feather name="alert-circle" size={16} color={THEME.colors.pastel.peach.text} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </Card>
          )}

          {/* Form Container */}
          <Card style={styles.formCard}>
            {/* Step 1: Registration Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>REGISTRATION NUMBER</Text>
              <View style={styles.inputRow}>
                <Feather name="user" size={18} color={THEME.colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 21BCE1234"
                  placeholderTextColor={THEME.colors.textMuted}
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (loginSessionId) {
                      setLoginSessionId(null);
                      setCaptchaImage(null);
                    }
                  }}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  editable={!isLoggingIn}
                />
                {!captchaImage && (
                  <TouchableOpacity
                    style={[styles.fetchBtn, (!username.trim() || isLoadingCaptcha) && styles.fetchBtnDisabled]}
                    onPress={handleFetchCaptcha}
                    disabled={!username.trim() || isLoadingCaptcha}
                  >
                    {isLoadingCaptcha ? (
                      <ActivityIndicator size="small" color={THEME.colors.surface} />
                    ) : (
                      <Text style={styles.fetchBtnText}>Next</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Step 2: Password and Captcha (Revealed after fetching captcha) */}
            {captchaImage && (
              <>
                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>PASSWORD</Text>
                  <View style={styles.inputRow}>
                    <Feather name="lock" size={18} color={THEME.colors.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter VTOP password"
                      placeholderTextColor={THEME.colors.textMuted}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoggingIn}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeBtn}
                    >
                      <Feather
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={18}
                        color={THEME.colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Captcha Image & Input */}
                <View style={styles.inputGroup}>
                  <View style={styles.captchaHeaderRow}>
                    <Text style={styles.inputLabel}>CAPTCHA VERIFICATION</Text>
                    <TouchableOpacity
                      onPress={handleFetchCaptcha}
                      style={styles.refreshCaptchaBtn}
                      disabled={isLoadingCaptcha || isLoggingIn}
                    >
                      <Feather
                        name="refresh-cw"
                        size={12}
                        color={THEME.colors.pastel.lavender.text}
                      />
                      <Text style={styles.refreshCaptchaText}>Refresh</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.captchaBoxRow}>
                    <View style={styles.captchaImageContainer}>
                      {isLoadingCaptcha ? (
                        <ActivityIndicator size="small" color={THEME.colors.textPrimary} />
                      ) : (
                        <Image
                          source={{ uri: captchaImage }}
                          style={styles.captchaImage}
                          resizeMode="contain"
                        />
                      )}
                    </View>

                    <TextInput
                      style={styles.captchaInput}
                      placeholder="Enter code"
                      placeholderTextColor={THEME.colors.textMuted}
                      value={captcha}
                      onChangeText={setCaptcha}
                      autoCapitalize="characters"
                      autoCorrect={false}
                      editable={!isLoggingIn}
                    />
                  </View>
                </View>

                {/* Submit Login Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.loginBtn, isLoggingIn && styles.loginBtnDisabled]}
                  onPress={handleLogin}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <ActivityIndicator size="small" color={THEME.colors.textInverse} />
                  ) : (
                    <>
                      <Text style={styles.loginBtnText}>Sign In</Text>
                      <Feather name="arrow-right" size={18} color={THEME.colors.textInverse} />
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </Card>

          {/* Subtle Security Notice */}
          <View style={styles.footerNote}>
            <Feather name="shield" size={13} color={THEME.colors.textMuted} />
            <Text style={styles.footerNoteText}>
              Direct secure connection to VTOP. Passwords are never saved.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.xl,
    flexGrow: 1,
    justifyContent: 'center',
  },
  brandHeader: {
    marginBottom: THEME.spacing.xl,
  },
  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: THEME.colors.pastel.yellow.bg,
    borderColor: THEME.colors.pastel.yellow.border,
    borderWidth: 1,
    borderRadius: THEME.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: THEME.spacing.sm,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.pastel.yellow.text,
    letterSpacing: 0.8,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.8,
  },
  appSubtitle: {
    fontSize: 15,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
    padding: THEME.spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.pastel.peach.text,
  },
  formCard: {
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.xl,
  },
  inputGroup: {
    marginBottom: THEME.spacing.lg,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    paddingHorizontal: THEME.spacing.md,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: THEME.colors.textPrimary,
    fontWeight: '600',
  },
  fetchBtn: {
    backgroundColor: THEME.colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fetchBtnDisabled: {
    opacity: 0.4,
  },
  fetchBtnText: {
    color: THEME.colors.textInverse,
    fontSize: 13,
    fontWeight: '700',
  },
  eyeBtn: {
    padding: 6,
  },
  captchaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  refreshCaptchaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: THEME.colors.pastel.lavender.bg,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.pastel.lavender.border,
  },
  refreshCaptchaText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.pastel.lavender.text,
  },
  captchaBoxRow: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
    alignItems: 'center',
  },
  captchaImageContainer: {
    width: 140,
    height: 52,
    borderRadius: THEME.radius.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  captchaImage: {
    width: '100%',
    height: '100%',
  },
  captchaInput: {
    flex: 1,
    height: 52,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    paddingHorizontal: THEME.spacing.md,
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: 2,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: THEME.colors.textPrimary,
    height: 54,
    borderRadius: THEME.radius.lg,
    marginTop: THEME.spacing.xs,
    ...THEME.shadows.subtle,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: THEME.colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: THEME.spacing.xl,
  },
  footerNoteText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
});
