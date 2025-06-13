import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { useAuth } from '../../src/hooks/useAuth';
import { getDeviceInfo, getDesignTokens } from '../../src/utils/responsive';
import { CustomHeader } from '@/components/layout/Header';

export default function ConnectWalletScreen() {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const { connectWallet, isConnecting } = useAuth();
  const device = getDeviceInfo();
  const tokens = getDesignTokens();

  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: 'wallet',
      description: 'Connect using MetaMask browser extension',
      available: true
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: 'card',
      description: 'Connect using Coinbase Wallet',
      available: true
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: 'scan',
      description: 'Scan with WalletConnect compatible wallet',
      available: false
    }
  ];

  const handleConnectWallet = async (walletId: string) => {
    setSelectedWallet(walletId);

    try {
      await connectWallet();

      Alert.alert(
        'Wallet Connected! 🎉',
        'Your wallet is now connected to Rovify. You can start messaging on XMTP!',
        [
          {
            text: 'Explore App',
            onPress: () => router.replace('/(tabs)/explore')
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Connection Failed', error.message);
      setSelectedWallet(null);
    }
  };

  return (
    <ScreenWrapper mode="safe" backgroundColor="white">
      <CustomHeader
        title="Connect Wallet"
        subtitle="Choose your preferred wallet"
        showBackButton
        onBackPress={() => router.back()}
      />

      <View style={{ flex: 1, padding: tokens.spacing.lg }}>
        {/* Info Section */}
        <View style={{
          backgroundColor: '#FEF3C7',
          borderRadius: tokens.borderRadius.lg,
          padding: tokens.spacing.md,
          marginBottom: tokens.spacing.xl
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.sm }}>
            <Ionicons name="information-circle" size={24} color="#D97706" />
            <Text style={{
              fontSize: tokens.typography.base,
              fontWeight: '600',
              color: '#92400E',
              marginLeft: tokens.spacing.sm
            }}>
              What you'll get:
            </Text>
          </View>
          <View style={{ paddingLeft: tokens.spacing.lg }}>
            <Text style={{ color: '#92400E', fontSize: tokens.typography.sm, marginBottom: 4 }}>
              • Secure messaging via XMTP protocol
            </Text>
            <Text style={{ color: '#92400E', fontSize: tokens.typography.sm, marginBottom: 4 }}>
              • Base network integration for payments
            </Text>
            <Text style={{ color: '#92400E', fontSize: tokens.typography.sm, marginBottom: 4 }}>
              • Access to AI agents and mini-apps
            </Text>
            <Text style={{ color: '#92400E', fontSize: tokens.typography.sm }}>
              • Join event chat rooms
            </Text>
          </View>
        </View>

        {/* Wallet Options */}
        <Text style={{
          fontSize: tokens.typography.lg,
          fontWeight: 'bold',
          color: '#1F2937',
          marginBottom: tokens.spacing.lg
        }}>
          Choose Your Wallet
        </Text>

        <View style={{ gap: tokens.spacing.md }}>
          {walletOptions.map((wallet) => (
            <TouchableOpacity
              key={wallet.id}
              onPress={() => wallet.available && handleConnectWallet(wallet.id)}
              disabled={!wallet.available || isConnecting}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: wallet.available ? 'white' : '#F9FAFB',
                borderWidth: 2,
                borderColor: selectedWallet === wallet.id ? '#F97316' : '#E5E7EB',
                borderRadius: tokens.borderRadius.lg,
                padding: tokens.spacing.md,
                opacity: wallet.available ? 1 : 0.6,
                ...tokens.shadows.sm
              }}
            >
              <View style={{
                width: 48,
                height: 48,
                borderRadius: tokens.borderRadius.lg,
                backgroundColor: '#FED7AA',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: tokens.spacing.md
              }}>
                <Ionicons
                  name={wallet.icon as any}
                  size={24}
                  color="#EA580C"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: tokens.typography.base,
                  fontWeight: '600',
                  color: wallet.available ? '#1F2937' : '#9CA3AF'
                }}>
                  {wallet.name}
                </Text>
                <Text style={{
                  fontSize: tokens.typography.sm,
                  color: wallet.available ? '#6B7280' : '#9CA3AF',
                  marginTop: 2
                }}>
                  {wallet.description}
                </Text>
                {!wallet.available && (
                  <Text style={{
                    fontSize: tokens.typography.xs,
                    color: '#F59E0B',
                    fontWeight: '500',
                    marginTop: 4
                  }}>
                    Coming Soon
                  </Text>
                )}
              </View>

              {isConnecting && selectedWallet === wallet.id ? (
                <ActivityIndicator size="small" color="#F97316" />
              ) : (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={wallet.available ? '#9CA3AF' : '#D1D5DB'}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Note */}
        <View style={{
          marginTop: tokens.spacing.xl,
          padding: tokens.spacing.md,
          backgroundColor: '#F3F4F6',
          borderRadius: tokens.borderRadius.lg
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.sm }}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            <Text style={{
              fontSize: tokens.typography.sm,
              fontWeight: '600',
              color: '#1F2937',
              marginLeft: tokens.spacing.xs
            }}>
              Your wallet, your keys
            </Text>
          </View>
          <Text style={{
            fontSize: tokens.typography.sm,
            color: '#6B7280',
            lineHeight: 18
          }}>
            Rovify never stores your private keys. All transactions are signed directly by your wallet.
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}