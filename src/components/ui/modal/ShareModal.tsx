import React, { useState } from "react";

import { useWindowSize } from "../../../hooks/useWindowSize";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Drawer, DrawerContent, DrawerFooter } from "../drawer";
import { Input } from "../input";
import { Label } from "../label";

interface ShareModalProps {
  title: string;
  shareText: string;
  trigger: JSX.Element;
  shareLink: string;
  subtitle?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  title,
  shareText,
  trigger,
  shareLink,
  subtitle,
}) => {
  const [open, setOpen] = useState(false);
  const [showLinkCopiedText, setShowLinkCopiedText] = useState(false);

  const { width } = useWindowSize();
  const isMobile = !!width && width < 640;

  const social = {
    twitter: `https://twitter.com/intent/tweet?url=${shareLink}&text=${shareText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareLink}`,
    telegram: `https://telegram.me/share/url?url=${shareLink}&text=${shareText}`,
  };

  const handleCopyLink = async () => {
    const url = new URL(shareLink);

    await navigator.clipboard.writeText(url.href);

    setShowLinkCopiedText(true);
    setTimeout(() => setShowLinkCopiedText(false), 3000);
  };

  const dialogTitleInfo = (
    <>
      <DialogTitle className='mb-2 text-[20px] font-semibold'>
        {title}
      </DialogTitle>
      {subtitle && <p className='text-[14px]'>{subtitle}</p>}
    </>
  );

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className='sm:w-[400px]'>
          <DialogHeader>
            <DialogTitle className='mb-2 text-center text-xl text-gray-800'>
              {title}
            </DialogTitle>
            <DialogDescription className='text-center text-gray-800'>
              {subtitle}
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4 grid w-full max-w-sm items-center gap-1.5'>
            <Label htmlFor='smart-action-link' className='text-gray-800'>
              Link
            </Label>
            <Input
              id='smart-action-link'
              value={shareLink}
              readOnly
              className='text-gray-800'
            />
          </div>
          <div className='flex items-center gap-4'>
            <Button
              className='w-full'
              variant='outline'
              onClick={() => window.open(social.twitter, "_blank")}
            >
              <img src='/twitter_black.svg' className='theme-icon h-5 w-5' />
            </Button>
            <Button
              className='w-full'
              variant='outline'
              onClick={() => window.open(social.telegram, "_blank")}
            >
              <img src='/telegram_black.svg' className='theme-icon h-5 w-5' />
            </Button>
            <Button
              className='w-full'
              variant='outline'
              onClick={() => window.open(social.facebook, "_blank")}
            >
              <img src='/facebook_black.svg' className='theme-icon h-5 w-5' />
            </Button>
          </div>
          <div>
            <Button className='w-full' onClick={handleCopyLink}>
              {showLinkCopiedText ? "Copied" : "Copy Link"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DialogTrigger className='border-0 focus:ring-0' asChild>
        {trigger}
      </DialogTrigger>
      <DrawerContent className='flex gap-4 px-2'>
        <div className='text-center text-gray-800'>{dialogTitleInfo}</div>
        <div className='mt-4 grid w-full items-center gap-1.5'>
          <Label htmlFor='smart-action-link' className='text-gray-800'>
            Link
          </Label>
          <Input
            id='smart-action-link'
            value={shareLink}
            readOnly
            className='text-gray-800'
          />
        </div>
        <div className='flex items-center gap-4'>
          <Button
            className='w-full'
            variant='outline'
            onClick={() => window.open(social.twitter, "_blank")}
          >
            <img src='/twitter_black.svg' className='theme-icon h-5 w-5' />
          </Button>
          <Button
            className='w-full'
            variant='outline'
            onClick={() => window.open(social.telegram, "_blank")}
          >
            <img src='/telegram_black.svg' className='theme-icon h-5 w-5' />
          </Button>
          <Button
            className='w-full'
            variant='outline'
            onClick={() => window.open(social.facebook, "_blank")}
          >
            <img src='/facebook_black.svg' className='theme-icon h-5 w-5' />
          </Button>
        </div>
        <DrawerFooter className='gap-4 border-t border-shad-gray-20 p-4'>
          <div>
            <Button className='w-full' onClick={handleCopyLink}>
              {showLinkCopiedText ? "Copied" : "Copy Link"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ShareModal;
