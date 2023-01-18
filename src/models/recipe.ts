import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    recipeName: { type: String, required: true, index: true },
    pageBegin: { type: Number, required: true },
    pageEnd: { type: Number, required: true },
    weekName: { type: String, required: true },
    fromPdf: { type: String, required: true },
    language: { type: String, required: true },
    images: { type: [String], required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: {
      currentTime: () => Date.now(),
    },
  }
);

type recipeSchemaType = {
  _id?: any;
  recipeName: string;
  pageBegin: number;
  pageEnd: number;
  weekName: string;
  fromPdf: string;
  language: string;
  images: string[];
  description: string;
};

export default mongoose.model('recipe', recipeSchema);
export { recipeSchemaType };
