import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";

export const ShowDetailsBtn = ({
  setShowDetails,
  showDetails,
  displayName,
  textColor,
}: {
  setShowDetails: (showDetails: boolean) => void;
  showDetails: boolean;
  displayName: string;
  textColor: string;
}): JSX.Element => {
  return (
    <div
      className='flex cursor-pointer items-center justify-center gap-2 bg-shad-white-30 py-4'
      onClick={() => setShowDetails(!showDetails)}
    >
      {showDetails ? (
        <ChevronsDownUp width={16} height={16} style={{ color: textColor }} />
      ) : (
        <ChevronsUpDown width={16} height={16} style={{ color: textColor }} />
      )}
      <span className='text-[12px]' style={{ color: textColor }}>
        {displayName}
      </span>
    </div>
  );
};
