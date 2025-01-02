import React, { useMemo } from "react";

import { Share } from "lucide-react";
import { useIsClient } from "../../hooks/useIsClient";
import ShareModal from "../ui/modal/ShareModal";
import { Button } from "../ui/button";

interface ShareDropButtonProps {
  dropId: string;
  isSuccess?: boolean;
  isActions?: boolean;
  isApps?: boolean;
  hoverState?: string | null;
}

const ShareDropButton: React.FC<ShareDropButtonProps> = ({
  dropId,
  isSuccess,
  isActions,
  isApps,
  hoverState,
}) => {
  const isClient = useIsClient();

  const shareLink = useMemo(
    () => (isClient ? `${window.location.origin}/claim/${dropId}` : ""),
    [isClient, dropId]
  );

  return (
    <ShareModal
      title='Share Token Drop'
      subtitle='Anyone who has this link and an Bitte Wallet account will be
        able to mint this token drop.'
      shareLink={shareLink}
      shareText='Check my Token Drop on Bitte Wallet!'
      trigger={
        isActions ? (
          <span
            className={`flex cursor-pointer items-center gap-1 ${
              isApps ? "text-white" : "text-gray-800"
            }`}
          >
            <Share size={16} color={isApps ? "#FFFFFF" : "#0f172a"} />
            Share
          </span>
        ) : isApps ? (
          <div
            className={`flex cursor-pointer items-center justify-center rounded-md border border-[#313E52] px-2 py-1 ease-out hover:border-none ${
              hoverState === dropId
                ? "border-none bg-white"
                : "bg-[#414D7D40] backdrop-blur-sm"
            } transition-all duration-500 ease-in-out`}
          >
            <p
              className={`text-sm font-normal ${
                hoverState === dropId ? "text-black" : "text-white"
              }`}
            >
              Share
            </p>
          </div>
        ) : (
          <Button
            className={
              !isSuccess
                ? "hover:bg-shad-slate-30 font-semi-bold bg-shad-white-10 text-gray-800"
                : "w-full bg-transparent"
            }
            {...(isSuccess && { variant: "outline" })}
          >
            Share
          </Button>
        )
      }
    />
  );
};

export default ShareDropButton;
