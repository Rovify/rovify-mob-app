import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

export default function CreateScreen() {
    useEffect(() => {
        router.back();
    }, []);

    return <View />;
}