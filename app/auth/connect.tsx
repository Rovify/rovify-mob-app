import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { getDeviceInfo, getDesignTokens } from '../../src/utils/responsive';
import { useMobileWallet } from '@/hooks/useWallet';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

export default function ConnectWalletScreen() {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const { connect, isConnecting, error } = useMobileWallet();
  const device = getDeviceInfo();
  const tokens = getDesignTokens();
  const isIOSSim = Platform.OS === 'ios' && !Device.isDevice;
  const isAndroidEmu = Platform.OS === 'android' && !Device.isDevice;


  const walletOptions = [
    {
      id: 'coinbase',
      name: 'Coinbase',
      icon: 'card-outline',
      available: true,
      color: '#0052FF'
    },
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: 'wallet-outline',
      available: !(isIOSSim || isAndroidEmu),
      color: '#F6851B'
    },
    {
      id: 'rainbow',
      name: 'Rainbow',
      icon: 'color-palette-outline',
      available: false,
      color: '#FF6B6B'
    },
    {
      id: 'walletconnect',
      name: 'Wallet Connect',
      icon: 'scan-outline',
      available: false,
      color: '#3B99FC'
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: 'diamond-outline',
      available: false,
      color: '#AB9FF2'
    },
    {
      id: 'other',
      name: 'Other Wallets',
      icon: 'ellipsis-horizontal',
      available: false,
      color: '#8E8E93'
    }
  ];

  const handleConnectWallet = async (walletId: string) => {
    if (!walletOptions.find(w => w.id === walletId)?.available) return;

    setSelectedWallet(walletId);

    try {
      const walletType = walletId === 'metamask' ? 'metamask' : 'coinbase';
      await connect(walletType);

      router.push('/explore');
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      setSelectedWallet(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={{
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 32
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32
        }}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: '#FF6B35',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold'
            }}>V</Text>
          </View>
          <Text style={{
            fontSize: 14,
            color: '#8E8E93'
          }}>Step 2</Text>
        </View>

        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#1C1C1E',
          marginBottom: 8
        }}>
          Set up your wallet
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#8E8E93',
          lineHeight: 22
        }}>
          Create an account to start discovering amazing events and collecting unforgettable memories
        </Text>
      </View>

      {/* Error display */}
      {error && (
        <View style={{
          backgroundColor: '#FEF2F2',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#FECACA'
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4
          }}>
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color="#DC2626"
            />
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#DC2626',
              marginLeft: 8
            }}>
              Connection Failed
            </Text>
          </View>
          <Text style={{
            fontSize: 13,
            color: '#991B1B',
            lineHeight: 18
          }}>
            {error}
          </Text>
        </View>
      )}

      {/* Wallet Options */}
      <View style={{
        flex: 1,
        paddingHorizontal: 24
      }}>
        {walletOptions.map((wallet) => (
          <TouchableOpacity
            key={wallet.id}
            onPress={() => handleConnectWallet(wallet.id)}
            disabled={!wallet.available || isConnecting}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
              paddingHorizontal: 20,
              marginBottom: 12,
              backgroundColor: 'white',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: selectedWallet === wallet.id ? '#FF6B35' : '#E5E5EA',
              opacity: wallet.available ? 1 : 0.5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: `${wallet.color}15`,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16
            }}>
              <Ionicons
                name={wallet.icon as any}
                size={24}
                color={wallet.color}
              />
            </View>

            <Text style={{
              flex: 1,
              fontSize: 16,
              fontWeight: '600',
              color: wallet.available ? '#1C1C1E' : '#8E8E93'
            }}>
              {wallet.name}
            </Text>

            {isConnecting && selectedWallet === wallet.id ? (
              <ActivityIndicator size="small" color="#FF6B35" />
            ) : wallet.available ? (
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#C7C7CC"
              />
            ) : (
              <Text style={{
                fontSize: 12,
                color: '#FF9500',
                fontWeight: '500'
              }}>
                {wallet.id === 'metamask' && (isIOSSim || isAndroidEmu) ? 'N/A' : 'Soon'}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={{
        paddingHorizontal: 24,
        paddingBottom: 34,
        paddingTop: 20
      }}>
        <View style={{
          backgroundColor: '#F2F2F7',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8
          }}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#34C759"
            />
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#1C1C1E',
              marginLeft: 8
            }}>
              Secure & Private
            </Text>
          </View>
          <Text style={{
            fontSize: 13,
            color: '#8E8E93',
            lineHeight: 18
          }}>
            Your private keys never leave your wallet. Rovify uses industry-standard security protocols.
          </Text>
        </View>

        <Text style={{
          fontSize: 12,
          color: '#8E8E93',
          textAlign: 'center',
          lineHeight: 16
        }}>
          By continuing, you agree to our{' '}
          <Text style={{ color: '#FF6B35' }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: '#FF6B35' }}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}