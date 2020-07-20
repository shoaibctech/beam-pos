const PaymentStatus = {
    PENDING: "Pending",
    PENDING_APPROVAL: "Pending Approval",
    OAUTH_CALLBACK_COMPLETE: "OAuth Callback Complete",
    AUTHORISED: "Authorised",
    SETTLEMENT_PENDING: "Settlement Pending",
    SETTLEMENT_IN_PROGRESS: "Settlement in Progress",
    SETTLEMENT_COMPLETE: "Settlement Complete",
    PAYMENT_RECEIVED: "Payment Received",
    TIMEOUT: "Timeout",
    CONSENT_API_REJECTED: "Consent Api Rejected",
    DECLINED: "Declined",
    CONSENT_TIMEOUT: "Consent Timeout",
    SETTLEMENT_REJECTED: "Settlement Rejected",
    UNKNOWN: "Unknown",
    UNEXPECTED_ERROR: "Unexpected Error"
};

const RefundStatus = {
    REFUND_REJECTED: "Refund Rejected",
    REFUND_COMPLETE: "Refund Complete",
    REFUND_PENDING: "Refund Pending"
};

const PaymentStatusMessage = {
    PENDING: " is pending",
    PENDING_APPROVAL: "is pending.",
    OAUTH_CALLBACK_COMPLETE: " has Completed successfylly.",
    AUTHORISED: " has been authorised.",
    SETTLEMENT_PENDING: " is Pending.",
    SETTLEMENT_IN_PROGRESS: " is in settlement progress.",
    SETTLEMENT_COMPLETE: " has been Completed successfully.",
    PAYMENT_RECEIVED: " is successfully Received.",
    TIMEOUT: " has been failed.",
    CONSENT_API_REJECTED: " has rejected.",
    DECLINED: "is declined.",
    CONSENT_TIMEOUT: " has been failed.",
    SETTLEMENT_REJECTED: " has been rejected.",
    UNKNOWN: "Unknown state.",
    UNEXPECTED_ERROR: " has been failed."
};

const PaymentStatusImage = {
    PENDING: true,
    PENDING_APPROVAL: true,
    OAUTH_CALLBACK_COMPLETE: true,
    AUTHORISED: true,
    SETTLEMENT_PENDING: true,
    SETTLEMENT_IN_PROGRESS: true,
    SETTLEMENT_COMPLETE: true,
    PAYMENT_RECEIVED: true,
    TIMEOUT: false,
    CONSENT_API_REJECTED: false,
    DECLINED: false,
    CONSENT_TIMEOUT: false,
    SETTLEMENT_REJECTED: false,
    UNKNOWN: false,
    UNEXPECTED_ERROR: false
};
export { PaymentStatus, RefundStatus, PaymentStatusMessage, PaymentStatusImage };
