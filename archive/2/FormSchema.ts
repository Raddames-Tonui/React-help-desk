// ------ LOGIN FORM SCHEMA -----------
export const loginFormSchema: FormSchema = {
  id: "login-form",
  meta: {
    title: "Login",
    subtitle: "Enter your credentials",
  },
  fields: {
    email: {
      id: "email",
      label: "Email",
      renderer: "text",
      inputType: "email",
      placeholder: "Enter your email",
      rules: {
        required: "Email is required",
        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
      },
    },
    password: {
      id: "password",
      label: "Password",
      renderer: "text",
      inputType: "password",
      placeholder: "Enter your password",
      rules: {
        required: "Password is required",
        minLength: { value: 6, message: "Password must be at least 6 characters" },
      },
    },
  },
  layout: [
    { kind: "field", fieldId: "email" },
    { kind: "field", fieldId: "password" },
  ],
};



// ------SYSTEM SETTINGS FORM SCHEMA------
export const systemSettingsFormSchema: any = {
  id: "system-settings-form",
  meta: {
    title: "System Settings",
    subtitle: "Configure default values for monitored services"
  },
  fields: {
    //  UPTIME 
    uptime_check_interval: {
      id: "uptime_check_interval",
      label: "Uptime Check Interval (seconds)",
      renderer: "number",
      props: { min: 1 },
      defaultValue: 60,
      rules: {
        required: "Interval is required",
        min: { value: 1, message: "Must be >= 1" }
      }
    },
    uptime_retry_count: {
      id: "uptime_retry_count",
      label: "Uptime Retry Count",
      renderer: "number",
      props: { min: 0 },
      defaultValue: 3,
      rules: { required: "Retry count is required" }
    },
    uptime_retry_delay: {
      id: "uptime_retry_delay",
      label: "Uptime Retry Delay (seconds)",
      renderer: "number",
      props: { min: 1 },
      defaultValue: 10,
      rules: { required: "Retry delay is required" }
    },
    sse_push_interval: {
      id: "sse_push_interval",
      label: "SSE Push Interval (seconds)",
      renderer: "number",
      props: { min: 1 },
      defaultValue: 5,
      rules: { required: "SSE push interval is required" }
    },

    //  SSL 
    ssl_check_interval: {
      id: "ssl_check_interval",
      label: "SSL Check Interval (seconds)",
      renderer: "number",
      props: { min: 1 },
      defaultValue: 3600,
      rules: { required: "SSL check interval is required" }
    },
    ssl_alert_thresholds: {
      id: "ssl_alert_thresholds",
      label: "SSL Alert Thresholds (days)",
      renderer: "text",
      defaultValue: "30,14,7",
      rules: { required: "SSL alert thresholds are required" }
    },
    ssl_retry_count: {
      id: "ssl_retry_count",
      label: "SSL Retry Count",
      renderer: "number",
      props: { min: 0 },
      defaultValue: 3,
      rules: { required: "SSL retry count is required" }
    },
    ssl_retry_delay: {
      id: "ssl_retry_delay",
      label: "SSL Retry Delay (seconds)",
      renderer: "number",
      props: { min: 1 },
      defaultValue: 300,
      rules: { required: "SSL retry delay is required" }
    },

    //  NOTIFICATIONS 
    notification_check_interval: {
      id: "notification_check_interval",
      label: "Notification Check Interval (seconds)",
      renderer: "number",
      props: { min: 1 },
      defaultValue: 120,
      rules: { required: "Notification check interval is required" }
    },
    notification_retry_count: {
      id: "notification_retry_count",
      label: "Notification Retry Count",
      renderer: "number",
      props: { min: 0 },
      defaultValue: 5,
      rules: { required: "Notification retry count is required" }
    },
    notification_cooldown_minutes: {
      id: "notification_cooldown_minutes",
      label: "Notification Cooldown (minutes)",
      renderer: "number",
      props: { min: 0 },
      defaultValue: 15,
      rules: { required: "Notification cooldown is required" }
    }
  },

  layout: [
    // Uptime Section
    {
      kind: "section",
      title: "Uptime Settings",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "uptime_check_interval" },
            { kind: "field", fieldId: "uptime_retry_count" },
            { kind: "field", fieldId: "uptime_retry_delay" },
            { kind: "field", fieldId: "sse_push_interval" }
          ]
        }
      ]
    },

    // SSL Section
    {
      kind: "section",
      title: "SSL Settings",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "ssl_check_interval" },
            { kind: "field", fieldId: "ssl_alert_thresholds" },
            { kind: "field", fieldId: "ssl_retry_count" },
            { kind: "field", fieldId: "ssl_retry_delay" }
          ]
        }
      ]
    },

    // Notification Section
    {
      kind: "section",
      title: "Notification Settings",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "notification_check_interval" },
            { kind: "field", fieldId: "notification_retry_count" },
            { kind: "field", fieldId: "notification_cooldown_minutes" }
          ]
        }
      ]
    }
  ]
};



// ------MONITORED SERVICE FORM SCHEMA------
export const monitoredServiceFormSchema: any = {
  id: "monitored-service-form",
  meta: {
    title: "Add / Edit Monitored Service",
    subtitle: "Provide the details of the service you want to monitor"
  },
  fields: {
    monitored_service_name: {
      id: "monitored_service_name",
      label: "Service Name",
      renderer: "text",
      rules: { required: "Service name is required" }
    },
    monitored_service_url: {
      id: "monitored_service_url",
      label: "Service URL",
      renderer: "text",
      rules: {
        required: "URL is required",
        pattern: {
          value: /^https?:\/\/.+/,
          message: "Enter a valid URL starting with http:// or https://"
        }
      }
    },
    monitored_service_region: {
      id: "monitored_service_region",
      label: "Region",
      renderer: "select",
      props: {
        data: ["US-East", "US-West", "EU", "APAC", "Custom"]
      },
      rules: {  }
    },
    check_interval: {
      id: "check_interval",
      label: "Check Interval (seconds)",
      renderer: "number",
      props: { min: 10, max: 86400 },
    //   rules: { required: "Check interval is required" }
    },
    is_active: {
      id: "is_active",
      label: "Active",
      renderer: "switch",
      defaultValue: true
    },
    retry_count: {
      id: "retry_count",
      label: "Retry Count",
      renderer: "number",
      props: { min: 0, max: 10 },
      defaultValue: 3
    },
    retry_delay: {
      id: "retry_delay",
      label: "Retry Delay (seconds)",
      renderer: "number",
      props: { min: 0, max: 300 },
      defaultValue: 10
    },
    expected_status_code: {
      id: "expected_status_code",
      label: "Expected Status Code",
      renderer: "number",
      props: { min: 100, max: 599 },
      defaultValue: 200
    },
    ssl_enabled: {
      id: "ssl_enabled",
      label: "SSL Enabled",
      renderer: "switch",
      defaultValue: true
    }
  },
  layout: [
    {
      kind: "section",
      title: "Basic Information",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "monitored_service_name" },
            { kind: "field", fieldId: "monitored_service_url" }
          ]
        },
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "monitored_service_region" },
            { kind: "field", fieldId: "check_interval" }
          ]
        },
        {
          kind: "grid",
          cols: 1,
          spacing: "md",
          children: [{ kind: "field", fieldId: "is_active" }]
        }
      ]
    },
    {
      kind: "section",
      title: "Retry & Status Settings",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 3,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "retry_count" },
            { kind: "field", fieldId: "retry_delay" },
            { kind: "field", fieldId: "expected_status_code" }
          ]
        },
        { kind: "field", fieldId: "ssl_enabled" }
      ]
    }
  ]
};
