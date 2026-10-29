import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, SPACING, FONT, RADIUS } from '../theme/colors';

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>Compte</Text>
        <Text style={styles.title}>Mon appareil</Text>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color={COLORS.accent} />
          </View>
          <Text style={styles.phone}>+33 6 00 00 00 00</Text>
          <Text style={styles.meta}>Licence actuelle : gratuite</Text>
          <Text style={styles.meta}>Appareil : Android</Text>
        </View>

        <Pressable style={styles.action}>
          <Ionicons name="diamond" size={18} color={COLORS.gold} />
          <Text style={styles.actionText}>Voir les offres premium</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </Pressable>

        <Pressable style={styles.action}>
          <Ionicons name="shield-checkmark" size={18} color={COLORS.success} />
          <Text style={styles.actionText}>Vérifier ma licence</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  eyebrow: { color: COLORS.accentStrong, fontSize: FONT.sm, fontWeight: '800', letterSpacing: 1 },
  title: { color: COLORS.text, fontSize: FONT.xxl, fontWeight: '900', marginTop: 4 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  phone: { color: COLORS.text, fontSize: FONT.xl, fontWeight: '900' },
  meta: { color: COLORS.textMuted, fontSize: FONT.md, marginTop: SPACING.sm },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  actionText: { flex: 1, color: COLORS.text, fontSize: FONT.md, fontWeight: '700' },
});
