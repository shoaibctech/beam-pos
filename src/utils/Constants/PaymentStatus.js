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

export { PaymentStatus, RefundStatus };
