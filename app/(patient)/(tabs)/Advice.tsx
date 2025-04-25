import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/app/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { DeepSeekService } from "@/app/services/DeepSeekService";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface FormattedText {
  type: "heading" | "text" | "bullet" | "note" | "section";
  content: string;
}

export default function Advice() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your health assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await DeepSeekService.getHealthAdvice(userMessage.text);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageText = (text: string): FormattedText[] => {
    const parts: FormattedText[] = [];
    const lines = text.split("\n");

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) return;

      // Handle headings
      if (trimmedLine.startsWith("###")) {
        parts.push({
          type: "heading",
          content: trimmedLine.replace("###", "").trim(),
        });
      }
      // Handle section titles (like "Key Points:")
      else if (trimmedLine.endsWith(":")) {
        parts.push({
          type: "section",
          content: trimmedLine,
        });
      }
      // Handle bullet points
      else if (trimmedLine.startsWith("•")) {
        parts.push({
          type: "bullet",
          content: trimmedLine.substring(1).trim(),
        });
      }
      // Handle note/disclaimer
      else if (
        trimmedLine.startsWith("*Note:") ||
        trimmedLine.startsWith("*")
      ) {
        parts.push({
          type: "note",
          content: trimmedLine.replace(/^\*|\*$/g, "").trim(),
        });
      }
      // Handle regular text
      else {
        parts.push({
          type: "text",
          content: trimmedLine,
        });
      }
    });

    return parts;
  };

  const renderFormattedMessage = (message: Message) => {
    if (message.isUser) {
      return (
        <Text style={[styles.messageText, { color: colors.text }]}>
          {message.text}
        </Text>
      );
    }

    const formattedParts = formatMessageText(message.text);

    return (
      <View style={styles.formattedMessage}>
        {formattedParts.map((part, index) => {
          switch (part.type) {
            case "heading":
              return (
                <Text
                  key={index}
                  style={[styles.heading, { color: colors.text }]}
                >
                  {part.content}
                </Text>
              );
            case "section":
              return (
                <Text
                  key={index}
                  style={[styles.section, { color: colors.text }]}
                >
                  {part.content}
                </Text>
              );
            case "bullet":
              return (
                <View key={index} style={styles.bulletContainer}>
                  <Text style={[styles.bullet, { color: colors.text }]}>•</Text>
                  <Text style={[styles.bulletText, { color: colors.text }]}>
                    {part.content}
                  </Text>
                </View>
              );
            case "note":
              return (
                <Text
                  key={index}
                  style={[styles.note, { color: colors.secondary }]}
                >
                  {part.content}
                </Text>
              );
            default:
              return (
                <Text
                  key={index}
                  style={[styles.messageText, { color: colors.text }]}
                >
                  {part.content}
                </Text>
              );
          }
        })}
      </View>
    );
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.assistantMessage,
        {
          backgroundColor: message.isUser ? colors.primary + "20" : colors.card,
        },
      ]}
    >
      {!message.isUser && (
        <View style={styles.assistantIcon}>
          <Ionicons name="medical" size={24} color={colors.primary} />
        </View>
      )}
      <View style={styles.messageContent}>
        {renderFormattedMessage(message)}
        <Text style={[styles.timestamp, { color: colors.secondary }]}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Ionicons name="medical" size={24} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Health Assistant
        </Text>
        <View
          style={[styles.statusIndicator, { backgroundColor: "#4CAF50" }]}
        />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
      >
        {messages.map(renderMessage)}
        {isLoading && (
          <View
            style={[styles.loadingContainer, { backgroundColor: colors.card }]}
          >
            <ActivityIndicator color={colors.primary} />
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <TextInput
          style={[
            styles.input,
            { color: colors.text, backgroundColor: colors.background },
          ]}
          placeholder="Ask me anything..."
          placeholderTextColor={colors.secondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: colors.primary },
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  messageContainer: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    maxWidth: "85%",
    alignSelf: "flex-start",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  assistantMessage: {
    alignSelf: "flex-start",
  },
  assistantIcon: {
    marginRight: 12,
    alignSelf: "flex-start",
  },
  messageContent: {
    flex: 1,
  },
  formattedMessage: {
    gap: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 4,
  },
  section: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },
  bulletContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: 8,
    marginBottom: 4,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },
  note: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 12,
    lineHeight: 20,
    opacity: 0.8,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  loadingContainer: {
    padding: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
