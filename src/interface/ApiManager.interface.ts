import React, { Ref, SetStateAction } from 'react';

export interface ApiManagerInquiryFromInterface {
   id: string;
   form_id: string;
   form_name: string;
   status: boolean;
   email_notification: boolean;
   turnstile_enabled: boolean;
   turnstile_site_key: string;
   turnstile_mode: TurnstileModeType;
   turnstile_secret_key: string;
   allowed_domains: string;
   turnstile_verification_status:
      | 'pending_verification'
      | 'verified'
      | 'failed';
}

export interface ListInquiryFromColumnsInterface {
   showApiKey: boolean;
   showModal: boolean;
   setViewTurnStileDetails: React.Dispatch<
      React.SetStateAction<ViewTurnstileData | null>
   >;
   setShowTurnStileDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
   setInquiryFormId: React.Dispatch<React.SetStateAction<string>>;
   setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
   setShowApiKey: React.Dispatch<SetStateAction<boolean>>;
   handleClickOnCopyBtn: (text: string, message: string) => void;
   completeVerificationBtn: (data: ApiManagerInquiryFromInterface) => void;
   handleEditTurnstile: (data: ApiManagerInquiryFromInterface) => void;
}

export type TurnstileModeType = 'non-interactive' | 'invisible' | 'managed';

export interface TurnstileSetupFormData {
   allowed_domains: string[];
   turnstile_site_key: string;
   turnstile_secret_key: string;
   turnstile_mode: TurnstileModeType;
}

export interface ViewTurnstileData {
   allowed_domains: string;
   turnstile_site_key: string;
   turnstile_mode: TurnstileModeType | '';
   email_notification: boolean;
   turnstile_enabled: boolean;
}

export interface AddTurnstileSetupDrawerProps {
   loading: boolean;
   showModal: boolean;
   setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
   handelFormSubmitFunction: (
      data: TurnstileSetupFormData,
      callback: () => void
   ) => void;
   turnstileData?: Partial<TurnstileSetupFormData> | null;
}

export interface ViewTurnStileModalPropsInterface {
   showModal: boolean;
   setShowModal: (value: boolean) => void;
   turnstileData: ViewTurnstileData | null;
   handleClickOnCopyBtn: (text: string, message: string) => void;
}

export interface TurnstileSecretKeyVerificationModalPropsInterface {
   showModal: boolean;
   setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
   handleClickOnCopyBtn: (text: string, message: string) => void;
   onCloseModal?: () => void;
   onVerifySetup: () => void;
}

export type VerificationModalState =
   | 'instruction'
   | 'verifying'
   | 'success'
   | 'failed';

export interface TurnstileVerificationModalPropsInterface {
   showModal: boolean;
   setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
   formId: string;
   siteKey: string;
   handleClickOnCopyBtn: (text: string, message: string) => void;
   onVerifyToken: (
      token: string
   ) => Promise<{ success: boolean; message?: string }>;
   onVerified?: () => void;
}

export interface RenderTurnstileInstructionState {
   handleCopyDomain: () => void;
   errorMessage: string;
   siteKey: string;
   widgetResetKey: number;
   formId: string;
   widgetContainerRef: Ref<HTMLDivElement>;
}
