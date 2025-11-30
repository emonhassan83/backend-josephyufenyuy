import { Model, Types } from 'mongoose';

export interface TContents {
  _id?: string;
  termsAndConditions?: string;
  privacyPolicy?: string;
  aboutUs?: string;
  
  createdBy: Types.ObjectId;
  isDeleted?: boolean;
}

export type TContentsModel = Model<TContents, Record<string, unknown>>;
