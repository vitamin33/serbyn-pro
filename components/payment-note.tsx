export function PaymentNote() {
  return (
    <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-muted">
      <p className="text-sm text-muted-foreground">
        <strong>Payments:</strong> USD-denominated, crypto preferred
        (USDT/USDC/ETH/SOL). Weekly for retainers; fixed milestones 30% deposit,
        balance on acceptance. Client covers gas.
      </p>
    </div>
  );
}
