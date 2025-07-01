import { Integration, IntegrationType } from "@shared/types";

export const INTEGRATIONS: Integration[] = [
  {
    id: "trigger-webhook",
    name: "Webhook Trigger",
    type: "trigger",
    description: "Start workflow when a webhook is called",
    icon: "Webhook",
    color: "hsl(var(--integration-webhook))",
    category: "trigger",
    fields: [
      {
        key: "webhook_url",
        label: "Webhook URL",
        type: "text",
        required: true,
        placeholder: "https://your-webhook-url.com",
        description: "URL that will trigger this workflow",
      },
      {
        key: "method",
        label: "HTTP Method",
        type: "select",
        required: true,
        options: [
          { label: "POST", value: "POST" },
          { label: "GET", value: "GET" },
          { label: "PUT", value: "PUT" },
          { label: "DELETE", value: "DELETE" },
        ],
      },
    ],
  },
  {
    id: "gmail-send",
    name: "Gmail",
    type: "gmail",
    description: "Send emails via Gmail",
    icon: "Mail",
    color: "hsl(var(--integration-gmail))",
    category: "action",
    fields: [
      {
        key: "to",
        label: "To",
        type: "text",
        required: true,
        placeholder: "recipient@example.com",
        description: "Email address of the recipient",
      },
      {
        key: "subject",
        label: "Subject",
        type: "text",
        required: true,
        placeholder: "Email subject",
        description: "Subject line for the email",
      },
      {
        key: "body",
        label: "Body",
        type: "textarea",
        required: true,
        placeholder: "Email content...",
        description: "Email body content",
      },
      {
        key: "cc",
        label: "CC",
        type: "text",
        placeholder: "cc@example.com",
        description: "Carbon copy recipients (optional)",
      },
    ],
  },
  {
    id: "slack-message",
    name: "Slack",
    type: "slack",
    description: "Send messages to Slack channels",
    icon: "MessageCircle",
    color: "hsl(var(--integration-slack))",
    category: "action",
    fields: [
      {
        key: "channel",
        label: "Channel",
        type: "text",
        required: true,
        placeholder: "#general",
        description: "Slack channel to send message to",
      },
      {
        key: "message",
        label: "Message",
        type: "textarea",
        required: true,
        placeholder: "Your message...",
        description: "Message content to send",
      },
      {
        key: "username",
        label: "Username",
        type: "text",
        placeholder: "Bot Name",
        description: "Display name for the bot (optional)",
      },
    ],
  },
  {
    id: "http-request",
    name: "HTTP Request",
    type: "http",
    description: "Make HTTP requests to any API",
    icon: "Globe",
    color: "hsl(var(--integration-http))",
    category: "action",
    fields: [
      {
        key: "url",
        label: "URL",
        type: "text",
        required: true,
        placeholder: "https://api.example.com/endpoint",
        description: "URL to make the request to",
      },
      {
        key: "method",
        label: "Method",
        type: "select",
        required: true,
        options: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
          { label: "DELETE", value: "DELETE" },
          { label: "PATCH", value: "PATCH" },
        ],
      },
      {
        key: "headers",
        label: "Headers",
        type: "json",
        placeholder: '{"Content-Type": "application/json"}',
        description: "HTTP headers as JSON object",
      },
      {
        key: "body",
        label: "Body",
        type: "json",
        placeholder: '{"key": "value"}',
        description: "Request body as JSON (for POST/PUT requests)",
      },
    ],
  },
  {
    id: "sheets-append",
    name: "Google Sheets",
    type: "sheets",
    description: "Add data to Google Sheets",
    icon: "FileSpreadsheet",
    color: "hsl(var(--integration-sheets))",
    category: "action",
    fields: [
      {
        key: "spreadsheet_id",
        label: "Spreadsheet ID",
        type: "text",
        required: true,
        placeholder: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        description: "Google Sheets spreadsheet ID",
      },
      {
        key: "range",
        label: "Range",
        type: "text",
        required: true,
        placeholder: "Sheet1!A:Z",
        description: "Cell range to append data to",
      },
      {
        key: "values",
        label: "Values",
        type: "json",
        required: true,
        placeholder: '[["Value 1", "Value 2", "Value 3"]]',
        description: "Values to append as JSON array",
      },
    ],
  },
  {
    id: "paypal-payment",
    name: "PayPal",
    type: "paypal",
    description: "Process PayPal payments",
    icon: "CreditCard",
    color: "hsl(var(--integration-paypal))",
    category: "action",
    fields: [
      {
        key: "amount",
        label: "Amount",
        type: "number",
        required: true,
        placeholder: "10.00",
        description: "Payment amount",
      },
      {
        key: "currency",
        label: "Currency",
        type: "select",
        required: true,
        options: [
          { label: "USD", value: "USD" },
          { label: "EUR", value: "EUR" },
          { label: "GBP", value: "GBP" },
          { label: "CAD", value: "CAD" },
        ],
      },
      {
        key: "description",
        label: "Description",
        type: "text",
        required: true,
        placeholder: "Payment for services",
        description: "Payment description",
      },
    ],
  },
];

export function getIntegrationById(id: string): Integration | undefined {
  return INTEGRATIONS.find((integration) => integration.id === id);
}

export function getIntegrationsByCategory(
  category: "trigger" | "action" | "logic",
): Integration[] {
  return INTEGRATIONS.filter(
    (integration) => integration.category === category,
  );
}

export function getIntegrationIcon(type: IntegrationType): string {
  const integration = INTEGRATIONS.find((i) => i.type === type);
  return integration?.icon || "Circle";
}

export function getIntegrationColor(type: IntegrationType): string {
  const integration = INTEGRATIONS.find((i) => i.type === type);
  return integration?.color || "hsl(var(--muted))";
}
