import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDesignTokens } from '@/utils/responsive';

interface EventPollModalProps {
    visible: boolean;
    onClose: () => void;
    onCreatePoll: (question: string, options: string[]) => void;
}

export const EventPollModal: React.FC<EventPollModalProps> = ({
    visible,
    onClose,
    onCreatePoll
}) => {
    const tokens = getDesignTokens();
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<string[]>(['', '']);

    const addOption = () => {
        if (options.length < 5) {
            setOptions([...options, '']);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleCreatePoll = () => {
        if (!question.trim()) {
            Alert.alert('Error', 'Please enter a question');
            return;
        }

        const validOptions = options.filter(opt => opt.trim());
        if (validOptions.length < 2) {
            Alert.alert('Error', 'Please provide at least 2 options');
            return;
        }

        onCreatePoll(question.trim(), validOptions);

        // Reset form
        setQuestion('');
        setOptions(['', '']);
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                {/* Header */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: tokens.spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB'
                }}>
                    <Text style={{ fontSize: tokens.typography.xl, fontWeight: 'bold' }}>
                        Create Poll
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ flex: 1, padding: tokens.spacing.md }}>
                    {/* Question Input */}
                    <View style={{ marginBottom: tokens.spacing.lg }}>
                        <Text style={{ fontSize: tokens.typography.base, fontWeight: '600', marginBottom: tokens.spacing.sm }}>
                            Question
                        </Text>
                        <TextInput
                            value={question}
                            onChangeText={setQuestion}
                            placeholder="What's your question?"
                            multiline
                            style={{
                                borderWidth: 1,
                                borderColor: '#D1D5DB',
                                borderRadius: tokens.borderRadius.md,
                                padding: tokens.spacing.sm,
                                fontSize: tokens.typography.base,
                                minHeight: 80,
                                textAlignVertical: 'top'
                            }}
                        />
                    </View>

                    {/* Options */}
                    <View style={{ marginBottom: tokens.spacing.lg }}>
                        <Text style={{ fontSize: tokens.typography.base, fontWeight: '600', marginBottom: tokens.spacing.sm }}>
                            Options
                        </Text>

                        {options.map((option, index) => (
                            <View key={index} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: tokens.spacing.sm
                            }}>
                                <TextInput
                                    value={option}
                                    onChangeText={(value) => updateOption(index, value)}
                                    placeholder={`Option ${index + 1}`}
                                    style={{
                                        flex: 1,
                                        borderWidth: 1,
                                        borderColor: '#D1D5DB',
                                        borderRadius: tokens.borderRadius.md,
                                        padding: tokens.spacing.sm,
                                        fontSize: tokens.typography.base,
                                        marginRight: tokens.spacing.sm
                                    }}
                                />
                                {options.length > 2 && (
                                    <TouchableOpacity onPress={() => removeOption(index)}>
                                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}

                        {/* Add Option Button */}
                        {options.length < 5 && (
                            <TouchableOpacity
                                onPress={addOption}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                    borderColor: '#D1D5DB',
                                    borderStyle: 'dashed',
                                    borderRadius: tokens.borderRadius.md,
                                    padding: tokens.spacing.sm,
                                    marginTop: tokens.spacing.sm
                                }}
                            >
                                <Ionicons name="add" size={20} color="#8B5CF6" />
                                <Text style={{ color: '#8B5CF6', marginLeft: 4 }}>Add Option</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>

                {/* Create Button */}
                <View style={{ padding: tokens.spacing.md }}>
                    <TouchableOpacity
                        onPress={handleCreatePoll}
                        style={{
                            backgroundColor: '#8B5CF6',
                            borderRadius: tokens.borderRadius.md,
                            paddingVertical: tokens.spacing.md,
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: tokens.typography.base, fontWeight: 'bold' }}>
                            Create Poll
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};