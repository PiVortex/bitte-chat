import { generateId } from "ai";
import { Message, useChat } from "ai/react";
import { ArrowDown } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Hex } from "viem";
import { defaultColors } from "../../lib/constants";
import { BITTE_IMG } from "../../lib/images";
import { cn } from "../../lib/utils";
import {
  AssistantsMode,
  BitteAiChatProps,
  ChatRequestBody
} from "../../types/types";
import { useAccount } from "../AccountContext";
import { Button } from "../ui/button";
import { BitteSpinner } from "./BitteSpinner";
import { SmartActionsInput } from "./ChatInput";
import { MessageGroup } from "./MessageGroup";

export const ChatContent = ({
  agentId,
  colors = defaultColors,
  apiUrl,
  apiKey,
  options,
  messages: initialMessages,
  welcomeMessageComponent,
}: BitteAiChatProps) => {
  const chatId = useRef(options?.chatId || generateId()).current;
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const { accountId, evmAddress, chainId, evmWallet } = useAccount();

  const {
    borderColor,
    buttonColor,
    generalBackground,
    messageBackground,
    textColor,
  } = colors;

  const {
    messages,
    input,
    handleInputChange,
    isLoading: isInProgress,
    handleSubmit,
    reload,
    error,
    addToolResult,
  } = useChat({
    id: chatId,
    api: apiUrl,
    onToolCall: async ({ toolCall }) => {
      console.log('Tool call received:', toolCall);
      
      const localAgent = options?.localAgent;
      if (!localAgent) {
        console.log('No local agent configured, skipping tool call');
        return;
      }

      const baseUrl = localAgent.spec.servers?.[0]?.url;
      console.log('Base URL:', baseUrl);

      // Find the matching tool path and method from the spec
      let toolPath: string | undefined;
      let httpMethod: string | undefined;

      Object.entries(localAgent.spec.paths).forEach(([path, pathObj]: [string, any]) => {
        Object.entries(pathObj).forEach(([method, methodObj]: [string, any]) => {
          if (methodObj.operationId === toolCall.toolName) {
            toolPath = path;
            httpMethod = method.toUpperCase();
            console.log(`Found matching tool: path=${path}, method=${method}`);
          }
        });
      });

      if (!toolPath || !httpMethod) {
        console.error("Tool path or method not found for:", toolCall.toolName);
        return;
      }

      try {
        // Build URL with path parameters
        let url = `${baseUrl}${toolPath}`;
        const args = toolCall.args ? JSON.parse(JSON.stringify(toolCall.args)) : {};
        const remainingArgs = { ...args };
        console.log('Initial args:', args);

        // Replace path parameters if any
        url = url.replace(/\{(\w+)\}/g, (_, key) => {
          if (remainingArgs[key] === undefined) {
            throw new Error(`Missing required path parameter: ${key}`);
          }
          const value = remainingArgs[key];
          delete remainingArgs[key];
          console.log(`Replacing path parameter ${key}=${value}`);
          return encodeURIComponent(String(value));
        });
        console.log('URL after path parameter replacement:', url);

        // Setup request
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };

        const fetchOptions: RequestInit = { 
          method: httpMethod,
          headers
        };

        // Handle query parameters for GET requests
        if (httpMethod === 'GET') {
          const queryParams = new URLSearchParams();
          Object.entries(remainingArgs)
            .filter(([_, value]) => value != null)
            .forEach(([key, value]) => queryParams.append(key, String(value)));

          const queryString = queryParams.toString();
          if (queryString) {
            url += (url.includes("?") ? "&" : "?") + queryString;
            console.log('URL with query parameters:', url);
          }
        } else {
          // Add body for non-GET requests
          fetchOptions.body = JSON.stringify(remainingArgs);
          console.log('Request body:', fetchOptions.body);
        }

        console.log('Making request:', { url, ...fetchOptions });
        const response = await fetch(url, fetchOptions);
        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(
            `HTTP error during tool execution: ${response.status} ${response.statusText}`
          );
        }

        // Parse response based on content type
        const contentType = response.headers.get("Content-Type") || "";
        console.log('Response content type:', contentType);
        
        const result = await (contentType.includes("application/json")
          ? response.json()
          : contentType.includes("text")
            ? response.text()
            : response.blob());
        console.log('Parsed response:', result);

        addToolResult({
          toolCallId: toolCall.toolCallId,
          result: {
            content: JSON.stringify(result)
          },
        });
        console.log('Tool result added successfully');

      } catch (error) {
        console.error("Error executing tool call:", error);
        addToolResult({
          toolCallId: toolCall.toolCallId,
          result: {
            content: "Error executing tool call: " + (error as Error).message,
          },
        });
      }
    },
    onError: (e) => {
      console.error(e);
    },
    sendExtraMessageFields: true,
    initialMessages,
    credentials: "omit",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: {
      id: chatId,
      config: {
        mode: AssistantsMode.DEFAULT,
        agentId,
      },
      accountId: accountId || "",
      evmAddress: evmAddress as Hex,
      chainId,
      localAgent: options?.localAgent,
    } satisfies ChatRequestBody,
  });

  const groupedMessages = useMemo(() => {
    return messages?.reduce<Message[][]>((groups, message) => {
      if (message.role === "user") {
        groups.push([message]);
      } else {
        const lastGroup = groups[groups.length - 1];
        if (!lastGroup || lastGroup[0].role === "user") {
          groups.push([message]);
        } else {
          lastGroup.push(message);
        }
      }
      return groups;
    }, []);
  }, [messages]);

  const scrollToBottom = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useLayoutEffect(() => {
    if (isAtBottom && autoScrollEnabled) {
      requestAnimationFrame(() => {
        scrollToBottom(messagesRef.current);
      });
    }
  }, [messages, isAtBottom, autoScrollEnabled, scrollToBottom]);

  const handleSubmitChat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleScroll = useCallback(() => {
    if (messagesRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setIsAtBottom(atBottom);
      setAutoScrollEnabled(atBottom);
    }
  }, []);

  useEffect(() => {
    const scrollElement = messagesRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  const scrollToBottomHandler = useCallback(() => {
    scrollToBottom(messagesRef.current);
    setAutoScrollEnabled(true);
  }, [scrollToBottom]);

  return (
    <div className='bitte-flex bitte-h-full bitte-w-full bitte-flex-col bitte-gap-4 bitte-text-justify'>
      <div
        className='bitte-relative bitte-flex bitte-min-h-[220px] lg:bitte-min-h-[360px] bitte-w-full bitte-h-full bitte-grow-0 bitte-overflow-y-auto lg:bitte-rounded-md bitte-max-lg:flex-col bitte-border-t bitte-border-b lg:bitte-border lg:bitte-px-6'
        style={{
          backgroundColor: generalBackground,
          borderColor: borderColor,
        }}
      >
        {!isAtBottom ? (
          <Button
            size='icon'
            variant='outline'
            className='bitte-absolute bitte-bottom-2 bitte-left-1/2 bitte--translate-x-1/2 hover:bitte-bg-inherit bitte-z-[99]'
            style={{
              backgroundColor: generalBackground,
              borderRadius: "9999px",
            }}
            onClick={scrollToBottomHandler}
          >
            <ArrowDown
              className='bitte-h-4 bitte-w-4'
              style={{ color: textColor }}
            />
          </Button>
        ) : null}

        <div
          ref={messagesRef}
          className='bitte-flex bitte-h-full bitte-w-full bitte-justify-center bitte-overflow-y-auto bitte-p-4'
        >
          <div
            className={cn(
              "bitte-mx-auto bitte-flex bitte-w-full bitte-flex-col md:bitte-mx-24 2xl:bitte-mx-56",
              !!agentId
                ? "bitte-h-[calc(100%-240px)]"
                : "bitte-h-[calc(100%-208px)]"
            )}
          >
            {messages.length === 0 &&
              (welcomeMessageComponent ? (
                welcomeMessageComponent
              ) : (
                <div className='bitte-flex bitte-flex-col bitte-gap-4 bitte-items-center bitte-justify-center bitte-absolute bitte-left-1/2 bitte--translate-x-1/2 bitte-top-1/2 bitte--translate-y-1/2 bitte-text-center bitte-w-full'>
                  <img className='bitte-mx-auto bitte-mb-4' src={BITTE_IMG} />
                  <div className='bitte-mb-14 bitte-text-[20px] bitte-font-medium bitte-text-gray-40'>
                    Execute Transactions with AI
                  </div>
                </div>
              ))}
            <div className='bitte-flex bitte-w-full bitte-flex-col bitte-gap-4 bitte-py-6'>
              {groupedMessages.map((messages: Message[]) => {
                const groupKey = `group-${messages?.[0]?.id}`;
                return (
                  <MessageGroup
                    chatId={chatId}
                    key={groupKey}
                    groupKey={groupKey}
                    accountId={accountId!}
                    messages={messages}
                    isLoading={isInProgress}
                    messageBackgroundColor={messageBackground!}
                    borderColor={borderColor!}
                    textColor={textColor!}
                    agentImage={options?.agentImage}
                  />
                );
              })}
              {error && (
                <div className='bitte-flex bitte-flex-col bitte-items-center bitte-justify-center bitte-space-y-2 bitte-px-6 bitte-pb-6 bitte-text-center bitte-text-sm'>
                  {!accountId && !evmAddress ? (
                    <p>
                      An error occurred. <br />
                      Please connect your wallet and try again.
                    </p>
                  ) : (
                    <>
                      <p>An error occurred.</p>
                      <Button
                        type='button'
                        variant='default'
                        size='sm'
                        onClick={() => reload()}
                      >
                        Retry
                      </Button>
                    </>
                  )}
                </div>
              )}
              {isInProgress ? (
                <div className='bitte-flex bitte-w-full bitte-flex-col bitte-items-center bitte-justify-center bitte-text-gray-600'>
                  <BitteSpinner
                    width={100}
                    height={100}
                    color={textColor || defaultColors.textColor}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div
        className='bitte-z-10 lg:bitte-rounded-md bitte-border-t bitte-border-b lg:bitte-border bitte-p-6'
        style={{
          backgroundColor: generalBackground,
          borderColor: borderColor,
        }}
      >
        <SmartActionsInput
          input={input}
          handleChange={handleInputChange}
          handleSubmit={handleSubmitChat}
          isLoading={isInProgress}
          buttonColor={buttonColor!}
          borderColor={borderColor!}
          textColor={textColor!}
          backgroundColor={generalBackground!}
          agentName={options?.agentName}
        />
      </div>
    </div>
  );
};
