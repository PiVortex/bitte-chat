import { TransactionButtonProps } from "../../../types";
import { Button } from "../../ui/button";

const DefaultTxApproveButton: React.FC<TransactionButtonProps> = ({
  onClick,
  disabled,
  isLoading,
  textColor,
}) => (
  <Button
    className='bitte-w-1/2'
    onClick={onClick}
    disabled={disabled}
    style={{
      color: textColor,
    }}
  >
    {isLoading ? "Confirming..." : "Approve"}
  </Button>
);

export default DefaultTxApproveButton;
