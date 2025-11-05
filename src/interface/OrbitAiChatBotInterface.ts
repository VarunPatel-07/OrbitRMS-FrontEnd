import { SelectedFileArrayObjInterface } from './interface';

export interface ChatWindowModalInterface {
  showModal: boolean;
  handelClickOnCloseBtn: () => void;
  orbitAiBaseData: OrbitAiFormDataInterface | null;
  successEventHandler?: (content: string) => void;
}
export interface OrbitAiFormDataInterface {
  caption: string;
  existing_images: string[];
  platforms: string[];
  new_images: SelectedFileArrayObjInterface[];
}
