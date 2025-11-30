import { Schema, model } from 'mongoose';
import { TContents } from './contents.interface';

const contentsSchema = new Schema<TContents>(
  {
    termsAndConditions: { type: String, default: '' },
    privacyPolicy: { type: String, default: '' },
    aboutUs: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

export const Contents = model<TContents>('Contents', contentsSchema);
